<?php

namespace App\Http\Controllers;

use App\Services\SupabaseStorageService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class ProfileController extends Controller
{
    public function update(Request $request, SupabaseStorageService $storage): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $data = ['name' => $validated['name']];

        try {
            if ($request->hasFile('avatar')) {
                if ($user->avatar_url) {
                    $oldPath = $this->extractPath($user->avatar_url);
                    if ($oldPath) {
                        $storage->delete($oldPath);
                    }
                }

                $file = $request->file('avatar');
                $path = $user->id . '_' . time() . '.' . $file->extension();
                $data['avatar_url'] = $storage->upload($file, $path);
            }
        } catch (\Throwable $e) {
            Log::error('Profile avatar upload failed', [
                'user_id' => $user->id,
                'message' => $e->getMessage(),
            ]);

            return back()->with('error', 'Não foi possível enviar a imagem. Tente novamente.');
        }

        $user->update($data);

        return back()->with('success', 'Perfil atualizado com sucesso.');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'confirmation' => ['required', 'string'],
        ], [
            'confirmation.required' => 'Digite seu e-mail para confirmar.',
        ]);

        $user = $request->user();

        // A confirmação é o próprio e-mail da conta. Não usamos a senha porque o
        // login é do Clerk: o campo `password` do banco recebe um valor aleatório
        // gerado no ClerkUserSync e que ninguém conhece — a checagem nunca passaria.
        if (! hash_equals((string) $user->email, (string) $request->input('confirmation'))) {
            throw ValidationException::withMessages([
                'confirmation' => 'O e-mail digitado não corresponde ao da sua conta.',
            ]);
        }

        // Remove avatar do Storage (best-effort)
        if ($user->avatar_url) {
            try {
                $path = $this->extractPath($user->avatar_url);
                if ($path) {
                    app(SupabaseStorageService::class)->delete($path);
                }
            } catch (\Throwable) {
                // ignora falha ao deletar avatar
            }
        }

        // Encerra a sessão ANTES de excluir. O Auth::logout() gira o remember token
        // do usuário (cycleRememberToken → $user->save()); se a linha já tivesse
        // sido apagada, esse save faria um INSERT e ressuscitaria a conta.
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Remove dados vinculados (hard delete de tudo, incluindo lixeira)
        $transactionIds = $user->transactions()->withTrashed()->pluck('id');
        if ($transactionIds->isNotEmpty()) {
            DB::table('transaction_tag')->whereIn('transaction_id', $transactionIds)->delete();
        }
        $user->transactions()->withTrashed()->forceDelete();
        $user->categories()->withTrashed()->forceDelete();
        $user->tags()->withTrashed()->forceDelete();
        $user->investmentSimulations()->forceDelete();
        $user->delete();

        return redirect()->route('home')
            ->with('success', 'Sua conta e todos os dados foram excluídos definitivamente.');
    }

    private function extractPath(string $url): ?string
    {
        $baseUrl = rtrim(config('services.supabase.url'), '/') . '/storage/v1/object/public/avatars/';
        if (str_starts_with($url, $baseUrl)) {
            return substr($url, strlen($baseUrl));
        }

        return null;
    }
}
