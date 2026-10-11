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

        $income = (float) ($totals['income'] ?? 0);
        $expense = (float) ($totals['expense'] ?? 0);

        return [
            'income' => $income,
            'expense' => $expense,
            'balance' => $income - $expense,
        ];
    }

    public function getExpensesByCategory(User $user, string $period = 'all', int $limit = 5): array
    {
        $categories = $user->transactions()
            ->selectRaw('categories.id, categories.name, categories.color, SUM(transactions.amount) as total')
            ->join('categories', 'categories.id', '=', 'transactions.category_id')
            ->where('transactions.type', 'expense')
            ->tap(function ($query) use ($period) {
                $this->applyPeriod($query, $period, 'transactions.transaction_date');
            })
            ->groupBy('categories.id', 'categories.name', 'categories.color')
            ->orderByDesc('total')
            ->get();

        $top = $categories->take($limit)->values();
        $others = (float) $categories->skip($limit)->sum('total');

        if ($others > 0) {
            $top->push((object) ['name' => 'Outros', 'color' => null, 'total' => $others]);
        }

        return $top->all();
    }

    public function getBudgetStatus(User $user, string $month = null): array
    {
        $month = $month ? Carbon::parse($month) : Carbon::now();
        $start = $month->copy()->startOfMonth();
        $end = $month->copy()->endOfMonth();

        // Gasto do mês por categoria de despesa (sem limite de top-N nem "Outros")
        $spentByCategory = $user->transactions()
            ->selectRaw('category_id, SUM(amount) as spent')
            ->where('type', 'expense')
            ->whereBetween('transaction_date', [$start, $end])
            ->groupBy('category_id')
            ->pluck('spent', 'category_id');

        // Categorias de despesa que possuem orçamento definido
        $budgets = $user->categories()
            ->where('type', 'expense')
            ->whereNotNull('budget_amount')
            ->get()
            ->map(function ($category) use ($spentByCategory) {
                $limit = (float) $category->budget_amount;
                $spent = (float) ($spentByCategory[$category->id] ?? 0);
                $percentage = $limit > 0 ? round(($spent / $limit) * 100, 1) : 0;
                $remaining = $limit - $spent;

                $status = 'ok';
                if ($percentage >= 100) {
                    $status = 'over';
                } elseif ($percentage >= 80) {
                    $status = 'warning';
                }

                return [
                    'category' => $category,
                    'limit' => $limit,
                    'spent' => $spent,
                    'percentage' => $percentage,
                    'remaining' => $remaining,
                    'status' => $status,
                ];
            })
            ->sortByDesc('percentage')
            ->values();

        $totalLimit = (float) $budgets->sum('limit');
        $totalSpent = (float) $budgets->sum('spent');

        return [
            'budgets' => $budgets,
            'totalLimit' => $totalLimit,
            'totalSpent' => $totalSpent,
            'totalPercentage' => $totalLimit > 0 ? round(($totalSpent / $totalLimit) * 100, 1) : 0,
        ];
    }

    public function countExpenses(User $user, string $period = 'all'): int
    {
        $query = $user->transactions()->where('type', 'expense');
        $this->applyPeriod($query, $period);

        return $query->count();
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

    public function applyPeriod($query, string $period, string $column = 'transaction_date'): void
    {
        switch ($period) {
            case 'month':
                $query->where($column, '>=', Carbon::now()->startOfMonth());
                break;
            case 'last_month':
                $query->where($column, '>=', Carbon::now()->subMonth()->startOfMonth())
                    ->where($column, '<', Carbon::now()->startOfMonth());
                break;
            case '3_months':
                $query->where($column, '>=', Carbon::now()->subMonths(3)->startOfMonth());
                break;
            case '6_months':
                $query->where($column, '>=', Carbon::now()->subMonths(6)->startOfMonth());
                break;
            case '12_months':
                $query->where($column, '>=', Carbon::now()->subMonths(12)->startOfMonth());
                break;
            case 'year':
                $query->where($column, '>=', Carbon::now()->startOfYear());
                break;
            case 'all':
            default:
                break;
        }
    }
}
