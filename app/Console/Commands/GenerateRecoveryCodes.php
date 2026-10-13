<?php

namespace App\Console\Commands;

use App\Models\RecoveryCode;
use App\Models\User;
use Illuminate\Console\Command;

class GenerateRecoveryCodes extends Command
{
    protected $signature = 'recovery-codes:generate
                            {email? : Gera códigos apenas para este usuário}
                            {--all : Gera códigos para todo usuário que ainda não tem}';

    protected $description = 'Gera (ou regenera) os códigos de recuperação de senha de usuários';

    public function handle(): int
    {
        $email = $this->argument('email');

        if ($email && ! $this->option('all')) {
            $user = User::whereRaw('lower(email) = ?', [strtolower($email)])->first();

            if (! $user) {
                $this->error("Nenhum usuário encontrado com o email '{$email}'.");

                return self::FAILURE;
            }

            $this->printCodes($user, RecoveryCode::generateFor($user));

            return self::SUCCESS;
        }

        if (! $this->option('all') && ! $email) {
            $this->error('Informe um email ou use --all.');

            return self::FAILURE;
        }

        $users = User::whereDoesntHave('recoveryCodes')->get();

        if ($users->isEmpty()) {
            $this->info('Todos os usuários já possuem códigos de recuperação.');

            return self::SUCCESS;
        }

        foreach ($users as $user) {
            $this->printCodes($user, RecoveryCode::generateFor($user));
        }

        $this->info("Códigos gerados para {$users->count()} usuário(s).");

        return self::SUCCESS;
    }

    /**
     * @param  array<int, string>  $codes
     */
    private function printCodes(User $user, array $codes): void
    {
        $this->newLine();
        $this->line("<comment>{$user->email}</comment> ({$user->name})");

        foreach ($codes as $code) {
            $this->line("  <info>{$code}</info>");
        }
    }
}
