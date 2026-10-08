<?php

namespace App\Http\Controllers;

use App\Models\InvestmentSimulation;
use App\Services\InvestmentForecastService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InvestmentForecastController extends Controller
{
    public function index(Request $request, InvestmentForecastService $service): Response
    {
        $validated = $request->validate([
            'amount' => ['sometimes', 'numeric', 'min:1', 'max:10000000'],
            'months' => ['sometimes', 'integer', 'min:1', 'max:120'],
            'monthly' => ['sometimes', 'numeric', 'min:0', 'max:1000000'],
            'ipca' => ['sometimes', 'numeric', 'min:0', 'max:20'],
        ]);

        $amount = (float) ($validated['amount'] ?? 1000);
        $months = (int) ($validated['months'] ?? 12);
        $monthly = (float) ($validated['monthly'] ?? 0);
        $ipca = (float) ($validated['ipca'] ?? 4.0);

        $forecast = $service->forecastAll($amount, $months, $monthly, $ipca);

        $history = $request->user()
            ->investmentSimulations()
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn (InvestmentSimulation $s) => [
                'id' => $s->id,
                'instrumentKey' => $s->instrument_key,
                'instrumentName' => $s->instrument_name,
                'amount' => (float) $s->amount,
                'monthlyContribution' => (float) $s->monthly_contribution,
                'months' => $s->months,
                'finalNet' => (float) $s->final_net,
                'profitNet' => (float) $s->profit_net,
                'returnPct' => (float) $s->return_pct,
                'createdAt' => $s->created_at->format('d/m/Y H:i'),
            ]);

        return Inertia::render('Investments', [
            'inputs' => [
                'amount' => $amount,
                'months' => $months,
                'monthly' => $monthly,
                'ipca' => $ipca,
            ],
            'marketRates' => $forecast['marketRates'],
            'instruments' => $forecast['instruments'],
            'history' => $history,
        ]);
    }

    public function store(Request $request, InvestmentForecastService $service): RedirectResponse
    {
        $validated = $request->validate([
            'instrumentKey' => ['required', 'string', 'max:40'],
            'amount' => ['required', 'numeric', 'min:1', 'max:10000000'],
            'months' => ['required', 'integer', 'min:1', 'max:120'],
            'monthly' => ['sometimes', 'numeric', 'min:0', 'max:1000000'],
            'ipca' => ['sometimes', 'numeric', 'min:0', 'max:20'],
        ]);

        $instrument = collect(config('investments.instruments'))
            ->firstWhere('key', $validated['instrumentKey']);

        if (! $instrument) {
            return back()->withErrors(['instrumentKey' => 'Instrumento inválido.']);
        }

        $months = (int) $validated['months'];
        if ($months < ($instrument['min_months'] ?? 0)) {
            return back()->withErrors([
                'months' => "{$instrument['name']} exige prazo mínimo de {$instrument['min_months']} meses.",
            ]);
        }

        $result = $service->project(
            $instrument,
            (float) $validated['amount'],
            $months,
            (float) ($validated['monthly'] ?? 0),
            (float) ($validated['ipca'] ?? 4.0),
        );

        if (! ($result['available'] ?? false)) {
            return back()->withErrors(['months' => 'Prazo insuficiente para este instrumento.']);
        }

        $request->user()->investmentSimulations()->create([
            'instrument_key' => $instrument['key'],
            'instrument_name' => $instrument['name'],
            'amount' => $validated['amount'],
            'monthly_contribution' => $validated['monthly'] ?? 0,
            'months' => $months,
            'ipca_estimate' => $instrument['ipca_linked'] ? ($validated['ipca'] ?? 4.0) : null,
            'final_gross' => $result['finalGross'],
            'final_net' => $result['finalNet'],
            'profit_net' => $result['profitNet'],
            'return_pct' => $result['returnPct'],
        ]);

        return back()->with('success', 'Simulação salva no histórico.');
    }

    public function destroy(Request $request, InvestmentSimulation $simulation): RedirectResponse
    {
        abort_unless($simulation->user_id === $request->user()->id, 403);

        $simulation->delete();

        return back()->with('success', 'Simulação removida.');
    }
}
