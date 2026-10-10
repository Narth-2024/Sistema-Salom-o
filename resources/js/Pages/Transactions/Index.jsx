import { Head, Link, router, usePage } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout.jsx'
import { Card, Badge, Button, Pagination, ConfirmDialog, Skeleton } from '@/Components'
import {
    Plus, Eye, Edit2, Trash2, TrendingUp, TrendingDown,
    Search, X, Download, RefreshCcw
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

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
    const [deleteTarget, setDeleteTarget] = useState(null)
    const [loading, setLoading] = useState(false)
    const searchTimer = useRef(null)

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
            onStart: () => setLoading(true),
            onFinish: () => setLoading(false),
        })
    }

    useEffect(() => {
        clearTimeout(searchTimer.current)
        searchTimer.current = setTimeout(() => applyFilters({ search }), 400)
        return () => clearTimeout(searchTimer.current)
    }, [search])

    function clearFilters() {
        setSearch('')
        setTypeFilter('')
        setCategoryFilter('')
        setTagFilter('')
        setDateFrom('')
        setDateTo('')
        router.get('/transactions', {}, {
            preserveState: true,
            onStart: () => setLoading(true),
            onFinish: () => setLoading(false),
        })
    }

    function handleDelete(t) {
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8" data-tour="tx-header">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Transações</h1>
                        <p className="text-gray-500 mt-1">Registre e acompanhe suas movimentações financeiras.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/transactions/create" data-tour="tx-create">
                            <Button variant="primary">
                                <Plus className="w-4 h-4" />
                                Nova transação
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats bar */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6" data-tour="tx-stats">
                    <div className="bg-primary/5 rounded-2xl p-4 border border-border relative overflow-hidden">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Receitas</p>
                        <p className="text-lg sm:text-2xl font-extrabold text-accent-text tabular-nums">{formatBR(totalIncome)}</p>
                    </div>
                    <div className="bg-red-500/5 rounded-2xl p-4 border border-border relative overflow-hidden">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Despesas</p>
                        <p className="text-lg sm:text-2xl font-extrabold text-red-400 tabular-nums">{formatBR(totalExpense)}</p>
                    </div>
                    <div className={`rounded-2xl p-4 border border-border relative overflow-hidden ${totalBalance >= 0 ? 'bg-primary/5' : 'bg-red-500/5'}`}>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Saldo</p>
                        <p className={`text-lg sm:text-2xl font-extrabold tabular-nums ${totalBalance >= 0 ? 'text-accent-text' : 'text-red-400'}`}>
                            {formatBR(Math.abs(totalBalance))}
                        </p>
                    </div>
                </div>

                {/* Search and filter bar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6" data-tour="tx-filters">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Buscar por descrição..."
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-surface-elevated text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition"
                        />
                        {search && (
                            <button
                                onClick={() => { setSearch(''); applyFilters({ search: '' }) }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <div className="relative">
                        <select
                            value={typeFilter}
                            onChange={e => { setTypeFilter(e.target.value); applyFilters({ type: e.target.value }) }}
                            className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface-elevated text-sm text-gray-600 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition"
                        >
                            <option value="">Todos os tipos</option>
                            <option value="income">Receitas</option>
                            <option value="expense">Despesas</option>
                        </select>
                        <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                    <div className="relative">
                        <select
                            value={categoryFilter}
                            onChange={e => { setCategoryFilter(e.target.value); applyFilters({ category_id: e.target.value }) }}
                            className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface-elevated text-sm text-gray-600 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition"
                        >
                            <option value="">Todas as categorias</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                    <div className="relative">
                        <select
                            value={tagFilter}
                            onChange={e => { setTagFilter(e.target.value); applyFilters({ tag_id: e.target.value }) }}
                            className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface-elevated text-sm text-gray-600 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition"
                        >
                            <option value="">Todas as tags</option>
                            {tags.map(tag => (
                                <option key={tag.id} value={tag.id}>{tag.name}</option>
                            ))}
                        </select>
                        <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={e => { setDateFrom(e.target.value); applyFilters({ date_from: e.target.value }) }}
                        className="px-4 py-2.5 rounded-xl border border-border bg-surface-elevated text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition"
                    />
                    <input
                        type="date"
                        value={dateTo}
                        onChange={e => { setDateTo(e.target.value); applyFilters({ date_to: e.target.value }) }}
                        className="px-4 py-2.5 rounded-xl border border-border bg-surface-elevated text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition"
                    />
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-surface-elevated text-sm text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                            Limpar
                        </button>
                    )}
                </div>

                {/* Transactions table */}
                <Card padding={false} data-tour="tx-table">
                    <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                        <h2 className="text-base font-semibold text-gray-800">Histórico</h2>
                        <Badge variant="default">{meta?.total || data.length} registro(s)</Badge>
                    </div>

                    {loading ? (
                        <Skeleton rows={5} className="p-4" />
                    ) : data.length === 0 ? (
                        <div className="px-6 py-16 text-center">
                            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-4 ring-1 ring-border-strong">
                                <TrendingDown className="w-8 h-8 text-gray-500" />
                            </div>
                            <p className="text-gray-500 font-medium">
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
                                    <tr className="border-b border-border">
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
                                                {t.is_recurring && (
                                                    <span className="inline-flex items-center gap-1 ml-2 text-[10px] font-medium text-accent-text bg-primary/10 px-2 py-0.5 rounded-full">
                                                        <RefreshCcw className="w-3 h-3" />
                                                        Recorrente
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <span className={`text-sm font-semibold tabular-nums ${t.type === 'income' ? 'text-accent-text' : 'text-red-400'}`}>
                                                    {t.type === 'income' ? '+' : '-'} {formatBR(t.amount)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-0.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 transition">
                                                    <Link href={`/transactions/${t.id}`} className="text-gray-500 hover:text-gray-700 transition p-1.5 rounded-lg hover:bg-gray-100">
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    <Link href={`/transactions/${t.id}/edit`} className="text-gray-500 hover:text-accent-text transition p-1.5 rounded-lg hover:bg-gray-100">
                                                        <Edit2 className="w-4 h-4" />
                                                    </Link>
                                                    <button onClick={() => setDeleteTarget(t)} className="text-gray-500 hover:text-red-400 transition p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer">
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

                <ConfirmDialog
                    open={!!deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
                    title="Excluir transação"
                    message="Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita."
                    itemLabel={deleteTarget ? `${deleteTarget.description || 'Sem descrição'} — ${formatBR(parseFloat(deleteTarget.amount))}` : ''}
                />

            </main>
        </AppLayout>
    )
}
