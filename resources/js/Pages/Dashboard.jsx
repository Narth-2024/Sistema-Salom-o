import { useEffect, useRef } from 'react'
import { Head, Link, usePage } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout.jsx'
import { Card, Button } from '@/Components'
import {
    TrendingUp, TrendingDown, Wallet, Plus, ArrowRight,
    ArrowUpRight, ArrowDownRight, CalendarDays, Sparkles,
    ArrowLeftRight, Tags as TagsIcon
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

export default function Dashboard({ income, expense, balance, recentTransactions, expensesByCategory, incomeTrend, expenseTrend }) {
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
                        backgroundColor: expensesByCategory.map((c, i) =>
                            c.color || ['#3ecf8e', '#6366f1', '#f59e0b', '#ec4899', '#14b8a6', '#f97316', '#8b5cf6'][i % 7]
                        ),
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
                                color: '#b4b4bd',
                                font: { family: 'Inter, system-ui, sans-serif', size: 11 }
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

    function trendInfo(label, value) {
        if (value === 0) return null
        const isUp = value > 0
        const isIncome = label === 'Receitas'
        const isGood = isIncome ? isUp : !isUp
        return {
            display: `${isUp ? '+' : ''}${value}%`,
            icon: isUp ? ArrowUpRight : ArrowDownRight,
            color: isGood ? 'text-green-600' : 'text-red-400',
            bg: isGood ? 'bg-green-600/10' : 'bg-red-500/10',
        }
    }

    const summaryCards = [
        {
            label: 'Receitas', value: income,
            color: 'text-green-600', bg: 'bg-gradient-to-br from-green-600/5 to-green-600/[0.02]',
            icon: TrendingUp, iconBg: 'bg-green-600/10 text-green-600',
            accent: 'bg-green-600',
            trend: trendInfo('Receitas', incomeTrend),
        },
        {
            label: 'Despesas', value: expense,
            color: 'text-red-400', bg: 'bg-gradient-to-br from-red-500/5 to-red-500/[0.02]',
            icon: TrendingDown, iconBg: 'bg-red-500/10 text-red-400',
            accent: 'bg-red-400',
            trend: trendInfo('Despesas', expenseTrend),
        },
        {
            label: 'Saldo', value: balance,
            color: balance >= 0 ? 'text-green-600' : 'text-red-400',
            bg: balance >= 0 ? 'bg-gradient-to-br from-green-600/5 to-green-600/[0.02]' : 'bg-gradient-to-br from-red-500/5 to-red-500/[0.02]',
            icon: Wallet, iconBg: balance >= 0 ? 'bg-green-600/10 text-green-600' : 'bg-red-500/10 text-red-400',
            accent: balance >= 0 ? 'bg-green-600' : 'bg-red-400',
            trend: null,
        },
    ]

    const quickActions = [
        { href: '/transactions/create', label: 'Nova transação', desc: 'Registre entrada ou saída', icon: Plus, color: 'text-green-600', bg: 'bg-green-600/10', gradient: 'from-green-600/5 to-transparent' },
        { href: '/categories', label: 'Categorias', desc: 'Gerencie categorias', icon: TagsIcon, color: 'text-indigo-400', bg: 'bg-indigo-500/10', gradient: 'from-indigo-500/5 to-transparent' },
        { href: '/transactions', label: 'Transações', desc: 'Veja todas', icon: ArrowLeftRight, color: 'text-amber-400', bg: 'bg-amber-500/10', gradient: 'from-amber-500/5 to-transparent' },
    ]

    return (
        <AppLayout>
            <Head title="Início" />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Welcome banner */}
                <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-950/90 to-emerald-950/80 rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 border border-emerald-800/20 shadow-lg shadow-emerald-950/30">
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-600/5 rounded-full blur-3xl" />
                    <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl" />
                    <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg shadow-green-600/20 ring-1 ring-green-400/20 shrink-0">
                                {auth.user.avatar_url ? (
                                    <img src={auth.user.avatar_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    initial
                                )}
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                                    {getGreeting()}, {auth.user.name?.split(' ')[0]}
                                    <Sparkles className="w-5 h-5 text-amber-400" />
                                </h1>
                                <p className="text-emerald-200/70 text-sm flex items-center gap-1.5 mt-0.5">
                                    <CalendarDays className="w-3.5 h-3.5" />
                                    {formatDate()}
                                </p>
                            </div>
                        </div>
                        <Link href="/transactions/create">
                            <Button variant="primary" size="sm" className="w-full sm:w-auto shadow-lg shadow-green-600/15">
                                <Plus className="w-4 h-4" />
                                Nova transação
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {summaryCards.map((card, idx) => (
                        <div key={card.label} className={`${card.bg} rounded-2xl p-5 border border-gray-200/60 relative overflow-hidden animate-fade-in`} style={{ animationDelay: `${idx * 80}ms` }}>
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-green-600/30 to-transparent" />
                            <div className="flex items-start justify-between mb-3">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{card.label}</span>
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.iconBg} ring-1 ring-white/5`}>
                                    <card.icon className="w-[18px] h-[18px]" />
                                </div>
                            </div>
                            <p className={`text-2xl sm:text-3xl font-extrabold ${card.color} mb-1 tabular-nums`}>
                                {formatBR(card.value)}
                            </p>
                            {card.trend && (
                                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${card.trend.bg} ${card.trend.color} mt-1 ring-1 ring-white/5`}>
                                    <card.trend.icon className="w-3 h-3" />
                                    {card.trend.display} vs mês passado
                                </div>
                            )}
                            {!card.trend && card.label === 'Saldo' && (
                                <p className="text-xs text-gray-500 mt-1">Saldo atual consolidado</p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Chart + Recent transactions */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
                    <Card className="lg:col-span-2" accent>
                        <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Wallet className="w-4 h-4 text-green-600" />
                            Despesas por categoria
                            {expensesByCategory.length > 0 && (
                                <span className="text-xs text-gray-500 font-normal">({expensesByCategory.length})</span>
                            )}
                        </h2>
                        <div className="flex justify-center">
                            <div className="w-full max-w-[220px]">
                                <canvas ref={chartRef} />
                            </div>
                        </div>
                        {expensesByCategory.length === 0 && (
                            <p className="text-gray-500 text-sm text-center py-6">
                                Nenhuma despesa registrada ainda.
                            </p>
                        )}
                    </Card>

                    <Card className="lg:col-span-3" padding={false} accent>
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/60">
                            <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                <ArrowLeftRight className="w-4 h-4 text-green-600" />
                                Últimas transações
                            </h2>
                            <Link href="/transactions" className="text-sm text-green-600 hover:text-green-500 font-medium inline-flex items-center gap-1 transition-colors">
                                Ver todas
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {recentTransactions.length === 0 ? (
                            <div className="text-center py-12">
                                <Wallet className="w-10 h-10 mx-auto text-gray-500 mb-3" />
                                <p className="text-gray-500 text-sm">Nenhuma transação registrada.</p>
                                <Link href="/transactions/create" className="text-green-600 text-sm font-medium hover:underline mt-1 inline-block">
                                    Nova transação
                                </Link>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200/60">
                                {recentTransactions.map(t => (
                                    <div key={t.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-100/40 transition-colors">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${t.type === 'income' ? 'bg-green-600/10 text-green-600' : 'bg-red-500/10 text-red-400'} ring-1 ring-white/5`}>
                                                {t.type === 'income' ? (
                                                    <TrendingUp className="w-4 h-4" />
                                                ) : (
                                                    <TrendingDown className="w-4 h-4" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-700 truncate">{t.category?.name || 'Sem categoria'}</p>
                                                <p className="text-xs text-gray-500 truncate">{t.description || parseDate(t.transaction_date)}</p>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0 ml-3">
                                            <p className={`text-sm font-semibold tabular-nums ${t.type === 'income' ? 'text-green-600' : 'text-red-400'}`}>
                                                {t.type === 'income' ? '+' : '-'}{formatBR(t.amount)}
                                            </p>
                                            {t.description && (
                                                <p className="text-xs text-gray-500">{parseDate(t.transaction_date)}</p>
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
                    {quickActions.map((action, idx) => (
                        <Link key={action.href} href={action.href}
                            className={`group flex items-center gap-3 bg-gradient-to-r ${action.gradient} bg-surface border border-gray-200/60 rounded-2xl p-4 hover:border-gray-300/60 hover:-translate-y-0.5 transition-all duration-200 animate-fade-in relative overflow-hidden`}
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <div className={`w-10 h-10 rounded-xl ${action.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-200 ring-1 ring-white/5`}>
                                <action.icon className={`w-5 h-5 ${action.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-700">{action.label}</p>
                                <p className="text-xs text-gray-500">{action.desc}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-green-600 transition-colors shrink-0" />
                        </Link>
                    ))}
                </div>
            </main>
        </AppLayout>
    )
}
