<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\ClerkTokenException;
use App\Services\ClerkTokenValidator;
use App\Services\ClerkUserSync;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Ponte entre a sessão do Clerk (frontend) e a sessão do Laravel (backend).
 *
 * O frontend autentica no Clerk e traz o session token daqui. A identidade é
 * lida do claim `sub` de um JWT cuja assinatura foi conferida — nunca de um
 * campo enviado no corpo da requisição.
 */
class ClerkCallbackController extends Controller
{
    public function __construct()
    {
        $this->middleware('guest')->except('show');
    }

    /**
     * Página que completa o handoff: pega o token da sessão Clerk e troca
     * por uma sessão Laravel.
     */
    public function show(): Response
    {
        return Inertia::render('Auth/ClerkCallback');
    }

    public function exchange(Request $request, ClerkTokenValidator $validator, ClerkUserSync $sync): JsonResponse
    {
        $token = $this->bearerToken($request);

        if (! $token) {
            return response()->json(['error' => 'Sessão do Clerk ausente.'], 401);
        }

        try {
            $claims = $validator->validate($token);
        } catch (ClerkTokenException $e) {
            Log::warning('Clerk exchange: token rejeitado', ['reason' => $e->getMessage()]);

            return response()->json(['error' => 'Sessão inválida ou expirada. Entre novamente.'], 401);
        }

        $clerkUser = $this->fetchClerkUser((string) $claims->sub);

        if ($clerkUser === null) {
            return response()->json(['error' => 'Não foi possível identificar a conta.'], 502);
        }

        // Claims do token já trazem e-mail e nome na maioria dos casos; a
        // chamada à Backend API existe como fallback (ex.: token com template
        // enxuto) e para garantir o e-mail canônico verificado pelo Clerk.
        $clerkUser = array_merge($clerkUser, $this->claimsAsUser($claims, $clerkUser));

        try {
            $user = $sync->sync($clerkUser);
        } catch (\Illuminate\Database\QueryException $e) {
            Log::error('Clerk exchange: erro de banco', ['message' => $e->getMessage()]);

            return response()->json(['error' => 'Erro interno do servidor.'], 500);
        }

        Auth::login($user);
        $request->session()->regenerate();

        return response()->json(['redirect' => '/dashboard']);
    }

    private function bearerToken(Request $request): ?string
    {
        $header = (string) $request->header('Authorization');

        if (str_starts_with($header, 'Bearer ')) {
            return trim(substr($header, 7));
        }

        return null;
    }

    /**
     * @return array<string, mixed>|null
     */
    private function claimsAsUser(object $claims, array $fallback): ?array
    {
        $email = $claims->email ?? null;

        if (! is_string($email) || $email === '') {
            return null;
        }

        return [
            'id' => (string) $claims->sub,
            'first_name' => (string) ($claims->first_name ?? ''),
            'last_name' => (string) ($claims->last_name ?? ''),
            'primary_email_address_id' => $fallback['primary_email_address_id'] ?? null,
            'email_addresses' => $fallback['email_addresses']
                ?? [['email_address' => $email]],
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    private function fetchClerkUser(string $clerkId): ?array
    {
        $secretKey = config('services.clerk.secret_key');

        if (! $secretKey) {
            Log::error('Clerk exchange: CLERK_SECRET_KEY não configurado');

            return null;
        }

        $response = Http::timeout(10)
            ->withToken($secretKey)
            ->get('https://api.clerk.com/v1/users/' . urlencode($clerkId));

        if (! $response->successful()) {
            Log::warning('Clerk exchange: API do Clerk recusou', [
                'clerk_id' => $clerkId,
                'status' => $response->status(),
            ]);

            return null;
        }

        return $response->json();
    }
}
