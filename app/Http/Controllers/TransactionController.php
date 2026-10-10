<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    private function filteredQuery(Request $request): \Illuminate\Database\Eloquent\Relations\Relation
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

        return $query;
    }

    public function index(Request $request): Response
    {
        $query = $this->filteredQuery($request);

        $perPage = min((int) $request->query('per_page', 15), 50);
        $transactions = $query->paginate($perPage)->withQueryString();

        /** @var \App\Models\User $user */
        $user = auth()->user();
        $categories = $user->categories()->get();
        $tags = $user->tags()->get();

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
            'categories' => $categories,
            'tags' => $tags,
            'filters' => $request->only(['search', 'type', 'category_id', 'tag_id', 'date_from', 'date_to', 'sort', 'direction']),
        ]);
    }

    public function export(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $transactions = $this->filteredQuery($request)->get();

        $filename = 'transacoes_' . now()->format('Y-m-d_H-i') . '.csv';

        return response()->streamDownload(function () use ($transactions) {
            $out = fopen('php://output', 'w');
            fprintf($out, chr(0xEF) . chr(0xBB) . chr(0xBF));
            fputcsv($out, ['Data', 'Tipo', 'Descrição', 'Categoria', 'Valor (R$)', 'Tags', 'Recorrente'], ';');
            foreach ($transactions as $t) {
                fputcsv($out, [
                    $t->transaction_date,
                    $t->type === 'income' ? 'Receita' : 'Despesa',
                    $t->description ?? '',
                    $t->category?->name ?? '',
                    number_format((float) $t->amount, 2, ',', '.'),
                    $t->tags->pluck('name')->implode(', '),
                    $t->is_recurring ? 'Sim' : 'Não',
                ], ';');
            }
            fclose($out);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
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
            'amount' => 'required|numeric|min:0.01|max:99999999.99',
            'description' => 'nullable|string|max:255',
            'transaction_date' => 'required|date',
            'is_recurring' => 'nullable|boolean',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id',
        ]);

        /** @var \App\Models\User $user */
        $user = auth()->user();

        $transaction = $user->transactions()->create(
            Arr::except($validated, ['tag_ids'])
        );

        if ($tagIds = $request->input('tag_ids')) {
            $transaction->tags()->sync($tagIds);
        }

        return redirect()->route('transactions.index', $request->query())
            ->with('success', 'Transação criada com sucesso.');
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
            'amount' => 'required|numeric|min:0.01|max:99999999.99',
            'description' => 'nullable|string|max:255',
            'transaction_date' => 'required|date',
            'is_recurring' => 'nullable|boolean',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id',
        ]);

        $transaction->update(
            Arr::except($validated, ['tag_ids'])
        );

        $transaction->tags()->sync($request->input('tag_ids', []));

        return redirect()->route('transactions.index', $request->query())
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
