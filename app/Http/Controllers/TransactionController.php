<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        $transactions = $user->transactions()
            ->with('category')
            ->orderBy('transaction_date', 'desc')
            ->get();

        $categories = $user->categories()->get();

        return Inertia::render('Transactions/Index', compact('transactions', 'categories'));
    }

    public function create()
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        $categories = $user->categories()->get();

        return Inertia::render('Transactions/Create', compact('categories'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string|max:255',
            'transaction_date' => 'required|date'
        ]);

        /** @var \App\Models\User $user */
        $user = auth()->user();

        $user->transactions()->create($request->all());

        return redirect()->route('transactions.index');
    }

    public function show(Transaction $transaction)
    {
        if ($transaction->user_id !== auth()->id()) {
            abort(403, 'Não autorizado');
        }

        return Inertia::render('Transactions/Show', compact('transaction'));
    }

    public function edit(Transaction $transaction)
    {
        if ($transaction->user_id !== auth()->id()) {
            abort(403, 'Não autorizado');
        }

        /** @var \App\Models\User $user */
        $user = auth()->user();

        $categories = $user->categories()->get();

        return Inertia::render('Transactions/Edit', compact('transaction', 'categories'));
    }

    public function update(Request $request, Transaction $transaction)
    {
        if ($transaction->user_id !== auth()->id()) {
            abort(403, 'Não autorizado');
        }

        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string|max:255',
            'transaction_date' => 'required|date'
        ]);

        $transaction->update($request->all());

        return redirect()->route('transactions.index')
            ->with('success', 'Transação atualizada com sucesso.');
    }

    public function destroy(Transaction $transaction)
    {
        if ($transaction->user_id !== auth()->id()) {
            abort(403, 'Não autorizado');
        }

        $transaction->delete();

        return redirect()->route('transactions.index')
            ->with('success', 'Transação excluída com sucesso.');
    }
}
