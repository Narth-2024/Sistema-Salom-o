import { useEffect, useRef } from 'react'
import { Head, Link, usePage } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout.jsx'

function formatBR(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function parseDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('pt-BR')
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
                        backgroundColor: ['#567c4b', '#82aa77', '#d4edcc', '#3a5433', '#6e9562'],
                        borderWidth: 0,
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { padding: 16, usePointStyle: true, font: { family: 'Inter' } }
                        }
                    }
                }
            })
        }

        initChart()

        return () => {
            if (chartInstance.current) chartInstance.current.destroy()
        }
    }, [expensesByCategory])

    return (
        <AppLayout>
            <Head title="Dashboard" />

            <main className="max-w-7xl mx-auto px-6 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900">
                        Olá, {auth.user.name}
                    </h1>
                    <p className="text-neutral-500 mt-1">Aqui está o resumo das suas finanças.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white border border-[#d4e8cf] rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Receitas</p>
                            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-extrabold text-green-600">{formatBR(income)}</p>
                    </div>

                    <div className="bg-white border border-red-100 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Despesas</p>
                            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-extrabold text-red-500">{formatBR(expense)}</p>
                    </div>

                    <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Saldo</p>
                            <div className={`w-10 h-10 ${balance >= 0 ? 'bg-green-100' : 'bg-red-100'} rounded-xl flex items-center justify-center`}>
                                <svg className={`w-5 h-5 ${balance >= 0 ? 'text-green-600' : 'text-red-500'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                        </div>
                        <p className={`text-3xl font-extrabold ${balance >= 0 ? 'text-green-700' : 'text-red-600'}`}>{formatBR(balance)}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10">
                    <div className="lg:col-span-2 bg-white border border-[#d4e8cf] rounded-2xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Despesas por categoria</h2>
                        <canvas ref={chartRef}></canvas>
                        {expensesByCategory.length === 0 && (
                            <p className="text-neutral-400 text-sm text-center mt-4">Sem despesas registradas.</p>
                        )}
                    </div>

                    <div className="lg:col-span-3 bg-white border border-[#d4e8cf] rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-neutral-900">Últimas transações</h2>
                            <Link href="/transactions" className="text-sm text-[#567c4b] hover:underline font-medium">
                                Ver todas →
                            </Link>
                        </div>

                        {recentTransactions.length === 0 ? (
                            <p className="text-neutral-400 text-sm text-center py-8">Nenhuma transação registrada.</p>
                        ) : (
                            <div className="space-y-3">
                                {recentTransactions.map(t => (
                                    <div key={t.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${t.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                                                {t.type === 'income' ? (
                                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-neutral-800">{t.category?.name || 'Sem categoria'}</p>
                                                <p className="text-xs text-neutral-400">{t.description || '—'}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-sm font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                                                {t.type === 'income' ? '+' : '-'}{formatBR(t.amount)}
                                            </p>
                                            <p className="text-xs text-neutral-400">{parseDate(t.transaction_date)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-[#edf6ea] border border-[#d4e8cf] rounded-2xl p-8 text-center">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">Registrar nova transação</h3>
                    <p className="text-neutral-500 text-sm mb-4">Adicione uma entrada ou saída rapidamente.</p>
                    <Link href="/transactions" className="bg-[#567c4b] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#4a6d40] hover:shadow-lg transition inline-block">
                        Adicionar transação
                    </Link>
                </div>
            </main>
        </AppLayout>
    )
}
