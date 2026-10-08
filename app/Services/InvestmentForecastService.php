<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class InvestmentForecastService
{
    /**
     * Taxas de referência do Banco Central (SGS), em % a.a.
     * CDI: série 12 (taxa diária, anualizada com 252 úteis).
     * Selic: série 432 (meta anual).
     * IPCA: série 13522 (acumulado 12 meses).
     * Retorna nulls se a API falhar (caller usa fallback do config).
     */
    public function getMarketRates(): ?array
    {
        try {
            $response = Http::timeout(4)->get('https://api.bcb.gov.br/dados/serie/bcdata.sgs.12/dados/ultimos/1', [
                'formato' => 'json',
            ]);

            $cdiDaily = null;
            if ($response->ok()) {
                $cdiDaily = (float) data_get($response->json(), '0.valor');
            }

            $selicResp = Http::timeout(4)->get('https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1', [
                'formato' => 'json',
            ]);
            $selic = $selicResp->ok() ? (float) data_get($selicResp->json(), '0.valor') : null;

            $ipcaResp = Http::timeout(4)->get('https://api.bcb.gov.br/dados/serie/bcdata.sgs.13522/dados/ultimos/1', [
                'formato' => 'json',
            ]);
            $ipca = $ipcaResp->ok() ? (float) data_get($ipcaResp->json(), '0.valor') : null;

            $cdi = null;
            if ($cdiDaily !== null) {
                $cdi = (pow(1 + $cdiDaily / 100, 252) - 1) * 100;
            }

            if ($cdi === null && $selic === null && $ipca === null) {
                return null;
            }

            return [
                'cdi' => $cdi !== null ? round($cdi, 2) : null,
                'selic' => $selic !== null ? round($selic, 2) : null,
                'ipca' => $ipca !== null ? round($ipca, 2) : null,
                'source' => 'Banco Central (SGS)',
                'updated' => now()->format('d/m/Y H:i'),
            ];
        } catch (\Throwable $e) {
            Log::warning('InvestmentForecastService: falha ao buscar taxas do BCB: '.$e->getMessage());

            return null;
        }
    }

    /**
     * Projeção de um instrumento: aporte único + aportes mensais, juros compostos
     * mensais, IR regressivo sobre o lucro (quando aplicável).
     *
     * @return array
     */
    public function project(
        array $instrument,
        float $amount,
        int $months,
        float $monthlyContribution,
        float $ipcaEstimate,
        ?array $marketRates = null,
    ): array {
        // Liquidez mínima (LCI/LCA com carência)
        if ($months < ($instrument['min_months'] ?? 0)) {
            return [
                'key' => $instrument['key'],
                'name' => $instrument['name'],
                'description' => $instrument['description'],
                'color' => $instrument['color'],
                'minMonths' => $instrument['min_months'],
                'available' => false,
            ];
        }

        $annualRate = $instrument['annual_rate'];

        if ($instrument['ipca_linked']) {
            // IPCA+ rende IPCA estimado + prêmio fixo (composto)
            $ipcaMonthly = pow(1 + $ipcaEstimate / 100, 1 / 12) - 1;
            $fixedMonthly = pow(1 + $annualRate, 1 / 12) - 1;
            $monthlyRate = (1 + $ipcaMonthly) * (1 + $fixedMonthly) - 1;

            // Parcela isenta: crescimento apenas pelo IPCA (sobre o aporte total investido)
            $ipcaOnlyMonthly = $ipcaMonthly;
        } else {
            $monthlyRate = pow(1 + $annualRate, 1 / 12) - 1;
            $ipcaOnlyMonthly = null;
        }

        // Série mês a mês (valor bruto, sem IR) para o gráfico
        $series = [];
        $balance = $amount;
        $invested = $amount;
        $series[] = ['month' => 0, 'value' => round($balance, 2)];

        for ($m = 1; $m <= $months; $m++) {
            $balance = $balance * (1 + $monthlyRate) + $monthlyContribution;
            $invested += $monthlyContribution;
            $series[] = ['month' => $m, 'value' => round($balance, 2)];
        }

        $finalGross = $balance;
        $profitGross = max(0, $finalGross - $invested);

        // IR regressivo sobre o lucro (por dias corridos ≈ meses * 30,4)
        $irAmount = 0.0;
        if ($instrument['ir'] && $profitGross > 0) {
            if ($instrument['ipca_linked'] && $ipcaOnlyMonthly !== null) {
                // Tesouro IPCA+: IR só sobre a parcela acima do IPCA
                $ipcaOnlyBalance = $amount;
                for ($m = 1; $m <= $months; $m++) {
                    $ipcaOnlyBalance = $ipcaOnlyBalance * (1 + $ipcaOnlyMonthly) + $monthlyContribution;
                }
                $taxableProfit = max(0, $finalGross - $ipcaOnlyBalance);
                $irAmount = $taxableProfit * $this->irRate($months);
            } else {
                $irAmount = $profitGross * $this->irRate($months);
            }
        }

        $finalNet = $finalGross - $irAmount;
        $profitNet = max(0, $finalNet - $invested);

        return [
            'key' => $instrument['key'],
            'name' => $instrument['name'],
            'description' => $instrument['description'],
            'color' => $instrument['color'],
            'minMonths' => $instrument['min_months'],
            'available' => true,
            'annualRate' => round($annualRate * 100, 2),
            'ipcaLinked' => (bool) $instrument['ipca_linked'],
            'irExempt' => ! $instrument['ir'],
            'irRate' => $instrument['ir'] ? round($this->irRate($months) * 100, 1) : 0,
            'invested' => round($invested, 2),
            'finalGross' => round($finalGross, 2),
            'finalNet' => round($finalNet, 2),
            'profitGross' => round($profitGross, 2),
            'profitNet' => round($profitNet, 2),
            'irAmount' => round($irAmount, 2),
            'returnPct' => $invested > 0 ? round(($profitNet / $invested) * 100, 2) : 0,
            'series' => $series,
        ];
    }

    /**
     * Alíquota de IR regressiva com base no prazo em meses.
     * 22,5% até 180 dias (≈6 meses), 20% até 360d, 17,5% até 720d, 15% acima.
     */
    public function irRate(int $months): float
    {
        $days = (int) round($months * 30.44);

        return match (true) {
            $days <= 180 => 0.225,
            $days <= 360 => 0.20,
            $days <= 720 => 0.175,
            default => 0.15,
        };
    }

    /**
     * Projeta todos os instrumentos do catálogo.
     *
     * @return array{marketRates: array, instruments: array}
     */
    public function forecastAll(float $amount, int $months, float $monthlyContribution, float $ipcaEstimate): array
    {
        $marketRates = $this->getMarketRates();
        $effectiveIpca = $marketRates['ipca'] ?? $ipcaEstimate;

        $instruments = collect(config('investments.instruments'))
            ->map(fn (array $instrument) => $this->project(
                $instrument,
                $amount,
                $months,
                $monthlyContribution,
                $effectiveIpca,
                $marketRates,
            ))
            ->values()
            ->all();

        return [
            'marketRates' => $marketRates ?? [
                'cdi' => config('investments.fallback_rates.cdi'),
                'selic' => config('investments.fallback_rates.selic'),
                'ipca' => config('investments.fallback_rates.ipca'),
                'source' => 'Referência local (BCB indisponível)',
                'updated' => now()->format('d/m/Y H:i'),
            ],
            'instruments' => $instruments,
        ];
    }
}
