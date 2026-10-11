<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(Request $request): Response
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        $sort = in_array($request->query('sort'), ['name', 'type', 'transactions_count'], true)
            ? $request->query('sort')
            : 'name';
        $direction = $request->query('direction') === 'desc' ? 'desc' : 'asc';

        $categories = $user->categories()
            ->withCount('transactions')
            ->orderBy($sort, $direction)
            ->paginate(18)
            ->withQueryString();

        return Inertia::render('Categories/Index', [
            'categories' => $categories,
            'sort' => $sort,
            'direction' => $direction,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Categories/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:income,expense',
            'color' => 'nullable|string|max:7',
        ]);

        /** @var \App\Models\User $user */
        $user = auth()->user();

        $user->categories()->create($request->only('name', 'type', 'color'));

        return redirect()->route('categories.index')
            ->with('success', 'Categoria criada com sucesso.');
    }

    public function show(Category $category): Response
    {
        $this->authorize('view', $category);

        $transactions = $category->transactions()
            ->orderBy('transaction_date', 'desc')
            ->paginate(10);

        return Inertia::render('Categories/Show', [
            'category' => $category,
            'transactions' => $transactions,
        ]);
    }

    public function edit(Category $category): Response
    {
        $this->authorize('update', $category);

        return Inertia::render('Categories/Edit', [
            'category' => $category,
        ]);
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $this->authorize('update', $category);

        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:income,expense',
            'color' => 'nullable|string|max:7',
        ]);

        $category->update($request->only('name', 'type', 'color'));

        return redirect()->route('categories.index')
            ->with('success', 'Categoria atualizada com sucesso.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        $this->authorize('delete', $category);

        $category->delete();

        return redirect()->route('categories.index')
            ->with('success', 'Categoria excluída com sucesso.');
    }
}
