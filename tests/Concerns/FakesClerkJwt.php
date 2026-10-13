<?php

namespace Tests\Concerns;

use App\Services\ClerkTokenValidator;
use Firebase\JWT\JWT;

/**
 * Gera um par de chaves RS256 em memória e emite JWTs assinados por ele,
 * no mesmo formato do session token do Clerk. Assim os testes validam a
 * assinatura de verdade, sem rede e sem depender de credenciais reais.
 */
trait FakesClerkJwt
{
    /**
     * `const` em trait exige PHP 8.2; o projeto roda em 8.1, então viram propriedades.
     */
    private string $clerkIssuer = 'https://test.clerk.accounts.dev';

    private string $clerkAuthorizedParty = 'http://localhost:8000';

    private string $clerkPrivateKeyPem = '';

    private string $clerkKid = 'test-key';

    private array $clerkJwks = [];

    protected function setUpClerkJwt(): void
    {
        $resource = openssl_pkey_new([
            'private_key_bits' => 2048,
            'private_key_type' => OPENSSL_KEYTYPE_RSA,
        ]);

        $details = openssl_pkey_get_details($resource);

        // Atenção: $details['key'] é a chave PÚBLICA em PEM. A privada precisa
        // ser exportada à parte, senão o JWT sai assinado com a chave errada.
        openssl_pkey_export($resource, $this->clerkPrivateKeyPem);

        $this->clerkJwks = [
            'keys' => [[
                'kty' => 'RSA',
                'use' => 'sig',
                'alg' => 'RS256',
                'kid' => $this->clerkKid,
                'n' => $this->base64Url($details['rsa']['n']),
                'e' => $this->base64Url($details['rsa']['e']),
            ]],
        ];
    }

    protected function configureClerk(): void
    {
        config([
            'services.clerk.frontend_api_url' => $this->clerkIssuer,
            'services.clerk.secret_key' => 'sk_test_secret',
            'services.clerk.webhook_secret' => 'whsec_' . base64_encode('segredo-do-webhook'),
            'services.clerk.authorized_parties' => [$this->clerkAuthorizedParty],
        ]);
    }

    protected function clerkValidator(): ClerkTokenValidator
    {
        return new ClerkTokenValidator(fn () => $this->clerkJwks);
    }

    protected function clerkJwt(array $overrides = []): string
    {
        return JWT::encode(array_merge([
            'iss' => $this->clerkIssuer,
            'sub' => 'user_test123',
            'azp' => $this->clerkAuthorizedParty,
            'email' => 'nathanbdsilvars@gmail.com',
            'first_name' => 'Nathan',
            'last_name' => 'Silva',
            'iat' => time(),
            'exp' => time() + 300,
        ], $overrides), $this->clerkPrivateKeyPem, 'RS256', $this->clerkKid);
    }

    /**
     * Session token enxuto, no formato do template padrão do Clerk: só `sub`,
     * `sid` e `sts`, sem `email`/`first_name`. É exatamente o que a produção
     * emite — o exchange tem de sobreviver a ele.
     */
    protected function clerkCompactJwt(array $overrides = []): string
    {
        return JWT::encode(array_merge([
            'azp' => $this->clerkAuthorizedParty,
            'iat' => time(),
            'nbf' => time() - 10,
            'exp' => time() + 60,
            'iss' => $this->clerkIssuer,
            'sid' => 'sess_test123',
            'sts' => 'active',
            'sub' => 'user_test123',
            'v' => 2,
        ], $overrides), $this->clerkPrivateKeyPem, 'RS256', $this->clerkKid);
    }

    private function base64Url(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
}
