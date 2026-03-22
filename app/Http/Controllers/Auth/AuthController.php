<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;



class AuthController extends Controller
{
    public function show()
    {
        return view('auth');
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ], [
            'email.required' => 'Email obrigatório.',
            'email.email' => 'Email inválido.',
            'password.required' => 'Senha obrigatória.',
        ]);

        if (!Auth::attempt($validated)) {
            return back()->withErrors([
                'email' => 'Credenciais inválidas.'
            ])->withInput();
        }

        return redirect('/its-working');
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required','string','max:255'],
            'cpf' => ['required','string','max:14','unique:users,cpf'],
            'email' => ['required','email','unique:users,email'],
            'password' => ['required','min:6']
        ],[
            'name.required' => 'Nome obrigatório.',
            'cpf.required' => 'CPF obrigatório.',
            'cpf.unique' => 'CPF já cadastrado.',
            'email.required' => 'Email obrigatório.',
            'email.email' => 'Email inválido.',
            'email.unique' => 'Email já cadastrado.',
            'password.required' => 'Senha obrigatória.'
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'cpf' => $validated['cpf'],
            'email' => $validated['email'],
            'password' => $validated['password']
        ]);

        Auth::login($user);

        return redirect('/its-working');
    }

    public function showLogin()
    {
        return view('auth');
    }
}
