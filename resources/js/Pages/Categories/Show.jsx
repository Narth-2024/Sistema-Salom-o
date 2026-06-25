import { Head, Link, router } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout.jsx'
import { Card, Badge, Button } from '@/Components'
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
    function handleDelete() {
        if (!confirm('Tem certeza que deseja excluir esta categoria?')) return
        router.delete(`/categories/${category.id}`)
    }

    function handleDeleteTransaction(t) {
        if (!confirm('Tem certeza que deseja excluir esta transação?')) return
        router.delete(`/transactions/${t.id}`)
    }

    const totalSpent = transactions.reduce((s, t) => s + parseFloat(t.amount), 0)

    return (
        <AppLayout>
            <Head title={category.name} />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Category header card */}
                <Card className="mb-6 relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1.5 h-full ${category.type === 'income' ? 'bg-success' : 'bg-danger'}`} />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pl-2">
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${category.type === 'income' ? 'bg-success-light' : 'bg-danger-light'}`}>
                                {category.type === 'income' ? (
                                    <TrendingUp className="w-7 h-7 text-success" />
                                ) : (
                                    <TrendingDown className="w-7 h-7 text-danger" />
                                )}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant={category.type === 'income' ? 'income' : 'expense'}>
                                        {category.type === 'income' ? 'Receita' : 'Despesa'}
                                    </Badge>
                                    <span className="text-xs text-gray-400">•</span>
                                    <span className="text-xs text-gray-400">{transactions.length} transações</span>
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
                {transactions.length > 0 && (
                    <Card className="mb-6 bg-green-50/50 border-green-100">
                        <div className="flex items-center gap-4">
                            <div className={`text-2xl font-extrabold ${category.type === 'income' ? 'text-success' : 'text-danger'}`}>
                                {formatBR(totalSpent)}
                            </div>
                            <span className="text-sm text-gray-500">
                                {category.type === 'income' ? 'total recebido' : 'total gasto'} nesta categoria
                            </span>
                        </div>
                    </Card>
                )}

                {/* Transactions list */}
                {transactions.length > 0 ? (
                    <Card padding={false}>
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="text-base font-semibold text-gray-900">Transações</h2>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {transactions.map(t => (
                                <div key={t.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-gray-50/80 transition group">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${t.type === 'income' ? 'bg-success-light' : 'bg-danger-light'}`}>
                                            {t.type === 'income' ? (
                                                <TrendingUp className="w-4 h-4 text-success" />
                                            ) : (
                                                <TrendingDown className="w-4 h-4 text-danger" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-800">{t.description || 'Sem descrição'}</p>
                                            <p className="text-xs text-gray-400">{parseDate(t.transaction_date)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-sm font-semibold tabular-nums ${t.type === 'income' ? 'text-success' : 'text-danger'}`}>
                                            {t.type === 'income' ? '+' : '-'}{formatBR(t.amount)}
                                        </span>
                                        <button onClick={() => handleDeleteTransaction(t)}
                                            className="text-gray-300 hover:text-danger transition p-1 opacity-0 group-hover:opacity-100 cursor-pointer">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                ) : (
                    <Card className="text-center py-12">
                        <div className="w-12 h-12 mx-auto bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                            <CalendarDays className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">Nenhuma transação nesta categoria</p>
                        <p className="text-gray-400 text-sm mt-1">As transações aparecerão aqui conforme você for registrando.</p>
                    </Card>
                )}

                {/* Created/updated info */}
                <div className="mt-4 text-xs text-gray-400 text-center flex items-center justify-center gap-4">
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
                    <Link href="/categories" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium transition">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar para Categorias
                    </Link>
                </div>
            </main>
        </AppLayout>
    )
}
