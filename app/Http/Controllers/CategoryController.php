<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        $categories = $user->categories()->paginate(18);

        return Inertia::render('Categories/Index', compact('categories'));
    }

    public function create()
    {
        return Inertia::render('Categories/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:income,expense',
            'color' => 'nullable|string|max:7',
        ]);

        /** @var \App\Models\User $user */
        $user = auth()->user();

        $user->categories()->create($request->only('name', 'type', 'color'));

        return redirect()->route('categories.index');
    }

    public function show(Category $category)
    {
        $this->authorize('view', $category);

        $transactions = $category->transactions()
            ->orderBy('transaction_date', 'desc')
            ->paginate(10);

        return Inertia::render('Categories/Show', compact('category', 'transactions'));
    }

    public function edit(Category $category)
    {
        $this->authorize('update', $category);

        return Inertia::render('Categories/Edit', compact('category'));
    }

    public function update(Request $request, Category $category)
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

    public function destroy(Category $category)
    {
        $this->authorize('delete', $category);

        $category->delete();

        return redirect()->route('categories.index')
            ->with('success', 'Categoria excluída com sucesso.');
    }
}
