<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ClerkAuthMiddleware
{
    /**
     * Handle incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $sessionCookie = $request->cookie('__session');
        $clerkToken = $request->cookie('__client_uat') ? $request->bearerToken() : null;

        // Try to resolve session from Clerk API
        $session = $this->resolveSession($request);

        if ($session) {
            $user = $this->syncUser($session);

            if ($user) {
                Auth::login($user);
                return $next($request);
            }
        }

        // Check if Laravel session still valid
        if (Auth::check()) {
            return $next($request);
        }

        return redirect()->route('auth.show');
    }

    /**
     * Resolve Clerk session from request
     */
    protected function resolveSession(Request $request): ?array
    {
        $sessionToken = $request->cookie('__session');

        if (!$sessionToken) {
            return null;
        }

        $response = Http::withToken(config('services.clerk.secret_key'))
            ->get(config('services.clerk.frontend_api_url') . '/v1/me', [
                '_clerk_session_id' => $sessionToken,
            ]);

        if ($response->successful() && $response->json('id')) {
            return $response->json();
        }

        return null;
    }

    /**
     * Sync or create local user from Clerk data
     */
    protected function syncUser(array $clerkData): ?User
    {
        $email = $clerkData['email_addresses'][0]['email_address'] ?? null;

        if (!$email) {
            return null;
        }

        $user = User::firstOrCreate(
            ['email' => $email],
            [
                'name' => $clerkData['first_name'] . ' ' . $clerkData['last_name'],
                'cpf' => $clerkData['public_metadata']['cpf'] ?? null,
                'password' => bcrypt(str()->random(32)),
            ]
        );

        return $user;
    }
}
