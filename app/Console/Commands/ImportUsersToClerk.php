<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\ClerkUserSync;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

/**
 * Cria no Clerk as contas que só existem no banco local e grava o
 * `clerk_id` de volta na linha correspondente.
 *
 * A Backend API do Clerk marca o email como verificado por padrão nesse
 * endpoint, então a pessoa já pode usar "Esqueci a senha" logo em seguida
 * para definir a própria senha — não é preciso SMTP nosso.
 */
class ImportUsersToClerk extends Command
{
    protected $signature = 'clerk:import-users
                            {--dry-run : Mostra quem seria importado, sem chamar o Clerk}
                            {--force : Reimporta mesmo quem já tem clerk_id}';

    protected $description = 'Cria no Clerk os usuários locais ainda sem clerk_id e vincula as contas.';

    public function handle(ClerkUserSync $sync): int
    {
        $secretKey = config('services.clerk.secret_key');

        if (! $secretKey) {
            $this->error('CLERK_SECRET_KEY não configurado.');

            return self::FAILURE;
        }

        $query = User::query()->orderBy('id');

        if (! $this->option('force')) {
            $query->whereNull('clerk_id');
        }

        $users = $query->get();

        if ($users->isEmpty()) {
            $this->info('Nenhum usuário pendente.');

            return self::SUCCESS;
        }

        $dryRun = (bool) $this->option('dry-run');
        $ok = 0;
        $failed = 0;

        $this->table(
            ['ID', 'Email', 'Nome', 'Situação'],
            $users->map(fn (User $user) => [
                $user->id,
                $user->email,
                $user->name,
                $dryRun ? 'seria criado' : 'criando…',
            ])->all()
        );

        foreach ($users as $user) {
            if ($dryRun) {
                continue;
            }

            $response = Http::timeout(20)
                ->withToken($secretKey)
                ->post('https://api.clerk.com/v1/users', [
                    'email_address' => [$user->email],
                    'first_name' => Str::before($user->name, ' ') ?: $user->name,
                    'last_name' => Str::after($user->name, ' ') ?: null,
                ]);

            if ($response->failed()) {
                $failed++;
                $this->warn("{$user->email}: Clerk recusou ({$response->status()}) — {$response->body()}");

                continue;
            }

            // Vincula à conta local já existente em vez de criar outra linha.
            $sync->sync($response->json());
            $ok++;
            $this->info("{$user->email}: criado e vinculado.");
        }

        if ($dryRun) {
            $this->info("Dry run: {$users->count()} usuário(s) seriam importados. Rode sem --dry-run para aplicar.");

            return self::SUCCESS;
        }

        $this->info("Importados: {$ok}. Falhas: {$failed}.");

        return $failed === 0 ? self::SUCCESS : self::FAILURE;
    }
}
