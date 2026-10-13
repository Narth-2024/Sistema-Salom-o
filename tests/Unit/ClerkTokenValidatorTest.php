<?php

namespace Tests\Unit;

use App\Services\ClerkTokenException;
use App\Services\ClerkTokenValidator;
use Firebase\JWT\JWT;
use Tests\Concerns\FakesClerkJwt;
use Tests\TestCase;

class ClerkTokenValidatorTest extends TestCase
{
    use FakesClerkJwt;

    private ClerkTokenValidator $validator;

    protected function setUp(): void
    {
        parent::setUp();

        $this->setUpClerkJwt();
        $this->configureClerk();
        $this->validator = $this->clerkValidator();
    }

    public function test_accepts_a_token_signed_by_the_instance_key(): void
    {
        $payload = $this->validator->validate($this->clerkJwt());

        $this->assertSame('user_test123', $payload->sub);
        $this->assertSame($this->clerkIssuer, $payload->iss);
    }

    public function test_rejects_a_token_signed_by_another_key(): void
    {
        // Outro par de chaves: simula um token emitido para outra instância.
        $other = openssl_pkey_new([
            'private_key_bits' => 2048,
            'private_key_type' => OPENSSL_KEYTYPE_RSA,
        ]);
        openssl_pkey_export($other, $pem);

        $token = JWT::encode([
            'iss' => $this->clerkIssuer,
            'sub' => 'user_intruso',
            'azp' => $this->clerkAuthorizedParty,
            'iat' => time(),
            'exp' => time() + 300,
        ], $pem, 'RS256', 'outro-kid');

        $this->expectException(ClerkTokenException::class);

        $this->validator->validate($token);
    }

    public function test_rejects_a_token_with_an_unexpected_issuer(): void
    {
        $token = $this->clerkJwt(['iss' => 'https://outra-app.clerk.accounts.dev']);

        $this->expectException(ClerkTokenException::class);
        $this->expectExceptionMessage('issuer');

        $this->validator->validate($token);
    }

    public function test_rejects_a_token_issued_for_another_application(): void
    {
        // Sem checar `azp`, qualquer token válido da mesma conta Clerk entraria.
        $token = $this->clerkJwt(['azp' => 'https://outra-app.com']);

        $this->expectException(ClerkTokenException::class);
        $this->expectExceptionMessage('outra aplicação');

        $this->validator->validate($token);
    }

    public function test_rejects_an_expired_token(): void
    {
        $token = $this->clerkJwt(['iat' => time() - 3600, 'exp' => time() - 1800]);

        $this->expectException(ClerkTokenException::class);

        $this->validator->validate($token);
    }

    public function test_rejects_a_token_without_a_subject(): void
    {
        $token = $this->clerkJwt();
        $claims = json_decode(base64_decode(strtr(explode('.', $token)[1], '-_', '+/')), true);
        unset($claims['sub']);
        $token = $this->reissue($claims);

        $this->expectException(ClerkTokenException::class);
        $this->expectExceptionMessage('identificação');

        $this->validator->validate($token);
    }

    public function test_rejects_a_garbage_token(): void
    {
        $this->expectException(ClerkTokenException::class);

        $this->validator->validate('nao-e-um-jwt');
    }

    public function test_fails_cleanly_when_the_key_set_cannot_be_fetched(): void
    {
        $validator = new ClerkTokenValidator(function () {
            throw new ClerkTokenException('Não foi possível obter as chaves públicas do Clerk.');
        });

        $this->expectException(ClerkTokenException::class);

        $validator->validate($this->clerkJwt());
    }

    /**
     * Assina de novo com a chave de teste, sem o claim informado.
     */
    private function reissue(array $claims): string
    {
        return JWT::encode($claims, $this->clerkPrivateKeyPem, 'RS256', $this->clerkKid);
    }
}
