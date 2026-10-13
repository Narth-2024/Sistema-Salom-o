<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Exists;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    /**
     * Garante que a categoria/tag exista E pertença ao usuário autenticado,
     * impedindo que um usuário referencie registros de outro usuário.
     */
    private function belongsToUserRule(string $table, User $user): Exists
    {
        return Rule::exists($table, 'id')->where('user_id', $user->id);
    }

    private function filteredQuery(Request $request): Relation
    {
        /** @var User $user */
        $user = auth()->user();

        $query = $user->transactions()->with('category', 'tags');

        // Filtro por descrição (case-insensitive; sqlite não suporta ilike)
        if ($search = $request->query('search')) {
            $operator = DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';
            $query->where('description', $operator, "%{$search}%");
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

        /** @var User $user */
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
        /** @var User $user */
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
        $this->normalizeDecimals($request, ['amount']);

        /** @var User $user */
        $user = auth()->user();

        $validated = $request->validate([
            'category_id' => ['required', $this->belongsToUserRule('categories', $user)],
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric|min:0.01|max:99999999.99',
            'description' => 'nullable|string|max:255',
            'transaction_date' => 'required|date',
            'is_recurring' => 'nullable|boolean',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => $this->belongsToUserRule('tags', $user),
        ]);

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

        /** @var User $user */
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

        $this->normalizeDecimals($request, ['amount']);

        /** @var User $user */
        $user = auth()->user();

        $validated = $request->validate([
            'category_id' => ['required', $this->belongsToUserRule('categories', $user)],
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric|min:0.01|max:99999999.99',
            'description' => 'nullable|string|max:255',
            'transaction_date' => 'required|date',
            'is_recurring' => 'nullable|boolean',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => $this->belongsToUserRule('tags', $user),
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
            ->with('success', 'Transação excluída.')
            ->with('undo', route('transactions.restore', $transaction));
    }

    public function restore(Transaction $transaction): RedirectResponse
    {
        $this->authorize('delete', $transaction);

        $transaction->restore();

        return redirect()->route('transactions.index')
            ->with('success', 'Transação restaurada.');
    }
}
