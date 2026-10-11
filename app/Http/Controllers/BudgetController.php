<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Services\AnalyticsService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BudgetController extends Controller
{
    public function index(AnalyticsService $analytics): Response
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        $status = $analytics->getBudgetStatus($user);

        // Categorias de despesa sem orçamento (para o select de "definir limite")
        $available = $user->categories()
            ->where('type', 'expense')
            ->whereNull('budget_amount')
            ->orderBy('name')
            ->get();

        return Inertia::render('Budgets/Index', [
            'budgets' => $status['budgets'],
            'totalLimit' => $status['totalLimit'],
            'totalSpent' => $status['totalSpent'],
            'totalPercentage' => $status['totalPercentage'],
            'available' => $available,
        ]);
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $this->authorize('update', $category);

        $this->normalizeDecimals($request, ['budget_amount']);

        $request->validate([
            'budget_amount' => 'required|numeric|min:0.01|max:99999999.99',
        ], [], [
            'budget_amount' => 'limite',
        ]);

        $category->update([
            'budget_amount' => $request->input('budget_amount'),
        ]);

        return redirect()->route('budgets.index')
            ->with('success', 'Limite de orçamento atualizado.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        $this->authorize('update', $category);

        $category->update(['budget_amount' => null]);

        return redirect()->route('budgets.index')
            ->with('success', 'Orçamento removido.');
    }
}
