import { useEffect, useRef } from 'react'
import { Head } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout.jsx'
import { Card } from '@/Components'
import { chartColors, hexToRgba } from '@/lib/chartColors.js'
import { TrendingUp, TrendingDown, Wallet, BarChart3, LineChart, ArrowUpRight, ArrowDownRight } from 'lucide-react'

function formatBR(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function Analytics({ barChart, timeline, comparative, incomeTotal, expenseTotal, balanceTotal }) {
    const barRef = useRef(null)
    const lineRef = useRef(null)
    const barInstance = useRef(null)
    const lineInstance = useRef(null)

    useEffect(() => {
        async function initCharts() {
            const { Chart,
                BarController, BarElement, CategoryScale, LinearScale,
                LineController, LineElement, PointElement,
                Legend, Tooltip, Filler
            } = await import('chart.js')

            Chart.register(
                BarController, BarElement, CategoryScale, LinearScale,
                LineController, LineElement, PointElement,
                Legend, Tooltip, Filler
            )

            const c = chartColors()

            if (barRef.current) {
                if (barInstance.current) barInstance.current.destroy()
                barInstance.current = new Chart(barRef.current, {
                    type: 'bar',
                    data: {
                        labels: barChart.map(d => d.label),
                        datasets: [
                            {
                                label: 'Receitas',
                                data: barChart.map(d => d.income),
                                backgroundColor: c.income,
                                borderRadius: 6,
                                borderSkipped: false,
                            },
                            {
                                label: 'Despesas',
                                data: barChart.map(d => d.expense),
                                backgroundColor: c.expense,
                                borderRadius: 6,
                                borderSkipped: false,
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        interaction: { intersect: false, mode: 'index' },
                        plugins: {
                            legend: {
                                position: 'top',
                                labels: { usePointStyle: true, pointStyleWidth: 8, color: c.text, font: { family: 'Inter', size: 11 } }
                            }
                        },
                        scales: {
                            x: { grid: { display: false }, ticks: { color: c.muted } },
                            y: {
                                grid: { color: c.grid },
                                ticks: { color: c.muted, callback: v => 'R$' + v.toLocaleString('pt-BR') }
                            }
                        }
                    }
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
                                const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300)
                                gradient.addColorStop(0, hexToRgba(c.balance, 0.2))
                                gradient.addColorStop(1, hexToRgba(c.balance, 0))
                                return gradient
                            },
                            fill: true,
                            tension: 0.4,
                            pointRadius: 4,
                            pointBackgroundColor: c.balance,
                            pointBorderColor: c.background,
                            pointBorderWidth: 2,
                            borderWidth: 2,
                        }]
                    },
                    options: {
                        responsive: true,
                        interaction: { intersect: false, mode: 'index' },
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                callbacks: {
                                    label: ctx => 'Saldo: ' + formatBR(ctx.parsed.y)
                                }
                            }
                        },
                        scales: {
                            x: { grid: { display: false }, ticks: { color: c.muted } },
                            y: {
                                grid: { color: c.grid },
                                ticks: { color: c.muted, callback: v => 'R$' + v.toLocaleString('pt-BR') }
                            }
                        }
                    }
                })
            }
        }

        initCharts()
        return () => {
            if (barInstance.current) barInstance.current.destroy()
            if (lineInstance.current) lineInstance.current.destroy()
        }
    }, [barChart, timeline])

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
                    <div className="bg-primary/5 rounded-2xl p-5 border border-gray-200/60 relative overflow-hidden">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Receitas</p>
                        <p className="text-2xl font-extrabold text-accent-text tabular-nums">{formatBR(incomeTotal)}</p>
                    </div>
                    <div className="bg-red-500/5 rounded-2xl p-5 border border-gray-200/60 relative overflow-hidden">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Despesas</p>
                        <p className="text-2xl font-extrabold text-red-400 tabular-nums">{formatBR(expenseTotal)}</p>
                    </div>
                    <div className={`rounded-2xl p-5 border border-gray-200/60 relative overflow-hidden ${balanceTotal >= 0 ? 'bg-primary/5' : 'bg-red-500/5'}`}>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Saldo</p>
                        <p className={`text-2xl font-extrabold tabular-nums ${balanceTotal >= 0 ? 'text-accent-text' : 'text-red-400'}`}>
                            {formatBR(balanceTotal)}
                        </p>
                    </div>
                </div>

                <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <LineChart className="w-5 h-5 text-accent-text" />
                    Comparativo: mês atual vs anterior
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8" data-tour="an-compare">
                    {compItems.map((item, idx) => {
                        const data = comparative[item.key]
                        const isPositive = data.change >= 0
                        const isBalance = item.key === 'balance'
                        const isGood = isBalance ? isPositive : (item.key === 'income' ? isPositive : !isPositive)

                        return (
                            <Card key={item.key} hover>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{item.label}</span>
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${typeof item.bg === 'function' ? item.bg(data) : item.bg} ring-1 ring-gray-200/60`}>
                                        <item.icon className={`w-[18px] h-[18px] ${typeof item.color === 'function' ? item.color(data) : item.color}`} />
                                    </div>
                                </div>
                                <p className={`text-xl font-extrabold ${typeof item.color === 'function' ? item.color(data) : item.color}`}>
                                    {formatBR(data.current)}
                                </p>
                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200/60">
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

                <Card className="mb-8" data-tour="an-bars">
                    <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-accent-text" />
                        Receitas vs Despesas por mês
                    </h2>
                    <div className="w-full" style={{ height: 300 }}>
                        <canvas ref={barRef} />
                    </div>
                </Card>

                <Card data-tour="an-timeline">
                    <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <LineChart className="w-5 h-5 text-accent-text" />
                        Evolução do saldo
                    </h2>
                    <div className="w-full" style={{ height: 300 }}>
                        <canvas ref={lineRef} />
                    </div>
                </Card>
            </main>
        </AppLayout>
    )
}
