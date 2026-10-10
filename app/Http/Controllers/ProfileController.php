<?php

namespace App\Http\Controllers;

use App\Services\SupabaseStorageService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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
                $path = $user->id.'_'.time().'.'.$file->extension();
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

    public function updatePassword(Request $request): RedirectResponse
    {
        $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = $request->user();

        if (! Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => 'A senha atual está incorreta.',
            ]);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return back()->with('success', 'Senha alterada com sucesso.');
    }

    private function extractPath(string $url): ?string
    {
        $baseUrl = rtrim(config('services.supabase.url'), '/').'/storage/v1/object/public/avatars/';
        if (str_starts_with($url, $baseUrl)) {
            return substr($url, strlen($baseUrl));
        }

        return null;
    }
}
