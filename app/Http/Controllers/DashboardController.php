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
            ->latest()
            ->limit(8)
            ->get();

        $expensesByCategory = $user->transactions()
            ->selectRaw('categories.name, categories.id, SUM(amount) as total')
            ->join('categories', 'categories.id', '=', 'transactions.category_id')
            ->where('transactions.type', 'expense')
            ->groupBy('categories.id', 'categories.name')
            ->orderByDesc('total')
            ->limit(5)
            ->get();

        return Inertia::render('Dashboard', compact(
            'income',
            'expense',
            'balance',
            'recentTransactions',
            'expensesByCategory'
        ));
    }
}
