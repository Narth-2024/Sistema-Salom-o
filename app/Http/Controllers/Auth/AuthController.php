<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\PasswordResetLink;
use App\Models\RecoveryCode;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function __construct()
    {
        // showRecoveryCodes e regenerateRecoveryCodes exigem sessão iniciada.
        $this->middleware('guest')->except([
            'logout',
            'showRecoveryCodes',
            'regenerateRecoveryCodes',
        ]);
    }

    public function showLoginForm(): Response
    {
        return Inertia::render('Auth/Login', [
            'canEmailReset' => $this->canEmailReset(),
        ]);
    }

    /**
     * O fluxo por email só aparece na tela se houver SMTP configurado. Sem
     * isso o usuário cairia num formulário que nunca entrega o link.
     */
    private function canEmailReset(): bool
    {
        return filled(config('mail.mailers.smtp.host'))
            && filled(config('mail.mailers.smtp.username'));
    }

    public function showRegistrationForm(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        // Email é case-insensitive (RFC 5321). Resolve o email como está
        // armazenado antes do Auth::attempt, que compara de forma case-sensitive:
        // assim "User@X.com", "user@x.com" e a forma salva caem na mesma conta.
        $email = strtolower(trim($credentials['email']));
        $credentials['email'] = User::whereRaw('lower(email) = ?', [$email])->value('email') ?? $email;

        if (! Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => 'Email ou senha incorretos.',
            ]);
        }

        $request->session()->regenerate();

        return redirect()->intended('/dashboard');
    }

    public function register(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $email = strtolower(trim($data['email']));

        // unique case-insensitive: bloqueia "user@x.com" se "User@X.com" existe.
        if (User::whereRaw('lower(email) = ?', [$email])->exists()) {
            throw ValidationException::withMessages([
                'email' => 'Este email já está em uso.',
            ]);
        }

        $user = User::create([
            'name' => $data['name'],
            'email' => $email,
            'password' => Hash::make($data['password']),
        ]);

        // Os códigos são a única forma de o usuário se recuperar sem depender
        // de provedor de email, então são gerados já no cadastro e exibidos
        // uma única vez — no banco fica só o hash.
        $codes = RecoveryCode::generateFor($user);

        Auth::login($user);

        $request->session()->regenerate();

        return redirect()->route('recovery-codes.show')->with('recoveryCodes', $codes);
    }

    public function forgotPassword(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $email = strtolower(trim($request->email));

        $user = User::whereRaw('lower(email) = ?', [$email])->first();

        if ($user) {
            $token = Str::random(64);

            DB::table('password_reset_tokens')->updateOrInsert(
                ['email' => $user->email],
                ['token' => Hash::make($token), 'created_at' => now()]
            );

            $this->sendResetLink($user, $token);
        }

        // Resposta idêntica existindo ou não a conta: sem isso, qualquer pessoa
        // conseguiria descobrir quem tem cadastro no sistema.
        return back()->with(
            'success',
            'Se existir uma conta com esse email, enviaremos um link de redefinição. Confira sua caixa de entrada.'
        );
    }

    public function showResetForm(Request $request, string $token): Response
    {
        return Inertia::render('Auth/Login', [
            'resetToken' => $token,
            'resetEmail' => $request->query('email'),
        ]);
    }

    private function sendResetLink(User $user, string $token): void
    {
        $resetUrl = route('password.reset', [
            'token' => $token,
            'email' => $user->email,
        ]);

        try {
            Mail::to($user->email)->send(new PasswordResetLink($user, $resetUrl));
        } catch (\Throwable $e) {
            // Falha de SMTP não pode quebrar a recuperação nem revelar se a conta existe.
            Log::warning('Não foi possível enviar o email de redefinição de senha: ' . $e->getMessage());
        }
    }

    public function showRecoveryCodes(Request $request): Response
    {
        return Inertia::render('Auth/RecoveryCodes', [
            'codes' => $request->session()->get('recoveryCodes'),
        ]);
    }

    public function resetWithRecoveryCode(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'recovery_code' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $email = strtolower(trim($data['email']));

        $user = User::whereRaw('lower(email) = ?', [$email])->first();

        $code = $user
            ? RecoveryCode::query()
                ->where('user_id', $user->id)
                ->where('code_hash', RecoveryCode::hash($data['recovery_code']))
                ->whereNull('used_at')
                ->first()
            : null;

        if (! $user || ! $code) {
            throw ValidationException::withMessages([
                'recovery_code' => 'Email ou código de recuperação inválido.',
            ]);
        }

        $user->update(['password' => Hash::make($data['password'])]);

        // Código de uso único: uma vez consumido, não reabre a conta.
        $code->update(['used_at' => now()]);

        event(new PasswordReset($user));

        return redirect()->route('login')->with(
            'success',
            'Senha redefinida com sucesso. Faça login com a nova senha.'
        );
    }

    public function regenerateRecoveryCodes(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'string'],
        ]);

        if (! Hash::check($request->password, $request->user()->password)) {
            throw ValidationException::withMessages([
                'password' => 'A senha está incorreta.',
            ]);
        }

        // Regenerar invalida os antigos — por isso a confirmação de senha.
        $codes = RecoveryCode::generateFor($request->user());

        return redirect()->route('recovery-codes.show')->with('recoveryCodes', $codes);
    }

    public function resetPassword(Request $request): RedirectResponse
    {
        $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $email = strtolower(trim($request->email));

        $record = DB::table('password_reset_tokens')
            ->where('email', $email)
            ->first();

        if (! $record || ! Hash::check($request->token, $record->token)) {
            throw ValidationException::withMessages([
                'token' => 'Token inválido ou expirado. Solicite um novo.',
            ]);
        }

        if (now()->diffInMinutes($record->created_at) > 60) {
            DB::table('password_reset_tokens')->where('email', $email)->delete();
            throw ValidationException::withMessages([
                'token' => 'Token expirado. Solicite um novo.',
            ]);
        }

        $user = User::whereRaw('lower(email) = ?', [$email])->firstOrFail();
        $user->update(['password' => Hash::make($request->password)]);

        DB::table('password_reset_tokens')->where('email', $email)->delete();

        event(new PasswordReset($user));

        Auth::login($user);
        $request->session()->regenerate();

        return redirect('/dashboard');
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
