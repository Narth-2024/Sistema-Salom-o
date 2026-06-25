<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ClerkCallbackController extends Controller
{
    public function show()
    {
        return Inertia::render('Auth/ClerkCallback');
    }

    public function exchange(Request $request)
    {
        try {
            $data = $request->validate([
                'clerk_id' => ['required', 'string'],
                'email' => ['required', 'email'],
                'name' => ['required', 'string'],
            ]);

            $secretKey = config('services.clerk.secret_key');

            if (!$secretKey) {
                Log::error('Clerk exchange: CLERK_SECRET_KEY not configured');
                return response()->json(['error' => 'Erro de configuração do servidor.'], 500);
            }

            $response = Http::timeout(10)->withHeaders([
                'Authorization' => 'Bearer ' . $secretKey,
            ])->get("https://api.clerk.com/v1/users/{$data['clerk_id']}");

            if (!$response->successful()) {
                Log::warning('Clerk exchange: API error', [
                    'clerk_id' => $data['clerk_id'],
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                return response()->json(['error' => 'Erro ao verificar usuário no Clerk.'], 502);
            }

            $user = User::updateOrCreate(
                ['clerk_id' => $data['clerk_id']],
                [
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'password' => '',
                ]
            );

            Auth::login($user);
            $request->session()->regenerate();

            return response()->json(['redirect' => '/dashboard']);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Dados inválidos.'], 422);
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
