<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class ResetUserPassword extends Command
{
    protected $signature = 'user:password {email : Email da conta} {password : Nova senha}';

    protected $description = 'Redefine a senha de um usuário (rede de segurança do administrador)';

    public function handle(): int
    {
        $email = strtolower(trim($this->argument('email')));
        $password = $this->argument('password');

        $user = User::whereRaw('lower(email) = ?', [$email])->first();

        if (! $user) {
            $this->error("Nenhum usuário encontrado com o email '{$email}'.");

            return self::FAILURE;
        }

        if (strlen($password) < 8) {
            $this->error('A senha precisa ter no mínimo 8 caracteres.');

            return self::FAILURE;
        }

        $user->update(['password' => Hash::make($password)]);

        $this->info("Senha de {$user->email} redefinida com sucesso.");

        return self::SUCCESS;
    }
}
