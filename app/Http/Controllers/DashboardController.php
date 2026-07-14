<?php

namespace App\Http\Controllers;

use App\Services\AnalyticsService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(AnalyticsService $analytics): Response
    {
        $user = auth()->user();

        $totals = $analytics->getTotals($user);
        $comparison = $analytics->getMonthlyComparison($user);

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

        return Inertia::render('Dashboard', [
            'income' => $totals['income'],
            'expense' => $totals['expense'],
            'balance' => $totals['balance'],
            'recentTransactions' => $recentTransactions,
            'expensesByCategory' => $expensesByCategory,
            'incomeTrend' => $comparison['incomeTrend'],
            'expenseTrend' => $comparison['expenseTrend'],
        ]);
    }
}
