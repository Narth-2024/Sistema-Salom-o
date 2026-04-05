<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\CpfService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class AuthController extends Controller
{
    public function show()
    {
        return view('auth');
    }

    public function showLogin()
    {
        return view('auth');
    }

    /**
     * Recebe session_id do Clerk, valida e cria sessão local.
     * Após sucesso, redireciona para /work.
     */
    public function verifySession(Request $request, CpfService $cpfService)
    {
        $request->validate([
            'session_id' => 'required|string',
            'cpf' => 'nullable|string',
        ]);

        $clerkSecret = config('services.clerk.secret_key');
        $frontendApiUrl = config('services.clerk.frontend_api_url');

        $response = Http::withToken($clerkSecret)
            ->get("{$frontendApiUrl}/v1/me", [
                '_clerk_session_id' => $request->session_id,
            ]);

        if (!$response->successful() || !$response->json('id')) {
            return response()->json(['success' => false, 'message' => 'Sessão inválida.'], 401);
        }

        $clerkUser = $response->json();
        $email = $clerkUser['email_addresses'][0]['email_address'] ?? null;

        if (!$email) {
            return response()->json(['success' => false, 'message' => 'Email não encontrado.'], 401);
        }

        $cpf = $request->cpf
            ?: ($clerkUser['public_metadata']['cpf'] ?? null);

        $existingUser = User::where('email', $email)->first();

        if ($cpf) {
            $this->consultarECriarUser($cpfService, $cpf, $clerkUser);
        }

        $user = User::firstOrCreate(
            ['email' => $email],
            [
                'name' => ($clerkUser['first_name'] ?: '') . ' ' . ($clerkUser['last_name'] ?: ''),
                'cpf' => $cpf,
                'password' => bcrypt(str()->random(32)),
            ]
        );

        Auth::login($user);

        return response()->json([
            'success' => true,
            'redirect' => route('work'),
        ]);
    }

    /**
     * Consulta CPF na API gov.br e cria/atualiza dados do usuário.
     */
    protected function consultarECriarUser(CpfService $cpfService, string $cpf, array $clerkUser): void
    {
        $dados = $cpfService->consultar($cpf);

        if (!$dados) {
            return;
        }

        // O nome retornado pela API gov.br é priorizado
        $nome = $dados['nome'] 
            ?? $dados['nome_completo'] 
            ?? ($clerkUser['first_name'] . ' ' . $clerkUser['last_name']);

        User::where('cpf', $cpf)->update([
            'name' => trim($nome),
        ]);
    }

    /**
     * Logout.
     */
    public function logout(Request $request)
    {
        Auth::logout();
        session()->invalidate();
        session()->regenerateToken();

        return redirect()->route('home');
    }
}
