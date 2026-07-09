import { Head, Link, router } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout.jsx'
import { Card, Badge, Button, Pagination } from '@/Components'
import {
    Plus, Eye, Edit2, Trash2, TrendingUp, TrendingDown,
    ArrowLeft, Search, X, Download
} from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'

function formatBR(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function parseDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('pt-BR')
}

export default function TransactionsIndex({ transactions, categories, tags, filters }) {
    const [search, setSearch] = useState(filters?.search || '')
    const [typeFilter, setTypeFilter] = useState(filters?.type || '')
    const [categoryFilter, setCategoryFilter] = useState(filters?.category_id || '')
    const [tagFilter, setTagFilter] = useState(filters?.tag_id || '')
    const [dateFrom, setDateFrom] = useState(filters?.date_from || '')
    const [dateTo, setDateTo] = useState(filters?.date_to || '')

    function applyFilters(overrides = {}) {
        const params = {}
        if (overrides.search ?? search) params.search = overrides.search ?? search
        if (overrides.type ?? typeFilter) params.type = overrides.type ?? typeFilter
        if (overrides.category_id ?? categoryFilter) params.category_id = overrides.category_id ?? categoryFilter
        if (overrides.tag_id ?? tagFilter) params.tag_id = overrides.tag_id ?? tagFilter
        if (overrides.date_from ?? dateFrom) params.date_from = overrides.date_from ?? dateFrom
        if (overrides.date_to ?? dateTo) params.date_to = overrides.date_to ?? dateTo

        router.get('/transactions', params, {
            preserveState: true,
            preserveScroll: true,
        })
    }

    const debouncedSearch = useCallback(
        (function () {
            let timer
            return (value) => {
                clearTimeout(timer)
                timer = setTimeout(() => applyFilters({ search: value }), 400)
            }
        })(),
        [search, typeFilter, categoryFilter, dateFrom, dateTo]
    )

    useEffect(() => {
        debouncedSearch(search)
    }, [search])

    function clearFilters() {
        setSearch('')
        setTypeFilter('')
        setCategoryFilter('')
        setTagFilter('')
        setDateFrom('')
        setDateTo('')
        router.get('/transactions', {}, { preserveState: true })
    }

    function handleDelete(t) {
        if (!confirm('Tem certeza que deseja excluir esta transação?')) return
        router.delete(`/transactions/${t.id}`, {
            preserveState: true,
            preserveScroll: true,
        })
    }

    const data = transactions.data || transactions
    const meta = transactions.meta || null
    const totalIncome = data.filter(t => t.type === 'income').reduce((s, t) => s + parseFloat(t.amount), 0)
    const totalExpense = data.filter(t => t.type === 'expense').reduce((s, t) => s + parseFloat(t.amount), 0)
    const totalBalance = totalIncome - totalExpense

    const hasActiveFilters = search || typeFilter || categoryFilter || tagFilter || dateFrom || dateTo

    return (
        <AppLayout>
            <Head title="Transações" />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Transações</h1>
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
                    <div className="bg-gradient-to-br from-green-600/5 to-green-600/[0.02] rounded-2xl p-4 border border-gray-200/60 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-green-600/30 to-transparent" />
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Receitas</p>
                        <p className="text-base sm:text-lg font-extrabold text-green-600 tabular-nums">{formatBR(totalIncome)}</p>
                    </div>
                    <div className="bg-gradient-to-br from-red-500/5 to-red-500/[0.02] rounded-2xl p-4 border border-gray-200/60 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-400/30 to-transparent" />
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Despesas</p>
                        <p className="text-base sm:text-lg font-extrabold text-red-400 tabular-nums">{formatBR(totalExpense)}</p>
                    </div>
                    <div className={`rounded-2xl p-4 border border-gray-200/60 relative overflow-hidden ${totalBalance >= 0 ? 'bg-gradient-to-br from-green-600/5 to-green-600/[0.02]' : 'bg-gradient-to-br from-red-500/5 to-red-500/[0.02]'}`}>
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-green-600/30 to-transparent" />
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Saldo</p>
                        <p className={`text-base sm:text-lg font-extrabold tabular-nums ${totalBalance >= 0 ? 'text-green-600' : 'text-red-400'}`}>
                            {formatBR(Math.abs(totalBalance))}
                        </p>
                    </div>
                </div>

                {/* Search and filter bar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Buscar por descrição..."
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200/60 bg-surface-elevated text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600/50 transition"
                        />
                        {search && (
                            <button
                                onClick={() => { setSearch(''); applyFilters({ search: '' }) }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400 cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <select
                        value={typeFilter}
                        onChange={e => { setTypeFilter(e.target.value); applyFilters({ type: e.target.value }) }}
                        className="px-4 py-2.5 rounded-xl border border-gray-200/60 bg-surface-elevated text-sm text-gray-600 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600/50 transition"
                    >
                        <option value="">Todos os tipos</option>
                        <option value="income">Receitas</option>
                        <option value="expense">Despesas</option>
                    </select>
                    <select
                        value={categoryFilter}
                        onChange={e => { setCategoryFilter(e.target.value); applyFilters({ category_id: e.target.value }) }}
                        className="px-4 py-2.5 rounded-xl border border-gray-200/60 bg-surface-elevated text-sm text-gray-600 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600/50 transition"
                    >
                        <option value="">Todas as categorias</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    <select
                        value={tagFilter}
                        onChange={e => { setTagFilter(e.target.value); applyFilters({ tag_id: e.target.value }) }}
                        className="px-4 py-2.5 rounded-xl border border-gray-200/60 bg-surface-elevated text-sm text-gray-600 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600/50 transition"
                    >
                        <option value="">Todas as tags</option>
                        {tags.map(tag => (
                            <option key={tag.id} value={tag.id}>{tag.name}</option>
                        ))}
                    </select>
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={e => { setDateFrom(e.target.value); applyFilters({ date_from: e.target.value }) }}
                        className="px-4 py-2.5 rounded-xl border border-gray-200/60 bg-surface-elevated text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600/50 transition"
                    />
                    <input
                        type="date"
                        value={dateTo}
                        onChange={e => { setDateTo(e.target.value); applyFilters({ date_to: e.target.value }) }}
                        className="px-4 py-2.5 rounded-xl border border-gray-200/60 bg-surface-elevated text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600/50 transition"
                    />
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200/60 bg-surface-elevated text-sm text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                            Limpar
                        </button>
                    )}
                </div>

                {/* Transactions table */}
                <Card padding={false} accent>
                    <div className="px-6 py-4 border-b border-gray-200/60 flex items-center justify-between">
                        <h2 className="text-base font-semibold text-gray-800">Histórico</h2>
                        <Badge variant="default">{meta?.total || data.length} registro(s)</Badge>
                    </div>

                    {data.length === 0 ? (
                        <div className="px-6 py-16 text-center">
                            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-4 ring-1 ring-white/5">
                                <TrendingDown className="w-8 h-8 text-gray-500" />
                            </div>
                            <p className="text-gray-400 font-medium">
                                {hasActiveFilters ? 'Nenhuma transação encontrada' : 'Nenhuma transação registrada'}
                            </p>
                            <p className="text-gray-500 text-sm mt-1 mb-4">
                                {hasActiveFilters
                                    ? 'Tente ajustar os filtros ou limpar a busca.'
                                    : 'Comece registrando sua primeira movimentação.'}
                            </p>
                            {!hasActiveFilters && (
                                <Link href="/transactions/create">
                                    <Button variant="primary" size="sm">
                                        <Plus className="w-4 h-4" />
                                        Nova transação
                                    </Button>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200/60">
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Descrição</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoria</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tags</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
                                        <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Valor</th>
                                        <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200/40">
                                    {data.map(t => (
                                        <tr key={t.id} className="hover:bg-gray-100/40 transition group">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {parseDate(t.transaction_date)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-800 min-w-[140px]">
                                                <span className="font-medium">{t.description || '—'}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge variant="green">{t.category?.name || 'Sem categoria'}</Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {t.tags?.length > 0 ? t.tags.slice(0, 2).map(tag => (
                                                        <span
                                                            key={tag.id}
                                                            className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium text-white"
                                                            style={{ backgroundColor: tag.color }}
                                                        >
                                                            {tag.name}
                                                        </span>
                                                    )) : <span className="text-gray-500 text-xs">—</span>}
                                                    {t.tags?.length > 2 && (
                                                        <span className="text-[10px] text-gray-500">+{t.tags.length - 2}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge variant={t.type === 'income' ? 'income' : 'expense'}>
                                                    {t.type === 'income' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                                    {t.type === 'income' ? 'Receita' : 'Despesa'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <span className={`text-sm font-semibold tabular-nums ${t.type === 'income' ? 'text-green-600' : 'text-red-400'}`}>
                                                    {t.type === 'income' ? '+' : '-'} {formatBR(t.amount)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition">
                                                    <Link href={`/transactions/${t.id}`} className="text-gray-500 hover:text-gray-300 transition p-1.5 rounded-lg hover:bg-gray-100">
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    <Link href={`/transactions/${t.id}/edit`} className="text-gray-500 hover:text-green-600 transition p-1.5 rounded-lg hover:bg-gray-100">
                                                        <Edit2 className="w-4 h-4" />
                                                    </Link>
                                                    <button onClick={() => handleDelete(t)} className="text-gray-500 hover:text-red-400 transition p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer">
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

                    <Pagination meta={meta} />
                </Card>

                <div className="mt-6 flex justify-center">
                    <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 font-medium transition">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar para Início
                    </Link>
                </div>
            </main>
        </AppLayout>
    )
}
