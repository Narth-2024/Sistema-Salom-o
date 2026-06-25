import { useEffect, useRef } from 'react'
import { Head, Link, usePage } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout.jsx'
import { Card, Badge, Button } from '@/Components'
import {
    TrendingUp, TrendingDown, Wallet, Plus, ArrowRight,
    ArrowUpRight, ArrowDownRight, CalendarDays, Sparkles
} from 'lucide-react'

function formatBR(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function parseDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('pt-BR')
}

function getGreeting() {
    const h = new Date().getHours()
    if (h < 12) return 'Bom dia'
    if (h < 18) return 'Boa tarde'
    return 'Boa noite'
}

function getWeekday() {
    const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
    return dias[new Date().getDay()]
}

function formatDate() {
    const hoje = new Date()
    return `${getWeekday()}, ${hoje.toLocaleDateString('pt-BR')}`
}

export default function Dashboard({ income, expense, balance, recentTransactions, expensesByCategory }) {
    const { auth } = usePage().props
    const chartRef = useRef(null)
    const chartInstance = useRef(null)

    useEffect(() => {
        if (!chartRef.current || expensesByCategory.length === 0) return

        async function initChart() {
            const { Chart, DoughnutController, ArcElement, Legend, Tooltip } = await import('chart.js')
            Chart.register(DoughnutController, ArcElement, Legend, Tooltip)

            if (chartInstance.current) chartInstance.current.destroy()

            chartInstance.current = new Chart(chartRef.current, {
                type: 'doughnut',
                data: {
                    labels: expensesByCategory.map(c => c.name),
                    datasets: [{
                        data: expensesByCategory.map(c => c.total),
                        backgroundColor: ['#36802d', '#77ab59', '#93c47d', '#234d20', '#c9df8a', '#2a623d', '#6aa84f'],
                        borderWidth: 0,
                    }]
                },
                options: {
                    responsive: true,
                    cutout: '72%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 16,
                                usePointStyle: true,
                                pointStyleWidth: 8,
                                font: { family: 'Inter', size: 11 }
                            }
                        }
                    }
                }
            })
        }

        initChart()
        return () => { if (chartInstance.current) chartInstance.current.destroy() }
    }, [expensesByCategory])

    const initial = auth.user.name?.charAt(0).toUpperCase() || '?'

    const summaryCards = [
        {
            label: 'Receitas', value: income,
            color: 'text-success', bg: 'bg-success-light',
            icon: TrendingUp, iconBg: 'bg-success/10',
            trend: '+12%', trendColor: 'text-success'
        },
        {
            label: 'Despesas', value: expense,
            color: 'text-danger', bg: 'bg-danger-light',
            icon: TrendingDown, iconBg: 'bg-danger/10',
            trend: '+8%', trendColor: 'text-danger'
        },
        {
            label: 'Saldo', value: balance,
            color: balance >= 0 ? 'text-success' : 'text-danger',
            bg: balance >= 0 ? 'bg-success-light' : 'bg-danger-light',
            icon: Wallet, iconBg: balance >= 0 ? 'bg-success/10' : 'bg-danger/10',
            trend: null, trendColor: ''
        },
    ]

    return (
        <AppLayout>
            <Head title="Início" />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Welcome banner */}
                <div className="relative overflow-hidden bg-gradient-to-br from-green-800 via-green-700 to-green-600 rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
                    <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-green-500/10 rounded-full blur-3xl" />
                    <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/15 rounded-xl flex items-center justify-center text-white text-xl sm:text-2xl font-bold backdrop-blur-sm">
                                {initial}
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                                    {getGreeting()}, {auth.user.name?.split(' ')[0]}
                                    <Sparkles className="w-5 h-5 text-yellow-300" />
                                </h1>
                                <p className="text-white/60 text-sm flex items-center gap-1.5 mt-0.5">
                                    <CalendarDays className="w-3.5 h-3.5" />
                                    {formatDate()}
                                </p>
                            </div>
                        </div>
                        <Link href="/transactions/create">
                            <Button variant="primary" size="sm" className="shadow-lg w-full sm:w-auto">
                                <Plus className="w-4 h-4" />
                                Nova transação
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {summaryCards.map(card => (
                        <Card key={card.label} className="relative overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-1">
                                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{card.label}</span>
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                                    <card.icon className={`w-4.5 h-4.5 ${card.color}`} />
                                </div>
                            </div>
                            <p className={`text-2xl sm:text-3xl font-extrabold ${card.color} mb-1`}>
                                {formatBR(card.value)}
                            </p>
                            {card.trend && (
                                <p className={`text-xs font-medium flex items-center gap-0.5 ${card.trendColor}`}>
                                    {card.label === 'Receitas' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    {card.trend} em relação ao mês passado
                                </p>
                            )}
                            {!card.trend && card.label === 'Saldo' && (
                                <p className="text-xs text-gray-400">Saldo atual consolidado</p>
                            )}
                        </Card>
                    ))}
                </div>

                {/* Chart + Recent transactions */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
                    <Card className="lg:col-span-2">
                        <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            Despesas por categoria
                            {expensesByCategory.length > 0 && (
                                <span className="text-xs text-gray-400 font-normal">({expensesByCategory.length})</span>
                            )}
                        </h2>
                        <div className="flex justify-center">
                            <div className="w-full max-w-[220px]">
                                <canvas ref={chartRef} />
                            </div>
                        </div>
                        {expensesByCategory.length === 0 && (
                            <p className="text-gray-400 text-sm text-center py-6">
                                Nenhuma despesa registrada ainda.
                            </p>
                        )}
                    </Card>

                    <Card className="lg:col-span-3">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-semibold text-gray-900">Últimas transações</h2>
                            <Link href="/transactions" className="text-sm text-green-600 hover:text-green-700 font-medium inline-flex items-center gap-1 transition">
                                Ver todas
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {recentTransactions.length === 0 ? (
                            <div className="text-center py-8">
                                <Wallet className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                                <p className="text-gray-400 text-sm">Nenhuma transação registrada.</p>
                                <Link href="/transactions/create" className="text-green-600 text-sm font-medium hover:underline mt-1 inline-block">
                                    Registrar primeira transação
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {recentTransactions.map(t => (
                                    <div key={t.id} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-gray-50 transition -mx-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${t.type === 'income' ? 'bg-success-light' : 'bg-danger-light'}`}>
                                                {t.type === 'income' ? (
                                                    <TrendingUp className="w-4 h-4 text-success" />
                                                ) : (
                                                    <TrendingDown className="w-4 h-4 text-danger" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-800 truncate">{t.category?.name || 'Sem categoria'}</p>
                                                <p className="text-xs text-gray-400 truncate">{t.description || parseDate(t.transaction_date)}</p>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0 ml-3">
                                            <p className={`text-sm font-semibold ${t.type === 'income' ? 'text-success' : 'text-danger'}`}>
                                                {t.type === 'income' ? '+' : '-'}{formatBR(t.amount)}
                                            </p>
                                            {t.description && (
                                                <p className="text-xs text-gray-400">{parseDate(t.transaction_date)}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Link href="/transactions/create"
                        className="flex items-center gap-3 bg-white border border-green-200 rounded-xl p-4 hover:shadow-md hover:border-green-400 transition group">
                        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition">
                            <Plus className="w-5 h-5 text-green-700" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-semibold text-gray-800">Nova transação</p>
                            <p className="text-xs text-gray-400">Registre entrada ou saída</p>
                        </div>
                    </Link>
                    <Link href="/categories"
                        className="flex items-center gap-3 bg-white border border-green-200 rounded-xl p-4 hover:shadow-md hover:border-green-400 transition group">
                        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition">
                            <TrendingUp className="w-5 h-5 text-green-700" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-semibold text-gray-800">Categorias</p>
                            <p className="text-xs text-gray-400">Gerencie suas categorias</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-green-600 transition" />
                    </Link>
                    <Link href="/transactions"
                        className="flex items-center gap-3 bg-white border border-green-200 rounded-xl p-4 hover:shadow-md hover:border-green-400 transition group">
                        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition">
                            <Wallet className="w-5 h-5 text-green-700" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-semibold text-gray-800">Extrato</p>
                            <p className="text-xs text-gray-400">Veja todas as transações</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-green-600 transition" />
                    </Link>
                </div>
            </main>
        </AppLayout>
    )
}
