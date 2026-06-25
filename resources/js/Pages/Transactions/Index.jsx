import { Head, Link, router } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout.jsx'
import { Card, Badge, Button } from '@/Components'
import {
    Plus, Eye, Edit2, Trash2, TrendingUp, TrendingDown,
    ArrowLeft, Search, Filter, ArrowUpDown, Download
} from 'lucide-react'

function formatBR(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function parseDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('pt-BR')
}

export default function TransactionsIndex({ transactions, categories }) {
    function handleDelete(t) {
        if (!confirm('Tem certeza que deseja excluir esta transação?')) return
        router.delete(`/transactions/${t.id}`)
    }

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + parseFloat(t.amount), 0)
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + parseFloat(t.amount), 0)
    const totalBalance = totalIncome - totalExpense

    return (
        <AppLayout>
            <Head title="Transações" />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Transações</h1>
                        <p className="text-gray-500 mt-1">Registre e acompanhe suas movimentações financeiras.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/transactions/create">
                            <Button variant="primary">
                                <Plus className="w-4 h-4" />
                                Nova transação
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats bar */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
                    <div className="bg-success-light rounded-xl p-3 sm:p-4">
                        <p className="text-xs text-success font-medium uppercase tracking-wider mb-0.5">Receitas</p>
                        <p className="text-base sm:text-lg font-extrabold text-success">{formatBR(totalIncome)}</p>
                    </div>
                    <div className="bg-danger-light rounded-xl p-3 sm:p-4">
                        <p className="text-xs text-danger font-medium uppercase tracking-wider mb-0.5">Despesas</p>
                        <p className="text-base sm:text-lg font-extrabold text-danger">{formatBR(totalExpense)}</p>
                    </div>
                    <div className={`rounded-xl p-3 sm:p-4 ${totalBalance >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">Saldo</p>
                        <p className={`text-base sm:text-lg font-extrabold ${totalBalance >= 0 ? 'text-green-800' : 'text-red-700'}`}>
                            {formatBR(Math.abs(totalBalance))}
                        </p>
                    </div>
                </div>

                {/* Search and filter bar (placeholder) */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por descrição..."
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition"
                        />
                    </div>
                    <div className="flex gap-3">
                        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 transition cursor-pointer">
                            <Filter className="w-4 h-4" />
                            Filtros
                        </button>
                        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 transition cursor-pointer">
                            <ArrowUpDown className="w-4 h-4" />
                            Ordenar
                        </button>
                    </div>
                </div>

                {/* Transactions table */}
                <Card padding={false}>
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-base font-semibold text-gray-900">Histórico</h2>
                        <Badge variant="default">{transactions.length} registro(s)</Badge>
                    </div>

                    {transactions.length === 0 ? (
                        <div className="px-6 py-16 text-center">
                            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                                <TrendingDown className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">Nenhuma transação registrada</p>
                            <p className="text-gray-400 text-sm mt-1 mb-4">Comece registrando sua primeira movimentação.</p>
                            <Link href="/transactions/create">
                                <Button variant="primary" size="sm">
                                    <Plus className="w-4 h-4" />
                                    Nova transação
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Descrição</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoria</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
                                        <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Valor</th>
                                        <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {transactions.map(t => (
                                        <tr key={t.id} className="hover:bg-gray-50/80 transition group">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {parseDate(t.transaction_date)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-800 min-w-[140px]">
                                                <span className="font-medium">{t.description || '—'}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge variant="green">{t.category?.name || 'Sem categoria'}</Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge variant={t.type === 'income' ? 'income' : 'expense'}>
                                                    {t.type === 'income' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                                    {t.type === 'income' ? 'Receita' : 'Despesa'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <span className={`text-sm font-semibold tabular-nums ${t.type === 'income' ? 'text-success' : 'text-danger'}`}>
                                                    {t.type === 'income' ? '+' : '-'} {formatBR(t.amount)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition">
                                                    <Link href={`/transactions/${t.id}`} className="text-gray-400 hover:text-info transition p-1.5 rounded-lg hover:bg-info-light/50">
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    <Link href={`/transactions/${t.id}/edit`} className="text-gray-400 hover:text-green-600 transition p-1.5 rounded-lg hover:bg-green-50">
                                                        <Edit2 className="w-4 h-4" />
                                                    </Link>
                                                    <button onClick={() => handleDelete(t)} className="text-gray-400 hover:text-danger transition p-1.5 rounded-lg hover:bg-danger-light/50 cursor-pointer">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>

                <div className="mt-6 flex justify-center">
                    <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium transition">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar ao Dashboard
                    </Link>
                </div>
            </main>
        </AppLayout>
    )
}
