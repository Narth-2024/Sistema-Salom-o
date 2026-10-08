<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Carbon;

class AnalyticsService
{
    public function getTotals(User $user, string $period = 'all'): array
    {
        $query = $user->transactions();

        $this->applyPeriod($query, $period);

        $totals = $query
            ->selectRaw('type, SUM(amount) as total')
            ->groupBy('type')
            ->pluck('total', 'type');

        $income = $totals['income'] ?? 0;
        $expense = $totals['expense'] ?? 0;

        return [
            'income' => $income,
            'expense' => $expense,
            'balance' => $income - $expense,
        ];
    }

    public function getMonthlyComparison(User $user, string $period = 'month'): array
    {
        $currentMonth = Carbon::now()->startOfMonth();
        $previousMonth = Carbon::now()->subMonth()->startOfMonth();

        $current = $user->transactions()
            ->selectRaw("SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income")
            ->selectRaw("SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense")
            ->where('transaction_date', '>=', $currentMonth)
            ->first();

        $previous = $user->transactions()
            ->selectRaw("SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income")
            ->selectRaw("SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense")
            ->where('transaction_date', '>=', $previousMonth)
            ->where('transaction_date', '<', $currentMonth)
            ->first();

        $currentIncome = (float) ($current->income ?? 0);
        $currentExpense = (float) ($current->expense ?? 0);
        $previousIncome = (float) ($previous->income ?? 0);
        $previousExpense = (float) ($previous->expense ?? 0);

        return [
            'current' => [
                'income' => $currentIncome,
                'expense' => $currentExpense,
                'balance' => $currentIncome - $currentExpense,
            ],
            'previous' => [
                'income' => $previousIncome,
                'expense' => $previousExpense,
                'balance' => $previousIncome - $previousExpense,
            ],
            'incomeTrend' => $previousIncome > 0
                ? round((($currentIncome - $previousIncome) / $previousIncome) * 100, 1)
                : ($currentIncome > 0 ? 100 : 0),
            'expenseTrend' => $previousExpense > 0
                ? round((($currentExpense - $previousExpense) / $previousExpense) * 100, 1)
                : ($currentExpense > 0 ? 100 : 0),
        ];
    }

    private function applyPeriod($query, string $period): void
    {
        switch ($period) {
            case 'month':
                $query->where('transaction_date', '>=', Carbon::now()->startOfMonth());
                break;
            case 'last_month':
                $query->where('transaction_date', '>=', Carbon::now()->subMonth()->startOfMonth())
                    ->where('transaction_date', '<', Carbon::now()->startOfMonth());
                break;
            case '3_months':
                $query->where('transaction_date', '>=', Carbon::now()->subMonths(3)->startOfMonth());
                break;
            case 'year':
                $query->where('transaction_date', '>=', Carbon::now()->startOfYear());
                break;
            case 'all':
            default:
                break;
        }
    }
}
