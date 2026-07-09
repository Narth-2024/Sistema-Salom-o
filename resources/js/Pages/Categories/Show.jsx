import { Head, Link, router } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout.jsx'
import { Card, Badge, Button, Pagination } from '@/Components'
import { Edit2, Trash2, ArrowLeft, TrendingUp, TrendingDown, Eye, CalendarDays, Clock } from 'lucide-react'

function formatBR(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function parseDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('pt-BR')
}

function formatDateTime(dateStr) {
    const d = new Date(dateStr)
    return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export default function CategoriesShow({ category, transactions }) {
    const data = transactions.data || transactions
    const meta = transactions.meta || null
    function handleDelete() {
        if (!confirm('Tem certeza que deseja excluir esta categoria?')) return
        router.delete(`/categories/${category.id}`)
    }

    function handleDeleteTransaction(t) {
        if (!confirm('Tem certeza que deseja excluir esta transação?')) return
        router.delete(`/transactions/${t.id}`)
    }

    const totalSpent = data.reduce((s, t) => s + parseFloat(t.amount), 0)

    return (
        <AppLayout>
            <Head title={category.name} />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Category header card */}
                <Card className="mb-6 relative overflow-hidden" accent={category.type === 'income' ? true : 'danger'}>
                    <div className={`absolute top-0 left-0 w-1.5 h-full ${category.type === 'income' ? 'bg-green-600' : 'bg-red-400'}`} />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pl-2">
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ring-1 ring-white/5 ${category.type === 'income' ? 'bg-green-600/10' : 'bg-red-500/10'}`}>
                                {category.type === 'income' ? (
                                    <TrendingUp className="w-7 h-7 text-green-600" />
                                ) : (
                                    <TrendingDown className="w-7 h-7 text-red-400" />
                                )}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">{category.name}</h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant={category.type === 'income' ? 'income' : 'expense'}>
                                        {category.type === 'income' ? 'Receita' : 'Despesa'}
                                    </Badge>
                                    <span className="text-xs text-gray-500">•</span>
                                    <span className="text-xs text-gray-500">{meta?.total || data.length} transações</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link href={`/categories/${category.id}/edit`}>
                                <Button variant="secondary" size="sm">
                                    <Edit2 className="w-4 h-4" />
                                    Editar
                                </Button>
                            </Link>
                            <Button variant="danger" size="sm" onClick={handleDelete}>
                                <Trash2 className="w-4 h-4" />
                                Excluir
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Stats mini-card */}
                {data.length > 0 && (
                    <div className="bg-gradient-to-br from-green-600/5 to-green-600/[0.02] rounded-2xl p-5 border border-gray-200/60 mb-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-green-600/30 to-transparent" />
                        <div className="flex items-center gap-4">
                            <div className={`text-2xl font-extrabold ${category.type === 'income' ? 'text-green-600' : 'text-red-400'}`}>
                                {formatBR(totalSpent)}
                            </div>
                            <span className="text-sm text-gray-500">
                                {category.type === 'income' ? 'total recebido' : 'total gasto'} nesta categoria
                            </span>
                        </div>
                    </div>
                )}

                {/* Transactions list */}
                {data.length > 0 ? (
                    <>
                        <Card padding={false} accent>
                            <div className="px-6 py-4 border-b border-gray-200/60">
                                <h2 className="text-base font-semibold text-gray-800">Transações</h2>
                            </div>
                            <div className="divide-y divide-gray-200/40">
                                {data.map(t => (
                                    <div key={t.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-gray-100/40 transition group">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ring-1 ring-white/5 ${t.type === 'income' ? 'bg-green-600/10' : 'bg-red-500/10'}`}>
                                                {t.type === 'income' ? (
                                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <TrendingDown className="w-4 h-4 text-red-400" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-700">{t.description || 'Sem descrição'}</p>
                                                <p className="text-xs text-gray-500">{parseDate(t.transaction_date)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-sm font-semibold tabular-nums ${t.type === 'income' ? 'text-green-600' : 'text-red-400'}`}>
                                                {t.type === 'income' ? '+' : '-'}{formatBR(t.amount)}
                                            </span>
                                            <button onClick={() => handleDeleteTransaction(t)}
                                                className="text-gray-500 hover:text-red-400 transition p-1 opacity-0 group-hover:opacity-100 cursor-pointer">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Pagination meta={meta} />
                    </>
                ) : (
                    <Card className="text-center py-12">
                        <div className="w-12 h-12 mx-auto bg-gray-100 rounded-xl flex items-center justify-center mb-3 ring-1 ring-white/5">
                            <CalendarDays className="w-6 h-6 text-gray-500" />
                        </div>
                        <p className="text-gray-400 font-medium">Nenhuma transação nesta categoria</p>
                        <p className="text-gray-500 text-sm mt-1">As transações aparecerão aqui conforme você for registrando.</p>
                    </Card>
                )}

                {/* Created/updated info */}
                <div className="mt-4 text-xs text-gray-500 text-center flex items-center justify-center gap-4">
                    <span className="inline-flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" />
                        Criada {formatDateTime(category.created_at)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Atualizada {formatDateTime(category.updated_at)}
                    </span>
                </div>

                <div className="mt-6 flex justify-center">
                    <Link href="/categories" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 font-medium transition">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar para Categorias
                    </Link>
                </div>
            </main>
        </AppLayout>
    )
}
