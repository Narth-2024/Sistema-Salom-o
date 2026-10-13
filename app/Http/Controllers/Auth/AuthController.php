<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Login e cadastro são feitos pelo Clerk (widgets <SignIn/> e <SignUp/>).
 * Só restam aqui a renderização das telas e o encerramento da sessão do
 * Laravel — o Clerk não derruba a sessão de backend sozinho.
 */
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

    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
