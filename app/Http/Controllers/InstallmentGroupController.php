<?php

namespace App\Http\Controllers;

use App\Models\InstallmentGroup;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class InstallmentGroupController extends Controller
{
    public function index(): Response
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        $groups = $user->installmentGroups()
            ->with('category')
            ->withCount('transactions')
            ->orderByDesc('first_date')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('InstallmentGroups/Index', [
            'groups' => $groups,
        ]);
    }

    public function show(InstallmentGroup $installmentGroup): Response
    {
        $this->authorize('view', $installmentGroup);

        $installmentGroup->load(['category', 'transactions' => fn ($q) => $q->orderBy('installment_no')]);

        return Inertia::render('InstallmentGroups/Show', [
            'group' => $installmentGroup,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->normalizeDecimals($request, ['total_amount']);

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'type' => 'required|in:income,expense',
            'total_amount' => 'required|numeric|min:0.02|max:99999999.99',
            'installments' => 'required|integer|min:2|max:96',
            'first_date' => 'required|date',
            'description' => 'nullable|string|max:255',
        ]);

        /** @var \App\Models\User $user */
        $user = auth()->user();

        $total = (float) $validated['total_amount'];
        $n = (int) $validated['installments'];
        $base = floor(($total / $n) * 100) / 100;
        $firstDate = Carbon::parse($validated['first_date']);

        $group = DB::transaction(function () use ($user, $validated, $total, $n, $base, $firstDate) {
            $group = $user->installmentGroups()->create([
                'user_id' => $user->id,
                'category_id' => $validated['category_id'],
                'type' => $validated['type'],
                'total_amount' => $total,
                'installments' => $n,
                'installment_amount' => $base,
                'first_date' => $firstDate->toDateString(),
                'description' => $validated['description'] ?? null,
            ]);

            for ($i = 1; $i <= $n; $i++) {
                // Última parcela absorve a diferença de centavos
                $amount = $i === $n
                    ? round($total - $base * ($n - 1), 2)
                    : $base;

                $user->transactions()->create([
                    'category_id' => $validated['category_id'],
                    'installment_group_id' => $group->id,
                    'installment_no' => $i,
                    'installment_total' => $n,
                    'type' => $validated['type'],
                    'amount' => $amount,
                    'description' => $validated['description'] ?? null,
                    'transaction_date' => $firstDate->copy()->addMonthsNoOverflow($i - 1)->toDateString(),
                    'is_recurring' => false,
                ]);
            }

            return $group;
        });

        return redirect()->route('installment-groups.show', $group)
            ->with('success', "Parcelamento criado: {$n} parcelas.");
    }

    public function destroy(InstallmentGroup $installmentGroup): RedirectResponse
    {
        $this->authorize('delete', $installmentGroup);

        $count = $installmentGroup->transactions()->count();

        DB::transaction(function () use ($installmentGroup) {
            $installmentGroup->transactions()->delete();
            $installmentGroup->delete();
        });

        return redirect()->route('installment-groups.index')
            ->with('success', "Parcelamento excluído: {$count} parcelas removidas.");
    }

    public function restore(InstallmentGroup $installmentGroup): RedirectResponse
    {
        $this->authorize('delete', $installmentGroup);

        DB::transaction(function () use ($installmentGroup) {
            $installmentGroup->restore();
            $installmentGroup->transactions()->withTrashed()->restore();
        });

        return redirect()->route('installment-groups.index')
            ->with('success', 'Parcelamento restaurado.');
    }
}
