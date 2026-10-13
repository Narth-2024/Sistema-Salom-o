<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Str;

/**
 * Mantém a tabela `users` espelhando o que o Clerk diz.
 *
 * Usado pelo exchange (login) e pelo webhook, para que as duas entradas
 * tratem igual quem já existe localmente: em vez de criar duplicata ou
 * devolver conflito, elas **vinculam** o `clerk_id` à conta que já tem
 * aquele e-mail. É o que torna a migração dos usuários pré-existentes segura.
 */
class ClerkUserSync
{
    /**
     * @param  array<string, mixed>  $clerkUser  formato tanto da Backend API
     *                                           quanto do payload do webhook.
     */
    public function sync(array $clerkUser): User
    {
        $clerkId = (string) ($clerkUser['id'] ?? '');
        $email = $this->primaryEmail($clerkUser);
        $name = $this->name($clerkUser, $email);

        $user = $clerkId !== ''
            ? User::where('clerk_id', $clerkId)->first()
            : null;

        // Conta local ainda sem vínculo: associa em vez de duplicar.
        if (! $user && filled($email)) {
            $user = User::whereRaw('lower(email) = ?', [strtolower($email)])->first();
        }

        if ($user) {
            $user->update([
                'clerk_id' => filled($clerkId) ? $clerkId : $user->clerk_id,
                'name' => $name ?: $user->name,
                'email' => filled($email) ? $email : $user->email,
            ]);

            return $user->refresh();
        }

        return User::create([
            'clerk_id' => $clerkId,
            'name' => $name ?: Str::before((string) $email, '@'),
            'email' => $email,
            'password' => bcrypt(Str::random(40)),
        ]);
    }

    private function primaryEmail(array $clerkUser): ?string
    {
        $primaryId = $clerkUser['primary_email_address_id'] ?? null;

        foreach ($clerkUser['email_addresses'] ?? [] as $address) {
            if (($address['id'] ?? null) === $primaryId) {
                return strtolower(trim((string) $address['email_address']));
            }
        }

        $first = $clerkUser['email_addresses'][0]['email_address'] ?? null;

        return $first ? strtolower(trim((string) $first)) : null;
    }

    private function name(array $clerkUser, ?string $email): string
    {
        return trim(($clerkUser['first_name'] ?? '') . ' ' . ($clerkUser['last_name'] ?? ''))
            ?: (string) ($clerkUser['full_name'] ?? '')
            ?: Str::before((string) $email, '@');
    }
}
