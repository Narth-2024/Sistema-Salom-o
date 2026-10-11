import { Head, Link, useForm, router } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout.jsx'
import { Card, Button, MoneyInput, Select, Progress, ConfirmDialog } from '@/Components'
import { useState } from 'react'
import { Target, Plus, Trash2, TrendingDown, AlertTriangle, CheckCircle2 } from 'lucide-react'

function formatBR(value) {
    return Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function statusInfo(status) {
    if (status === 'over') return { label: 'Estourado', color: 'text-red-400', bg: 'bg-red-500/10', bar: 'bg-red-500', icon: AlertTriangle }
    if (status === 'warning') return { label: 'Atenção', color: 'text-amber-500', bg: 'bg-amber-500/10', bar: 'bg-amber-500', icon: AlertTriangle }
    return { label: 'OK', color: 'text-accent-text', bg: 'bg-primary/10', bar: 'bg-primary', icon: CheckCircle2 }
}

export default function BudgetsIndex({ budgets, totalLimit, totalSpent, totalPercentage, available }) {
    const [deleteTarget, setDeleteTarget] = useState(null)

    const addForm = useForm({ category_id: '', budget_amount: '' })
    function handleAdd(e) {
        e.preventDefault()
        if (!addForm.data.category_id) return
        addForm.transform(d => ({
            category_id: d.category_id,
            budget_amount: d.budget_amount || '0',
        })).put(`/budgets/${addForm.data.category_id}`, {
            preserveScroll: true,
            onSuccess: () => addForm.reset(),
        })
    }

    const editForms = {}
    function editBudget(categoryId) {
        if (!editForms[categoryId]) {
            const b = budgets.find(x => x.category.id === categoryId)
            editForms[categoryId] = useForm({ budget_amount: String(b?.limit ?? '') })
        }
        return editForms[categoryId]
    }

    function handleRemove(categoryId) {
        router.delete(`/budgets/${categoryId}`, { preserveScroll: true })
    }

    const totalStatus = totalPercentage >= 100 ? 'over' : totalPercentage >= 80 ? 'warning' : 'ok'
    const totalInfo = statusInfo(totalStatus)

    return (
        <AppLayout>
            <Head title="Orçamentos" />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <Target className="w-6 h-6 text-accent-text" />
                        Orçamentos
                    </h1>
                    <p className="text-gray-500 mt-1">Defina um limite mensal por categoria e acompanhe seus gastos.</p>
                </div>

                {/* Total do mês */}
                {totalLimit > 0 && (
                    <Card className="mb-6" accent={totalStatus === 'over' ? 'danger' : totalStatus === 'warning' ? 'warning' : true}>
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Orçamento do mês</p>
                                <p className={`text-2xl font-extrabold tabular-nums mt-1 ${totalInfo.color}`}>
                                    {formatBR(totalSpent)}
                                    <span className="text-gray-400 font-semibold text-lg"> / {formatBR(totalLimit)}</span>
                                </p>
                            </div>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${totalInfo.bg} ${totalInfo.color} ring-1 ring-border-strong`}>
                                <totalInfo.icon className="w-3 h-3" />
                                {totalInfo.label} · {totalPercentage}%
                            </span>
                        </div>
                        <Progress value={totalSpent} max={totalLimit} barClassName={totalInfo.bar} />
                    </Card>
                )}

                {/* Adicionar orçamento */}
                {available.length > 0 && (
                    <div className="mb-8 bg-primary/5 rounded-2xl p-6 border border-border">
                        <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-accent-text" />
                            Novo orçamento
                        </h2>
                        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 items-end flex-wrap">
                            <Select
                                value={addForm.data.category_id}
                                onChange={e => addForm.setData('category_id', e.target.value)}
                                required
                                className="sm:w-56"
                                aria-label="Categoria"
                            >
                                <option value="">Escolha a categoria</option>
                                {available.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </Select>
                            <MoneyInput
                                value={addForm.data.budget_amount}
                                onChange={e => addForm.setData('budget_amount', e.target.value)}
                                error={addForm.errors.budget_amount}
                                label="Limite mensal (R$)"
                                className="sm:w-44"
                            />
                            <Button type="submit" variant="primary" disabled={addForm.processing || !addForm.data.category_id}>
                                <Plus className="w-4 h-4" />
                                Adicionar
                            </Button>
                        </form>
                    </div>
                )}

                {/* Lista */}
                {budgets.length === 0 ? (
                    <Card className="text-center py-16">
                        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-4 ring-1 ring-border-strong">
                            <Target className="w-8 h-8 text-gray-500" />
                        </div>
                        <p className="text-gray-500 font-medium">Nenhum orçamento definido</p>
                        <p className="text-gray-500 text-sm mt-1">Adicione um limite para uma categoria de despesa acima.</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {budgets.map(b => {
                            const info = statusInfo(b.status)
                            const form = editBudget(b.category.id)
                            return (
                                <Card key={b.category.id} className="relative group">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <span
                                                className="w-3 h-3 rounded-full shrink-0 ring-1 ring-border-strong"
                                                style={{ backgroundColor: b.category.color || '#f87171' }}
                                            />
                                            <h3 className="text-base font-semibold text-gray-800 truncate">{b.category.name}</h3>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0 ml-2">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${info.bg} ${info.color} ring-1 ring-border-strong`}>
                                                <info.icon className="w-3 h-3" />
                                                {info.label}
                                            </span>
                                            <button
                                                onClick={() => setDeleteTarget(b)}
                                                title="Remover orçamento"
                                                className="text-gray-400 hover:text-red-400 transition p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-baseline justify-between mb-2">
                                        <p className={`text-xl font-extrabold tabular-nums ${info.color}`}>
                                            {formatBR(b.spent)}
                                            <span className="text-gray-400 font-semibold text-base"> / {formatBR(b.limit)}</span>
                                        </p>
                                        <span className="text-xs font-semibold text-gray-500 tabular-nums">{b.percentage}%</span>
                                    </div>

                                    <Progress value={b.spent} max={b.limit} barClassName={info.bar} />

                                    <p className={`text-xs mt-2 ${b.remaining < 0 ? 'text-red-400 font-medium' : 'text-gray-500'}`}>
                                        {b.remaining >= 0
                                            ? `Restam ${formatBR(b.remaining)}`
                                            : `Excedeu em ${formatBR(Math.abs(b.remaining))}`}
                                    </p>

                                    {/* Editar limite inline */}
                                    <form
                                        onSubmit={e => {
                                            e.preventDefault()
                                            form.transform(d => ({ budget_amount: d.budget_amount }))
                                                .put(`/budgets/${b.category.id}`, { preserveScroll: true })
                                        }}
                                        className="flex items-end gap-2 mt-4 pt-4 border-t border-border"
                                    >
                                        <MoneyInput
                                            value={form.data.budget_amount}
                                            onChange={e => form.setData('budget_amount', e.target.value)}
                                            error={form.errors.budget_amount}
                                            label="Novo limite (R$)"
                                            className="flex-1"
                                        />
                                        <Button type="submit" variant="secondary" size="sm" disabled={form.processing}>
                                            Salvar
                                        </Button>
                                    </form>
                                </Card>
                            )
                        })}
                    </div>
                )}

                <ConfirmDialog
                    open={!!deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    onConfirm={() => deleteTarget && handleRemove(deleteTarget.category.id)}
                    title="Remover orçamento"
                    message="O limite desta categoria será removido. As transações não são afetadas."
                    itemLabel={deleteTarget?.category?.name}
                />
            </main>
        </AppLayout>
    )
}
