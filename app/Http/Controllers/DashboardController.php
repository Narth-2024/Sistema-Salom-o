<?php

namespace App\Http\Controllers;

use App\Services\AnalyticsService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request, AnalyticsService $analytics): Response
    {
        $user = auth()->user();
        $period = $request->query('period', 'all');

        $totals = $analytics->getTotals($user, $period);
        $comparison = $analytics->getMonthlyComparison($user);

        $recentQuery = $user->transactions()->with('category');

        match ($period) {
            'month' => $recentQuery->where('transaction_date', '>=', now()->startOfMonth()),
            'last_month' => $recentQuery
                ->where('transaction_date', '>=', now()->subMonth()->startOfMonth())
                ->where('transaction_date', '<', now()->startOfMonth()),
            '3_months' => $recentQuery->where('transaction_date', '>=', now()->subMonths(3)->startOfMonth()),
            'year' => $recentQuery->where('transaction_date', '>=', now()->startOfYear()),
            default => null,
        };

        $recentTransactions = $recentQuery
            ->orderBy('transaction_date', 'desc')
            ->limit(8)
            ->get();

        $expensesQuery = $user->transactions()
            ->selectRaw('categories.name, categories.id, categories.color, SUM(amount) as total')
            ->join('categories', 'categories.id', '=', 'transactions.category_id')
            ->where('transactions.type', 'expense');

        match ($period) {
            'month' => $expensesQuery->where('transactions.transaction_date', '>=', now()->startOfMonth()),
            'last_month' => $expensesQuery
                ->where('transactions.transaction_date', '>=', now()->subMonth()->startOfMonth())
                ->where('transactions.transaction_date', '<', now()->startOfMonth()),
            '3_months' => $expensesQuery->where('transactions.transaction_date', '>=', now()->subMonths(3)->startOfMonth()),
            'year' => $expensesQuery->where('transactions.transaction_date', '>=', now()->startOfYear()),
            default => null,
        };

        $expensesByCategory = $expensesQuery
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
            'period' => $period,
        ]);
    }
}
