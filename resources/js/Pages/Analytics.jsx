import { useEffect, useRef } from 'react'
import { Head, router } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout.jsx'
import { Card } from '@/Components'
import { chartColors, hexToRgba } from '@/lib/chartColors.js'
import {
    TrendingUp, TrendingDown, Wallet, BarChart3, LineChart,
    ArrowUpRight, ArrowDownRight, Filter, Percent, Receipt, Wallet2
} from 'lucide-react'

function formatBR(value) {
    return Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatCompactBRL(value) {
    const v = Number(value || 0)
    const abs = Math.abs(v)
    const sign = v < 0 ? '-' : ''
    if (abs >= 1_000_000) {
        return `${sign}R$ ${(abs / 1_000_000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mi`
    }
    if (abs >= 1_000) {
        return `${sign}R$ ${(abs / 1_000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mil`
    }
    return `${sign}R$ ${abs.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`
}

const FALLBACK_CAT_COLORS = ['#f97316', '#8b5cf6', '#f59e0b', '#ec4899', '#14b8a6', '#6366f1', '#3ecf8e']

function currencyTicks(c) {
    return {
        color: c.muted,
        font: { family: 'Inter, system-ui, sans-serif', size: 11 },
        callback: v => formatCompactBRL(v),
    }
}

function legendOpts(c) {
    return {
        position: 'top',
        labels: {
            usePointStyle: true,
            pointStyleWidth: 8,
            boxHeight: 8,
            color: c.text,
            font: { family: 'Inter, system-ui, sans-serif', size: 11 },
        },
    }
}

export default function Analytics({
    barChart, timeline, comparative, incomeTotal, expenseTotal, balanceTotal,
    categoryChart = [], economyRate, ticketMedio, hasData, period = '12_months',
}) {
    const barRef = useRef(null)
    const lineRef = useRef(null)
    const balanceRef = useRef(null)
    const categoryRef = useRef(null)
    const barInstance = useRef(null)
    const lineInstance = useRef(null)
    const balanceInstance = useRef(null)
    const categoryInstance = useRef(null)

    const periodOptions = [
        { value: '3_months', label: '3m' },
        { value: '6_months', label: '6m' },
        { value: '12_months', label: '12m' },
        { value: 'all', label: 'Tudo' },
    ]

    function handlePeriodChange(value) {
        router.get('/analytics', { period: value }, {
            preserveState: true,
            preserveScroll: true,
        })
    }

    useEffect(() => {
        if (!hasData) return

        let cancelled = false

        async function initCharts() {
            const {
                Chart,
                BarController, BarElement, CategoryScale, LinearScale,
                LineController, LineElement, PointElement,
                Legend, Tooltip, Filler
            } = await import('chart.js')

            if (cancelled) return

            Chart.register(
                BarController, BarElement, CategoryScale, LinearScale,
                LineController, LineElement, PointElement,
                Legend, Tooltip, Filler
            )

            const c = chartColors()

            const baseAnim = { duration: 600, easing: 'easeOutQuart' }
            const currencyTooltip = {
                callbacks: {
                    label: ctx => `${ctx.dataset.label ? ctx.dataset.label + ': ' : ''}${formatBR(ctx.parsed.y ?? ctx.parsed.x)}`,
                },
            }

            if (barRef.current) {
                if (barInstance.current) barInstance.current.destroy()
                const avgIncome = barChart.reduce((s, d) => s + d.income, 0) / (barChart.length || 1)
                const avgExpense = barChart.reduce((s, d) => s + d.expense, 0) / (barChart.length || 1)

                barInstance.current = new Chart(barRef.current, {
                    type: 'bar',
                    data: {
                        labels: barChart.map(d => d.label),
                        datasets: [
                            {
                                label: 'Receitas',
                                type: 'bar',
                                data: barChart.map(d => d.income),
                                backgroundColor: c.income,
                                borderRadius: 6,
                                borderSkipped: false,
                                maxBarThickness: 36,
                                order: 2,
                            },
                            {
                                label: 'Despesas',
                                type: 'bar',
                                data: barChart.map(d => d.expense),
                                backgroundColor: c.expense,
                                borderRadius: 6,
                                borderSkipped: false,
                                maxBarThickness: 36,
                                order: 2,
                            },
                            {
                                label: 'Média receitas',
                                type: 'line',
                                data: barChart.map(() => avgIncome),
                                borderColor: hexToRgba(c.income, 0.55),
                                borderDash: [6, 4],
                                borderWidth: 1.5,
                                pointRadius: 0,
                                pointHoverRadius: 0,
                                fill: false,
                                order: 1,
                            },
                            {
                                label: 'Média despesas',
                                type: 'line',
                                data: barChart.map(() => avgExpense),
                                borderColor: hexToRgba(c.expense, 0.55),
                                borderDash: [6, 4],
                                borderWidth: 1.5,
                                pointRadius: 0,
                                pointHoverRadius: 0,
                                fill: false,
                                order: 1,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        animation: baseAnim,
                        interaction: { intersect: false, mode: 'index' },
                        plugins: {
                            legend: legendOpts(c),
                            tooltip: currencyTooltip,
                        },
                        scales: {
                            x: {
                                grid: { display: false },
                                ticks: { color: c.muted, font: { family: 'Inter, system-ui, sans-serif', size: 11 } },
                            },
                            y: {
                                grid: { color: c.grid, drawTicks: false },
                                border: { display: false },
                                ticks: currencyTicks(c),
                            },
                        },
                    },
                })
            }

            if (balanceRef.current) {
                if (balanceInstance.current) balanceInstance.current.destroy()
                balanceInstance.current = new Chart(balanceRef.current, {
                    type: 'bar',
                    data: {
                        labels: barChart.map(d => d.label),
                        datasets: [{
                            label: 'Saldo do mês',
                            data: barChart.map(d => Number((d.income - d.expense).toFixed(2))),
                            backgroundColor: ctx => (ctx.raw ?? 0) >= 0 ? c.income : c.expense,
                            borderRadius: 6,
                            borderSkipped: false,
                            maxBarThickness: 36,
                        }],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        animation: baseAnim,
                        interaction: { intersect: false, mode: 'index' },
                        plugins: {
                            legend: { display: false },
                            tooltip: currencyTooltip,
                        },
                        scales: {
                            x: {
                                grid: { display: false },
                                ticks: { color: c.muted, font: { family: 'Inter, system-ui, sans-serif', size: 11 } },
                            },
                            y: {
                                grid: { color: c.grid, drawTicks: false },
                                border: { display: false },
                                ticks: currencyTicks(c),
                            },
                        },
                    },
                })
            }

            if (lineRef.current) {
                if (lineInstance.current) lineInstance.current.destroy()
                lineInstance.current = new Chart(lineRef.current, {
                    type: 'line',
                    data: {
                        labels: timeline.map(d => d.label),
                        datasets: [{
                            label: 'Saldo',
                            data: timeline.map(d => d.balance),
                            borderColor: c.balance,
                            backgroundColor: ctx => {
                                const { chart } = ctx
                                const { ctx: cctx, chartArea } = chart
                                if (!chartArea) return hexToRgba(c.balance, 0.15)
                                const gradient = cctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
                                gradient.addColorStop(0, hexToRgba(c.balance, 0.25))
                                gradient.addColorStop(1, hexToRgba(c.balance, 0))
                                return gradient
                            },
                            fill: true,
                            tension: 0.35,
                            pointRadius: 3,
                            pointHoverRadius: 6,
                            pointBackgroundColor: c.balance,
                            pointBorderColor: c.background,
                            pointBorderWidth: 2,
                            pointHoverBorderWidth: 2,
                            borderWidth: 2.5,
                        }],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        animation: baseAnim,
                        interaction: { intersect: false, mode: 'index' },
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                callbacks: {
                                    label: ctx => 'Saldo: ' + formatBR(ctx.parsed.y),
                                },
                            },
                        },
                        scales: {
                            x: {
                                grid: { display: false },
                                ticks: { color: c.muted, font: { family: 'Inter, system-ui, sans-serif', size: 11 } },
                            },
                            y: {
                                grid: { color: c.grid, drawTicks: false },
                                border: { display: false },
                                ticks: currencyTicks(c),
                            },
                        },
                    },
                })
            }

            if (categoryRef.current) {
                if (categoryInstance.current) categoryInstance.current.destroy()
                categoryInstance.current = new Chart(categoryRef.current, {
                    type: 'bar',
                    data: {
                        labels: categoryChart.map(cat => cat.name),
                        datasets: [{
                            label: 'Despesas',
                            data: categoryChart.map(cat => Number(cat.total)),
                            backgroundColor: categoryChart.map((cat, i) => cat.color || FALLBACK_CAT_COLORS[i % FALLBACK_CAT_COLORS.length]),
                            borderRadius: 6,
                            borderSkipped: false,
                            maxBarThickness: 22,
                        }],
                    },
                    options: {
                        indexAxis: 'y',
                        responsive: true,
                        maintainAspectRatio: false,
                        animation: baseAnim,
                        onHover: (evt, elements) => {
                            evt.native.target.style.cursor = elements.length ? 'pointer' : 'default'
                        },
                        onClick: (evt, elements) => {
                            if (!elements.length) return
                            const cat = categoryChart[elements[0].index]
                            if (cat?.id) {
                                router.visit('/transactions', { type: 'expense', category_id: cat.id })
                            }
                        },
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                callbacks: {
                                    label: ctx => formatBR(ctx.parsed.x),
                                },
                            },
                        },
                        scales: {
                            x: {
                                grid: { color: c.grid, drawTicks: false },
                                border: { display: false },
                                ticks: currencyTicks(c),
                            },
                            y: {
                                grid: { display: false },
                                ticks: {
                                    color: c.text,
                                    font: { family: 'Inter, system-ui, sans-serif', size: 12, weight: '500' },
                                },
                            },
                        },
                    },
                })
            }
        }

        initCharts()
        return () => {
            cancelled = true
            if (barInstance.current) barInstance.current.destroy()
            if (lineInstance.current) lineInstance.current.destroy()
            if (balanceInstance.current) balanceInstance.current.destroy()
            if (categoryInstance.current) categoryInstance.current.destroy()
        }
    }, [barChart, timeline, categoryChart, hasData])

    const compItems = [
        {
            label: 'Receitas', key: 'income',
            icon: TrendingUp, color: 'text-accent-text', bg: 'bg-primary/10',
        },
        {
            label: 'Despesas', key: 'expense',
            icon: TrendingDown, color: 'text-red-400', bg: 'bg-red-500/10',
        },
        {
            label: 'Saldo', key: 'balance',
            icon: Wallet, color: v => v.current >= 0 ? 'text-accent-text' : 'text-red-400',
            bg: v => v.current >= 0 ? 'bg-primary/10' : 'bg-red-500/10',
        },
    ]

    return (
        <AppLayout>
            <Head title="Análises" />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="mb-6 sm:mb-8" data-tour="an-header">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <BarChart3 className="w-7 h-7 text-accent-text" />
                        Analytics
                    </h1>
                    <p className="text-gray-500 mt-1">Análise detalhada das suas finanças.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8" data-tour="an-totals">
                    <div className="bg-primary/5 rounded-2xl p-5 border border-border relative overflow-hidden">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Receitas</p>
                        <p className="text-2xl font-extrabold text-accent-text tabular-nums">{formatBR(incomeTotal)}</p>
                    </div>
                    <div className="bg-red-500/5 rounded-2xl p-5 border border-border relative overflow-hidden">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Despesas</p>
                        <p className="text-2xl font-extrabold text-red-400 tabular-nums">{formatBR(expenseTotal)}</p>
                    </div>
                    <div className={`rounded-2xl p-5 border border-border relative overflow-hidden ${balanceTotal >= 0 ? 'bg-primary/5' : 'bg-red-500/5'}`}>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Saldo</p>
                        <p className={`text-2xl font-extrabold tabular-nums ${balanceTotal >= 0 ? 'text-accent-text' : 'text-red-400'}`}>
                            {formatBR(balanceTotal)}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8" data-tour="an-metrics">
                    <div className="bg-primary/5 rounded-2xl p-5 border border-border relative overflow-hidden">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Taxa de economia</span>
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary/10 ring-1 ring-border-strong">
                                <Percent className="w-[18px] h-[18px] text-accent-text" />
                            </div>
                        </div>
                        <p className={`text-2xl font-extrabold tabular-nums ${economyRate == null ? 'text-gray-400' : economyRate >= 0 ? 'text-accent-text' : 'text-red-400'}`}>
                            {economyRate == null ? '—' : `${economyRate}%`}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Quanto sobra das receitas no período</p>
                    </div>
                    <div className="bg-amber-500/5 rounded-2xl p-5 border border-border relative overflow-hidden">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ticket médio de despesas</span>
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-amber-500/10 ring-1 ring-border-strong">
                                <Receipt className="w-[18px] h-[18px] text-amber-500" />
                            </div>
                        </div>
                        <p className="text-2xl font-extrabold text-amber-500 tabular-nums">{formatBR(ticketMedio)}</p>
                        <p className="text-xs text-gray-500 mt-1">Média por lançamento de despesa</p>
                    </div>
                </div>

                <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <LineChart className="w-5 h-5 text-accent-text" />
                    Comparativo: mês atual vs anterior
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8" data-tour="an-compare">
                    {compItems.map(item => {
                        const data = comparative[item.key]
                        const isPositive = data.change >= 0
                        const isBalance = item.key === 'balance'
                        const isGood = isBalance ? isPositive : (item.key === 'income' ? isPositive : !isPositive)

                        return (
                            <Card key={item.key} hover>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{item.label}</span>
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${typeof item.bg === 'function' ? item.bg(data) : item.bg} ring-1 ring-border-strong`}>
                                        <item.icon className={`w-[18px] h-[18px] ${typeof item.color === 'function' ? item.color(data) : item.color}`} />
                                    </div>
                                </div>
                                <p className={`text-xl font-extrabold ${typeof item.color === 'function' ? item.color(data) : item.color}`}>
                                    {formatBR(data.current)}
                                </p>
                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                                    <span className="text-xs text-gray-500">Mês anterior: {formatBR(data.previous)}</span>
                                    <span className={`text-xs font-semibold flex items-center gap-0.5 ${isGood ? 'text-accent-text' : 'text-red-400'}`}>
                                        {isGood ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                        {data.change > 0 ? '+' : ''}{data.change}%
                                    </span>
                                </div>
                            </Card>
                        )
                    })}
                </div>

                <div className="flex items-center gap-2 mb-6 flex-wrap" data-tour="an-period">
                    <Filter className="w-4 h-4 text-gray-500" />
                    {periodOptions.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => handlePeriodChange(opt.value)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                                period === opt.value
                                    ? 'bg-primary text-primary-fg shadow-sm'
                                    : 'bg-surface border border-border text-gray-600 hover:border-border-strong hover:bg-gray-100'
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                {!hasData ? (
                    <Card data-tour="an-empty">
                        <div className="text-center py-10">
                            <Wallet2 className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-600 font-medium">Sem transações no período</p>
                            <p className="text-sm text-gray-500 mt-1">Registre entradas e saídas para ver os gráficos de análise.</p>
                        </div>
                    </Card>
                ) : (
                    <>
                        <Card className="mb-8" data-tour="an-bars">
                            <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-accent-text" />
                                Receitas vs Despesas por mês
                            </h2>
                            <div className="w-full" style={{ height: 300 }}>
                                <canvas ref={barRef} />
                            </div>
                        </Card>

                        <Card className="mb-8" data-tour="an-balance">
                            <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Wallet className="w-5 h-5 text-accent-text" />
                                Saldo por mês
                            </h2>
                            <div className="w-full" style={{ height: 260 }}>
                                <canvas ref={balanceRef} />
                            </div>
                        </Card>

                        <Card className="mb-8" data-tour="an-timeline">
                            <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <LineChart className="w-5 h-5 text-accent-text" />
                                Evolução do saldo
                            </h2>
                            <div className="w-full" style={{ height: 280 }}>
                                <canvas ref={lineRef} />
                            </div>
                        </Card>

                        {categoryChart.length > 0 && (
                            <Card data-tour="an-categories">
                                <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <TrendingDown className="w-5 h-5 text-red-400" />
                                    Despesas por categoria
                                    <span className="text-xs text-gray-500 font-normal">(top 5)</span>
                                </h2>
                                <div className="w-full" style={{ height: Math.max(180, categoryChart.length * 48) }}>
                                    <canvas ref={categoryRef} />
                                </div>
                            </Card>
                        )}
                    </>
                )}
            </main>
        </AppLayout>
    )
}
