<?php

namespace App\Http\Controllers;

use App\Services\AnalyticsService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function index(Request $request, AnalyticsService $analytics): Response
    {
        $user = auth()->user();

        if (! $user->viewed_analytics_at) {
            $user->forceFill(['viewed_analytics_at' => now()])->save();
        }

        $allowedPeriods = ['3_months', '6_months', '12_months', 'all'];
        $period = in_array($request->query('period'), $allowedPeriods, true)
            ? $request->query('period')
            : '12_months';

        $startDate = match ($period) {
            '3_months' => now()->subMonths(3)->startOfMonth(),
            '6_months' => now()->subMonths(6)->startOfMonth(),
            '12_months' => now()->subMonths(12)->startOfMonth(),
            default => null,
        };

        if (! $startDate) {
            $firstDate = $user->transactions()->min('transaction_date');
            $firstMonth = $firstDate
                ? Carbon::parse($firstDate)->startOfMonth()
                : now()->startOfMonth();
            $floor = now()->copy()->subMonths(35)->startOfMonth();
            $startDate = $firstMonth->lt($floor) ? $floor : $firstMonth;
        }

        $months = collect(range(0, (int) $startDate->diffInMonths(now())))
            ->map(fn ($i) => $startDate->copy()->addMonths($i)->format('Y-m'));

        $monthlyData = $user->transactions()
            ->selectRaw("TO_CHAR(transaction_date, 'YYYY-MM') as month")
            ->selectRaw("SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income")
            ->selectRaw("SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense")
            ->where('transaction_date', '>=', Carbon::createFromFormat('Y-m', $months->first())->startOfMonth())
            ->groupBy(DB::raw("TO_CHAR(transaction_date, 'YYYY-MM')"))
            ->orderBy('month')
            ->get()
            ->keyBy('month');

        $barChart = $months->map(function ($month) use ($monthlyData) {
            $data = $monthlyData->get($month);

            return [
                'month' => $month,
                'label' => Carbon::createFromFormat('Y-m', $month)->locale('pt_BR')->translatedFormat('M'),
                'income' => (float) ($data->income ?? 0),
                'expense' => (float) ($data->expense ?? 0),
            ];
        })->values();

        $hasData = $barChart->contains(fn ($d) => $d['income'] > 0 || $d['expense'] > 0);

        $timeline = collect();

        if ($hasData) {
            $firstActive = (int) $barChart->search(fn ($d) => $d['income'] > 0 || $d['expense'] > 0);
            $runningBalance = 0;

            $timeline = $barChart
                ->slice($firstActive)
                ->values()
                ->map(function ($item) use (&$runningBalance) {
                    $runningBalance += $item['income'] - $item['expense'];

                    return [
                        'month' => $item['month'],
                        'label' => $item['label'],
                        'balance' => round($runningBalance, 2),
                    ];
                });
        }

        $comparison = $analytics->getMonthlyComparison($user);
        $totals = $analytics->getTotals($user, $period);
        $categoryChart = $analytics->getExpensesByCategory($user, $period);
        $expenseCount = $analytics->countExpenses($user, $period);

        $ticketMedio = $expenseCount > 0
            ? round($totals['expense'] / $expenseCount, 2)
            : 0.0;

        $economyRate = $totals['income'] > 0
            ? round(($totals['balance'] / $totals['income']) * 100, 1)
            : null;

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
            'categoryChart' => $categoryChart,
            'economyRate' => $economyRate,
            'ticketMedio' => $ticketMedio,
            'hasData' => $hasData,
            'period' => $period,
        ]);
    }
}
