import { Head, Link, router, usePage } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout.jsx'
import { Card, Badge, Button, ConfirmDialog } from '@/Components'
import { useState } from 'react'
import { ArrowLeft, Layers, CalendarDays, Tag as TagIcon, Trash2 } from 'lucide-react'

function formatBR(value) {
    return Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function parseDate(dateStr) {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR')
}

export default function InstallmentGroupShow({ group }) {
    const { flash } = usePage().props
    const [confirmDelete, setConfirmDelete] = useState(false)

    const today = new Date().toISOString().slice(0, 10)
    const transactions = group.transactions || []
    const paidCount = transactions.filter(t => t.transaction_date <= today).length

    function handleDelete() {
        router.delete(`/installments/${group.id}`)
    }

    return (
        <AppLayout>
            <Head title={`Parcelas — ${group.description || 'Compra parcelada'}`} />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <Link href="/installments" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium mb-4 transition">
                    <ArrowLeft className="w-4 h-4" />
                    Voltar para parcelamentos
                </Link>

                {/* Cabeçalho do grupo */}
                <Card className="mb-6" accent={group.type === 'income' ? true : 'danger'}>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <Layers className="w-5 h-5 text-accent-text" />
                                {group.description || 'Compra parcelada'}
                            </h1>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                <Badge variant={group.type === 'income' ? 'income' : 'expense'}>
                                    {group.type === 'income' ? 'Receita' : 'Despesa'}
                                </Badge>
                                {group.category && (
                                    <Badge>{group.category.name}</Badge>
                                )}
                                <span className="text-xs text-gray-500">
                                    {group.installments} parcelas · {formatBR(group.installment_amount)} cada
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => setConfirmDelete(true)}
                            title="Excluir parcelamento"
                            className="text-gray-400 hover:text-red-400 transition p-2 rounded-lg hover:bg-gray-100 cursor-pointer shrink-0"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5 pt-4 border-t border-border">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</p>
                            <p className="text-lg font-extrabold text-gray-800 tabular-nums">{formatBR(group.total_amount)}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Primeira parcela</p>
                            <p className="text-lg font-extrabold text-gray-800 tabular-nums">{parseDate(group.first_date)}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Decorridas</p>
                            <p className="text-lg font-extrabold text-gray-800 tabular-nums">{paidCount}/{group.installments}</p>
                        </div>
                    </div>
                </Card>

                {/* Lista de parcelas */}
                <Card padding={false}>
                    <div className="px-6 py-4 border-b border-border">
                        <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 text-accent-text" />
                            Parcelas
                        </h2>
                    </div>
                    <div className="divide-y divide-gray-200/60">
                        {transactions.map(t => {
                            const isPaid = t.transaction_date <= today
                            return (
                                <Link
                                    key={t.id}
                                    href={`/transactions/${t.id}`}
                                    className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-100/40 transition-colors"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ring-1 ring-border-strong ${
                                            isPaid ? 'bg-primary/10 text-accent-text' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                            {t.installment_no}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-700">
                                                Parcela {t.installment_no} de {t.installment_total}
                                            </p>
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <CalendarDays className="w-3 h-3" />
                                                {parseDate(t.transaction_date)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0 ml-3">
                                        <p className={`text-sm font-semibold tabular-nums ${group.type === 'income' ? 'text-accent-text' : 'text-red-400'}`}>
                                            {group.type === 'income' ? '+' : '-'}{formatBR(t.amount)}
                                        </p>
                                        <span className={`text-[10px] font-medium ${isPaid ? 'text-accent-text' : 'text-gray-400'}`}>
                                            {isPaid ? 'Vencida' : 'A vencer'}
                                        </span>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </Card>

                <ConfirmDialog
                    open={confirmDelete}
                    onClose={() => setConfirmDelete(false)}
                    onConfirm={handleDelete}
                    title="Excluir parcelamento"
                    message={`Todas as ${group.installments} parcelas serão excluídas junto com o grupo. Você poderá desfazer.`}
                    itemLabel={group.description || 'Compra parcelada'}
                />
            </main>
        </AppLayout>
    )
}
