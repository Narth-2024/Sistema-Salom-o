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
        $data = $request->validate([
            'clerk_id' => ['required', 'string'],
            'email' => ['required', 'email'],
            'name' => ['required', 'string'],
        ]);

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . config('services.clerk.secret_key'),
        ])->get("https://api.clerk.com/v1/users/{$data['clerk_id']}");

        if (!$response->successful()) {
            Log::warning('Clerk exchange: user not found', [
                'clerk_id' => $data['clerk_id'],
                'status' => $response->status(),
            ]);
            return response()->json(['error' => 'Usuário não encontrado no Clerk.'], 404);
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
    }
}
