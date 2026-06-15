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

        $categories = $user->categories()->get();

        return Inertia::render('Categories/Index', compact('categories'));
    }

    public function create()
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        $categories = $user->categories()->get();

        return Inertia::render('Categories/Create', compact('categories'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:income,expense'
        ]);

        /** @var \App\Models\User $user */
        $user = auth()->user();

        $user->categories()->create($request->only('name', 'type'));

        return redirect()->route('categories.index');
    }

    public function show(Category $category)
    {
        if ($category->user_id !== auth()->id()) {
            abort(403, 'Não autorizado');
        }

        $transactions = $category->transactions()
            ->orderBy('transaction_date', 'desc')
            ->get();

        return Inertia::render('Categories/Show', compact('category', 'transactions'));
    }

    public function edit(Category $category)
    {
        if ($category->user_id !== auth()->id()) {
            abort(403, 'Não autorizado');
        }

        return Inertia::render('Categories/Edit', compact('category'));
    }

    public function update(Request $request, Category $category)
    {
        if ($category->user_id !== auth()->id()) {
            abort(403, 'Não autorizado');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:income,expense'
        ]);

        $category->update($request->only('name', 'type'));

        return redirect()->route('categories.index')
            ->with('success', 'Categoria atualizada com sucesso.');
    }

    public function destroy(Category $category)
    {
        if ($category->user_id !== auth()->id()) {
            abort(403, 'Não autorizado');
        }

        $category->delete();

        return redirect()->route('categories.index')
            ->with('success', 'Categoria excluída com sucesso.');
    }
}
