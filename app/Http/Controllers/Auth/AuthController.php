<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    public function showLoginForm(): Response
    {
        return Inertia::render('Auth/Login');
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

        // Email é case-insensitive (RFC 5321): normaliza a entrada para que
        // "User@X.com" e "user@x.com" caiam na mesma conta.
        $credentials['email'] = strtolower(trim($credentials['email']));

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

        Auth::login($user);

        $request->session()->regenerate();

        return redirect('/dashboard');
    }

    public function forgotPassword(Request $request): Response|RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $email = strtolower(trim($request->email));

        $user = User::whereRaw('lower(email) = ?', [$email])->first();

        if (! $user) {
            return back()->withErrors([
                'email' => 'Nenhuma conta encontrada com este email.',
            ]);
        }

        $token = Str::random(64);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            ['token' => Hash::make($token), 'created_at' => now()]
        );

        return Inertia::render('Auth/Login', [
            'resetToken' => $token,
            'resetEmail' => $user->email,
        ]);
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
