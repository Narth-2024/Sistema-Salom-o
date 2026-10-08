<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ClerkCallbackController extends Controller
{
    public function show(): Response
    {
        return Inertia::render('Auth/ClerkCallback');
    }

    public function exchange(Request $request): JsonResponse
    {
        try {
            $data = $request->validate([
                'clerk_id' => ['required', 'string'],
                'email' => ['nullable', 'email'],
                'name' => ['nullable', 'string'],
            ]);

            $secretKey = config('services.clerk.secret_key');

            if (! $secretKey) {
                Log::error('Clerk exchange: CLERK_SECRET_KEY not configured');

                return response()->json(['error' => 'Erro de configuração do servidor.'], 500);
            }

            $response = Http::timeout(10)->withHeaders([
                'Authorization' => 'Bearer '.$secretKey,
            ])->get("https://api.clerk.com/v1/users/{$data['clerk_id']}");

            if (! $response->successful()) {
                Log::warning('Clerk exchange: API error', [
                    'clerk_id' => $data['clerk_id'],
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return response()->json(['error' => 'Erro ao verificar usuário no Clerk.'], 502);
            }

            $clerkUser = $response->json();

            $primaryEmailId = $clerkUser['primary_email_address_id'] ?? null;
            $clerkEmail = collect($clerkUser['email_addresses'] ?? [])
                ->firstWhere('id', $primaryEmailId)['email_address']
                ?? ($clerkUser['email_addresses'][0]['email_address'] ?? null);

            $email = $clerkEmail ?: ($data['email'] ?? null);

            if (! $email) {
                return response()->json(['error' => 'Não foi possível identificar o e-mail da conta.'], 422);
            }

            $name = trim(($clerkUser['first_name'] ?? '').' '.($clerkUser['last_name'] ?? ''))
                ?: ($data['name'] ?? '')
                ?: Str::before($email, '@');

            $existingByEmail = User::where('email', $email)->where('clerk_id', '!=', $data['clerk_id'])->first();

            if ($existingByEmail) {
                Log::warning('Clerk exchange: email conflict', [
                    'clerk_id' => $data['clerk_id'],
                    'email' => $email,
                    'existing_user_id' => $existingByEmail->id,
                ]);

                return response()->json([
                    'error' => 'Já existe uma conta com este e-mail. Faça login ou use outro e-mail.',
                ], 409);
            }

            $user = User::updateOrCreate(
                ['clerk_id' => $data['clerk_id']],
                [
                    'name' => $name,
                    'email' => $email,
                    'password' => bcrypt(Str::random(40)),
                ]
            );

            Auth::login($user);
            $request->session()->regenerate();

            return response()->json(['redirect' => '/dashboard']);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Illuminate\Database\QueryException $e) {
            Log::error('Clerk exchange: database error', [
                'message' => $e->getMessage(),
                'code' => $e->getCode(),
            ]);

            if ($e->getCode() === '23505') {
                return response()->json([
                    'error' => 'Já existe uma conta com este e-mail. Faça login ou use outro e-mail.',
                ], 409);
            }

            return response()->json(['error' => 'Erro interno do servidor.'], 500);
        } catch (\Exception $e) {
            Log::error('Clerk exchange: unexpected error', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json(['error' => 'Erro interno do servidor.'], 500);
        }
    }
}
