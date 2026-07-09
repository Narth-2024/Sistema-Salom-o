<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Monthly income and expense for bar chart (last 12 months)
        $months = collect(range(11, 0))->map(function ($i) {
            return now()->subMonths($i)->format('Y-m');
        });

        $monthlyData = $user->transactions()
            ->selectRaw("TO_CHAR(transaction_date, 'YYYY-MM') as month")
            ->selectRaw("SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income")
            ->selectRaw("SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense")
            ->where('transaction_date', '>=', now()->subMonths(12)->startOfMonth())
            ->groupBy(DB::raw("TO_CHAR(transaction_date, 'YYYY-MM')"))
            ->orderBy('month')
            ->get()
            ->keyBy('month');

        $barChart = $months->map(function ($month) use ($monthlyData) {
            $data = $monthlyData->get($month);
            return [
                'month' => $month,
                'label' => \Carbon\Carbon::createFromFormat('Y-m', $month)->translatedFormat('M'),
                'income' => (float) ($data->income ?? 0),
                'expense' => (float) ($data->expense ?? 0),
            ];
        });

        // Cumulative balance timeline (last 12 months)
        $runningBalance = 0;
        $timeline = $barChart->map(function ($item) use (&$runningBalance) {
            $runningBalance += $item['income'] - $item['expense'];
            return [
                'month' => $item['month'],
                'label' => $item['label'],
                'balance' => round($runningBalance, 2),
            ];
        });

        // Current vs previous month comparison
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

        $comparative = [
            'income' => [
                'current' => $currentIncome,
                'previous' => $previousIncome,
                'change' => $previousIncome > 0 ? round((($currentIncome - $previousIncome) / $previousIncome) * 100, 1) : 0,
            ],
            'expense' => [
                'current' => $currentExpense,
                'previous' => $previousExpense,
                'change' => $previousExpense > 0 ? round((($currentExpense - $previousExpense) / $previousExpense) * 100, 1) : 0,
            ],
            'balance' => [
                'current' => $currentIncome - $currentExpense,
                'previous' => $previousIncome - $previousExpense,
                'change' => ($previousIncome - $previousExpense) != 0
                    ? round((($currentIncome - $currentExpense) - ($previousIncome - $previousExpense)) / abs($previousIncome - $previousExpense) * 100, 1)
                    : 0,
            ],
        ];

        // Totals
        $totals = $user->transactions()
            ->selectRaw('type, SUM(amount) as total')
            ->groupBy('type')
            ->pluck('total', 'type');

        $incomeTotal = $totals['income'] ?? 0;
        $expenseTotal = $totals['expense'] ?? 0;
        $balanceTotal = $incomeTotal - $expenseTotal;

        return Inertia::render('Analytics', [
            'barChart' => $barChart,
            'timeline' => $timeline,
            'comparative' => $comparative,
            'incomeTotal' => $incomeTotal,
            'expenseTotal' => $expenseTotal,
            'balanceTotal' => $balanceTotal,
        ]);
    }
}
