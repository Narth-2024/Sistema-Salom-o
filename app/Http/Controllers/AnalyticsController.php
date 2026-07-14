<?php

namespace App\Http\Controllers;

use App\Services\AnalyticsService;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function index(AnalyticsService $analytics): Response
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
                'label' => Carbon::createFromFormat('Y-m', $month)->translatedFormat('M'),
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

        // Comparison and totals via shared service
        $comparison = $analytics->getMonthlyComparison($user);
        $totals = $analytics->getTotals($user);

        $comparative = [
            'income' => [
                'current' => $comparison['current']['income'],
                'previous' => $comparison['previous']['income'],
                'change' => $comparison['incomeTrend'],
            ],
            'expense' => [
                'current' => $comparison['current']['expense'],
                'previous' => $comparison['previous']['expense'],
                'change' => $comparison['expenseTrend'],
            ],
            'balance' => [
                'current' => $comparison['current']['balance'],
                'previous' => $comparison['previous']['balance'],
                'change' => $comparison['previous']['balance'] != 0
                    ? round((($comparison['current']['balance'] - $comparison['previous']['balance']) / abs($comparison['previous']['balance'])) * 100, 1)
                    : 0,
            ],
        ];

        return Inertia::render('Analytics', [
            'barChart' => $barChart,
            'timeline' => $timeline,
            'comparative' => $comparative,
            'incomeTotal' => $totals['income'],
            'expenseTotal' => $totals['expense'],
            'balanceTotal' => $totals['balance'],
        ]);
    }
}
