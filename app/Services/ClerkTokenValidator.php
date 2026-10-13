<?php

namespace App\Services;

use Closure;
use Firebase\JWT\JWK;
use Firebase\JWT\JWT;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Throwable;

/**
 * Valida o session token emitido pelo Clerk.
 *
 * O token é um JWT RS256 assinado pelo Clerk. A assinatura é conferida contra o
 * JWKS público da instância; `iss` e `azp` são conferidos manualmente porque é
 * aí que mora o risco real: sem checar `azp`, um token emitido para outra
 * aplicação da mesma conta Clerk passaria.
 *
 * Optamos por firebase/php-jwt (já presente no projeto, e que o SDK oficial do
 * Clerk usa por baixo) em vez de clerkinc/backend-php, que exige PHP >= 8.2.
 */
class ClerkTokenValidator
{
    /**
     * @var (callable(): array)|null
     */
    private $jwksResolver;

    private string $issuer;

    /**
     * @param  (callable(): array)|null  $jwksResolver  Sobrescrita usada em teste, sem rede.
     */
    public function __construct(?Closure $jwksResolver = null)
    {
        $this->issuer = rtrim((string) config('services.clerk.frontend_api_url'), '/');
        $this->jwksResolver = $jwksResolver;
    }

    /**
     * @return object payload do JWT, com `sub` = clerk_id
     *
     * @throws ClerkTokenException
     */
    public function validate(string $token): object
    {
        if ($this->issuer === '') {
            throw new ClerkTokenException('CLERK_FRONTEND_API_URL não configurado.');
        }

        try {
            $payload = JWT::decode($token, JWK::parseKeySet($this->jwks(), 'RS256'));
        } catch (ClerkTokenException $e) {
            throw $e;
        } catch (Throwable $e) {
            // Assinatura, expiração, formato ou chave desconhecida: mesma mensagem
            // para o cliente, para não virar oráculo de qual parte falhou.
            throw new ClerkTokenException('Token do Clerk inválido ou expirado.', 0, $e);
        }

        if (($payload->iss ?? null) !== $this->issuer) {
            throw new ClerkTokenException('Token do Clerk com issuer inesperado.');
        }

        $authorizedParties = config('services.clerk.authorized_parties', []);

        if (isset($payload->azp) && ! in_array($payload->azp, $authorizedParties, true)) {
            throw new ClerkTokenException('Token do Clerk emitido para outra aplicação.');
        }

        if (empty($payload->sub)) {
            throw new ClerkTokenException('Token do Clerk sem identificação de usuário.');
        }

        return $payload;
    }

    /**
     * @return array<string, mixed>
     */
    private function jwks(): array
    {
        if ($this->jwksResolver !== null) {
            return ($this->jwksResolver)();
        }

        // 10 minutos: o Clerk rotaciona as chaves com folga e publica várias
        // chaves ativas no mesmo set justamente para permitir cache agressivo.
        return Cache::remember('clerk.jwks', now()->addMinutes(10), function () {
            $response = Http::timeout(5)->get($this->issuer . '/.well-known/jwks.json');

            if ($response->failed()) {
                throw new ClerkTokenException('Não foi possível obter as chaves públicas do Clerk.');
            }

            return $response->json();
        });
    }
}
