import { useEffect, useRef, useState } from 'react'
import { Head, router, useForm } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout.jsx'
import { Card, Button, Input, ConfirmDialog } from '@/Components'
import { chartColors, hexToRgba } from '@/lib/chartColors.js'
import {
    PiggyBank, TrendingUp, Calculator, Info, ShieldCheck,
    LineChart, History, Trash2, Lock,
} from 'lucide-react'

function formatBR(value) {
    return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const PRESET_MONTHS = [6, 12, 24, 36, 60]

export default function Investments({ inputs, marketRates, instruments, history }) {
    const lineRef = useRef(null)
    const lineInstance = useRef(null)
    const [confirmDelete, setConfirmDelete] = useState(null)

    const { data, setData, get, processing } = useForm({
        amount: inputs.amount,
        months: inputs.months,
        monthly: inputs.monthly,
        ipca: inputs.ipca,
    })

    function submit(e) {
        e.preventDefault()
        get('/investments', { preserveState: true, preserveScroll: true })
    }

    function setPresetMonths(months) {
        setData('months', months)
        router.get('/investments', { ...data, months }, { preserveState: true, preserveScroll: true })
    }

    function deleteSimulation(id) {
        router.delete(`/investments/simulations/${id}`, { preserveScroll: true })
    }

    const available = instruments.filter(i => i.available)
    const unavailable = instruments.filter(i => !i.available)

    useEffect(() => {
        async function initChart() {
            const {
                Chart, LineController, LineElement, PointElement,
                CategoryScale, LinearScale, Legend, Tooltip, Filler,
            } = await import('chart.js')
            Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip, Filler)

            if (!lineRef.current || available.length === 0) return
            if (lineInstance.current) lineInstance.current.destroy()

            const c = chartColors()
            const maxMonths = Math.max(...available.map(i => i.series.length - 1), 1)
            const labels = Array.from({ length: maxMonths + 1 }, (_, m) => (m === 0 ? 'Hoje' : `${m}m`))

            lineInstance.current = new Chart(lineRef.current, {
                type: 'line',
                data: {
                    labels,
                    datasets: available.map(inst => ({
                        label: inst.name,
                        data: inst.series.map(p => p.value),
                        borderColor: inst.color,
                        backgroundColor: hexToRgba(inst.color, 0.08),
                        tension: 0.35,
                        pointRadius: 0,
                        pointHoverRadius: 4,
                        borderWidth: 2,
                        fill: false,
                    })),
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: { intersect: false, mode: 'index' },
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: { usePointStyle: true, pointStyleWidth: 8, color: c.text, font: { family: 'Inter', size: 11 } },
                        },
                        tooltip: {
                            callbacks: {
                                label: ctx => `${ctx.dataset.label}: ${formatBR(ctx.parsed.y)}`,
                            },
                        },
                    },
                    scales: {
                        x: { grid: { display: false }, ticks: { color: c.muted, maxTicksLimit: 13 } },
                        y: {
                            grid: { color: c.grid },
                            ticks: { color: c.muted, callback: v => 'R$' + v.toLocaleString('pt-BR') },
                        },
                    },
                },
            })
        }

        initChart()
        return () => { if (lineInstance.current) lineInstance.current.destroy() }
    }, [instruments])

    const best = available.length > 0
        ? available.reduce((a, b) => (b.finalNet > a.finalNet ? b : a))
        : null

    return (
        <AppLayout>
            <Head title="Investimentos" />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="mb-6 sm:mb-8" data-tour="inv-header">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <PiggyBank className="w-7 h-7 text-accent-text" />
                        Investimentos
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Simule o rendimento do seu dinheiro em instrumentos de renda fixa seguros.
                    </p>
                </div>

                <Card className="mb-6" data-tour="inv-form">
                    <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-accent-text" />
                        Simulação
                    </h2>

                    <form onSubmit={submit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                    Valor inicial (R$)
                                </label>
                                <Input
                                    type="number"
                                    min="1"
                                    max="10000000"
                                    step="0.01"
                                    value={data.amount}
                                    onChange={e => setData('amount', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                    Aporte mensal (R$)
                                </label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="1000000"
                                    step="0.01"
                                    value={data.monthly}
                                    onChange={e => setData('monthly', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                    Prazo (meses)
                                </label>
                                <Input
                                    type="number"
                                    min="1"
                                    max="120"
                                    value={data.months}
                                    onChange={e => setData('months', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                    IPCA estimado (% a.a.)
                                </label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="20"
                                    step="0.1"
                                    value={data.ipca}
                                    onChange={e => setData('ipca', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs text-gray-500">Prazos rápidos:</span>
                            {PRESET_MONTHS.map(m => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => setPresetMonths(m)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                        Number(data.months) === m
                                            ? 'bg-primary text-primary-fg'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {m} meses
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button type="submit" variant="primary" size="sm" disabled={processing}>
                                {processing ? 'Calculando…' : 'Simular'}
                            </Button>
                        </div>
                    </form>
                </Card>

                {marketRates && (
                    <div className="flex flex-wrap items-center gap-2 mb-6 text-xs text-gray-500" data-tour="inv-rates">
                        <ShieldCheck className="w-4 h-4 text-accent-text" />
                        <span className="font-semibold">Taxas de referência ({marketRates.source}):</span>
                        {marketRates.cdi != null && <span className="px-2 py-1 bg-gray-100 rounded-lg">CDI {marketRates.cdi}% a.a.</span>}
                        {marketRates.selic != null && <span className="px-2 py-1 bg-gray-100 rounded-lg">Selic {marketRates.selic}% a.a.</span>}
                        {marketRates.ipca != null && <span className="px-2 py-1 bg-gray-100 rounded-lg">IPCA 12m {marketRates.ipca}%</span>}
                        <span>· atualizado {marketRates.updated}</span>
                    </div>
                )}

                {best && (
                    <div className="rounded-2xl p-5 mb-6 border border-panel-border bg-panel-bg" data-tour="inv-best">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Melhor resultado no prazo simulado</p>
                        <p className="text-xl font-extrabold text-accent-text flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            {best.name} — {formatBR(best.finalNet)} líquidos
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Rentabilidade líquida de {best.returnPct}% sobre {formatBR(best.invested)} investidos.
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8" data-tour="inv-results">
                    {available.map(inst => (
                        <Card key={inst.key} hover className="relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: inst.color }} />
                            <div className="flex items-start justify-between mb-3 pl-2">
                                <div>
                                    <p className="font-semibold text-gray-800">{inst.name}</p>
                                    <p className="text-xs text-gray-500 mt-0.5 leading-snug">{inst.description}</p>
                                </div>
                                {inst.ipcaLinked && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-500 shrink-0 ml-2">
                                        IPCA+
                                    </span>
                                )}
                            </div>

                            <div className="pl-2">
                                <p className="text-2xl font-extrabold tabular-nums" style={{ color: inst.color }}>
                                    {formatBR(inst.finalNet)}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">valor líquido ao final</p>

                                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border text-xs">
                                    <div>
                                        <p className="text-gray-500">Bruto</p>
                                        <p className="font-semibold text-gray-700 tabular-nums">{formatBR(inst.finalGross)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Lucro líquido</p>
                                        <p className="font-semibold text-accent-text tabular-nums">{formatBR(inst.profitNet)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Taxa base</p>
                                        <p className="font-semibold text-gray-700">
                                            {inst.ipcaLinked ? `IPCA + ${inst.annualRate}% a.a.` : `${inst.annualRate}% a.a.`}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">IR</p>
                                        <p className="font-semibold text-gray-700">
                                            {inst.irExempt ? 'Isento' : `${inst.irRate}% no lucro`}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                        onClick={() => router.post('/investments', {
                                            instrumentKey: inst.key,
                                            amount: data.amount,
                                            months: data.months,
                                            monthly: data.monthly,
                                            ipca: data.ipca,
                                        }, { preserveScroll: true })}
                                    >
                                        Salvar no histórico
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {unavailable.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8 text-xs text-gray-500">
                        <Lock className="w-4 h-4" />
                        <span>
                            Prazo insuficiente para: {unavailable.map(i => `${i.name} (mín. ${i.minMonths}m)`).join(', ')}.
                        </span>
                    </div>
                )}

                {available.length > 0 && (
                    <Card className="mb-8" data-tour="inv-chart">
                        <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <LineChart className="w-5 h-5 text-accent-text" />
                            Evolução projetada (valor líquido)
                        </h2>
                        <div className="w-full" style={{ height: 320 }}>
                            <canvas ref={lineRef} />
                        </div>
                        <p className="text-xs text-gray-500 mt-3 flex items-start gap-1.5">
                            <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                            Projeção com juros compostos e aportes mensais, considerando o IR regressivo sobre o lucro.
                            Taxas são referências de mercado — não é recomendação de investimento.
                        </p>
                    </Card>
                )}

                <Card data-tour="inv-history">
                    <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <History className="w-5 h-5 text-accent-text" />
                        Histórico de simulações
                    </h2>

                    {history.length === 0 ? (
                        <p className="text-sm text-gray-500">
                            Nenhuma simulação salva ainda. Configure a simulação acima e clique em "Salvar no histórico".
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-border">
                                        <th className="pb-2 pr-3">Data</th>
                                        <th className="pb-2 pr-3">Instrumento</th>
                                        <th className="pb-2 pr-3">Inicial</th>
                                        <th className="pb-2 pr-3">Mensal</th>
                                        <th className="pb-2 pr-3">Prazo</th>
                                        <th className="pb-2 pr-3">Líquido</th>
                                        <th className="pb-2 pr-3">Rent.</th>
                                        <th className="pb-2" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map(sim => (
                                        <tr key={sim.id} className="border-b border-border last:border-0">
                                            <td className="py-2.5 pr-3 text-gray-500 whitespace-nowrap">{sim.createdAt}</td>
                                            <td className="py-2.5 pr-3 font-medium text-gray-800">{sim.instrumentName}</td>
                                            <td className="py-2.5 pr-3 tabular-nums">{formatBR(sim.amount)}</td>
                                            <td className="py-2.5 pr-3 tabular-nums">{sim.monthlyContribution > 0 ? formatBR(sim.monthlyContribution) : '—'}</td>
                                            <td className="py-2.5 pr-3">{sim.months}m</td>
                                            <td className="py-2.5 pr-3 font-semibold text-accent-text tabular-nums">{formatBR(sim.finalNet)}</td>
                                            <td className="py-2.5 pr-3 tabular-nums">{sim.returnPct}%</td>
                                            <td className="py-2.5 text-right">
                                                <button
                                                    onClick={() => setConfirmDelete(sim)}
                                                    title="Excluir simulação"
                                                    className="text-gray-400 hover:text-red-400 transition p-1 rounded-lg hover:bg-red-500/10 cursor-pointer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </main>

            <ConfirmDialog
                open={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                onConfirm={() => deleteSimulation(confirmDelete.id)}
                title="Excluir simulação"
                message="Remover esta simulação do histórico?"
                itemLabel={confirmDelete ? `${confirmDelete.instrumentName} — ${formatBR(confirmDelete.finalNet)}` : undefined}
            />
        </AppLayout>
    )
}
