<?php

namespace App\Console\Commands;

use App\Models\Transaction;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class SpawnRecurringTransactions extends Command
{
    protected $signature = 'transactions:spawn-recurring';

    protected $description = 'Cria as instâncias do mês atual para transações recorrentes';

    public function handle(): int
    {
        $now = Carbon::now();
        $monthStart = $now->copy()->startOfMonth();
        $monthEnd = $now->copy()->endOfMonth();

        $recurring = Transaction::where('is_recurring', true)
            ->where('transaction_date', '<=', $monthEnd)
            ->get()
            ->unique(fn ($t) => $t->user_id.'|'.$t->category_id.'|'.$t->type.'|'.$t->amount.'|'.$t->description);

        $created = 0;

        foreach ($recurring as $template) {
            $exists = Transaction::where('user_id', $template->user_id)
                ->where('category_id', $template->category_id)
                ->where('type', $template->type)
                ->where('amount', $template->amount)
                ->where('is_recurring', true)
                ->whereBetween('transaction_date', [$monthStart, $monthEnd])
                ->exists();

            if ($exists) {
                continue;
            }

            $day = min((int) $template->transaction_date->day, $monthEnd->day);

            Transaction::create([
                'user_id' => $template->user_id,
                'category_id' => $template->category_id,
                'type' => $template->type,
                'amount' => $template->amount,
                'description' => $template->description,
                'transaction_date' => $monthStart->copy()->addDays($day - 1)->toDateString(),
                'is_recurring' => true,
            ]);

            $created++;
        }

        $this->info("Transações recorrentes criadas: {$created}");

        return self::SUCCESS;
    }
}
