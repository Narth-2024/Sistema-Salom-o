<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $totals = $user->transactions()
            ->selectRaw('type, SUM(amount) as total')
            ->groupBy('type')
            ->pluck('total', 'type');

        $income  = $totals['income'] ?? 0;
        $expense = $totals['expense'] ?? 0;
        $balance = $income - $expense;

        $recentTransactions = $user->transactions()
            ->with('category')
            ->orderBy('transaction_date', 'desc')
            ->limit(8)
            ->get();

        $expensesByCategory = $user->transactions()
            ->selectRaw('categories.name, categories.id, categories.color, SUM(amount) as total')
            ->join('categories', 'categories.id', '=', 'transactions.category_id')
            ->where('transactions.type', 'expense')
            ->groupBy('categories.id', 'categories.name', 'categories.color')
            ->orderByDesc('total')
            ->limit(5)
            ->get();

        // Current vs previous month comparison for trends
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

        $incomeTrend = $previousIncome > 0
            ? round((($currentIncome - $previousIncome) / $previousIncome) * 100, 1)
            : ($currentIncome > 0 ? 100 : 0);

        $expenseTrend = $previousExpense > 0
            ? round((($currentExpense - $previousExpense) / $previousExpense) * 100, 1)
            : ($currentExpense > 0 ? 100 : 0);

        return Inertia::render('Dashboard', compact(
            'income',
            'expense',
            'balance',
            'recentTransactions',
            'expensesByCategory',
            'incomeTrend',
            'expenseTrend'
        ));
    }
}
