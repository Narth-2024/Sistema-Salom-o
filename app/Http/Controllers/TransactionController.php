<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function index(Request $request): Response
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        $query = $user->transactions()->with('category', 'tags');

        // Filtro por descrição
        if ($search = $request->query('search')) {
            $query->where('description', 'ilike', "%{$search}%");
        }

        // Filtro por tipo
        if ($type = $request->query('type')) {
            $query->where('type', $type);
        }

        // Filtro por categoria
        if ($categoryId = $request->query('category_id')) {
            $query->where('category_id', $categoryId);
        }

        // Filtro por tag
        if ($tagId = $request->query('tag_id')) {
            $query->whereHas('tags', fn ($q) => $q->where('tags.id', $tagId));
        }

        // Filtro por período
        if ($dateFrom = $request->query('date_from')) {
            $query->whereDate('transaction_date', '>=', $dateFrom);
        }
        if ($dateTo = $request->query('date_to')) {
            $query->whereDate('transaction_date', '<=', $dateTo);
        }

        // Ordenação
        $sortField = $request->query('sort', 'transaction_date');
        $sortDirection = $request->query('direction', 'desc');
        $allowedSorts = ['transaction_date', 'amount', 'description'];

        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortDirection === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderBy('transaction_date', 'desc');
        }

        $perPage = min((int) $request->query('per_page', 15), 50);
        $transactions = $query->paginate($perPage)->withQueryString();

        $categories = $user->categories()->get();
        $tags = $user->tags()->get();

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
            'categories' => $categories,
            'tags' => $tags,
            'filters' => $request->only(['search', 'type', 'category_id', 'tag_id', 'date_from', 'date_to', 'sort', 'direction']),
        ]);
    }

    public function create(): Response
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        $categories = $user->categories()->get();
        $tags = $user->tags()->get();

        return Inertia::render('Transactions/Create', [
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string|max:255',
            'transaction_date' => 'required|date',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id',
        ]);

        /** @var \App\Models\User $user */
        $user = auth()->user();

        $transaction = $user->transactions()->create(
            $request->safe()->only(['category_id', 'type', 'amount', 'description', 'transaction_date'])
        );

        if ($tagIds = $request->input('tag_ids')) {
            $transaction->tags()->sync($tagIds);
        }

        return redirect()->route('transactions.index');
    }

    public function show(Transaction $transaction): Response
    {
        $this->authorize('view', $transaction);

        $transaction->load('category', 'tags');

        return Inertia::render('Transactions/Show', [
            'transaction' => $transaction,
        ]);
    }

    public function edit(Transaction $transaction): Response
    {
        $this->authorize('update', $transaction);

        /** @var \App\Models\User $user */
        $user = auth()->user();

        $categories = $user->categories()->get();
        $tags = $user->tags()->get();

        $transaction->load('tags');

        return Inertia::render('Transactions/Edit', [
            'transaction' => $transaction,
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    public function update(Request $request, Transaction $transaction): RedirectResponse
    {
        $this->authorize('update', $transaction);

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string|max:255',
            'transaction_date' => 'required|date',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id',
        ]);

        $transaction->update(
            $request->safe()->only(['category_id', 'type', 'amount', 'description', 'transaction_date'])
        );

        $transaction->tags()->sync($request->input('tag_ids', []));

        return redirect()->route('transactions.index')
            ->with('success', 'Transação atualizada com sucesso.');
    }

    public function destroy(Transaction $transaction): RedirectResponse
    {
        $this->authorize('delete', $transaction);

        $transaction->delete();

        return redirect()->route('transactions.index')
            ->with('success', 'Transação excluída com sucesso.');
    }
}
