<?php

namespace App\Services;

use App\Models\User;

class AnalyticsService
{
    public function getTotals(User $user): array
    {
        $totals = $user->transactions()
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

    public function getMonthlyComparison(User $user): array
    {
        $currentMonth = now()->startOfMonth();
        $previousMonth = now()->subMonth()->startOfMonth();

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
}
