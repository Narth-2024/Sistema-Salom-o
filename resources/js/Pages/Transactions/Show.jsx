import { Head, Link, router } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout.jsx'
import { Card, Badge, Button } from '@/Components'
import { Edit2, Trash2, ArrowLeft, TrendingUp, TrendingDown, CalendarDays, Clock, Tag } from 'lucide-react'

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

export default function TransactionsShow({ transaction }) {
    function handleDelete() {
        if (!confirm('Tem certeza que deseja excluir esta transação?')) return
        router.delete(`/transactions/${transaction.id}`)
    }

    return (
        <AppLayout>
            <Head title={`Transação #${transaction.id}`} />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Back link */}
                <Link href="/transactions" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium mb-6 transition">
                    <ArrowLeft className="w-4 h-4" />
                    Voltar para transações
                </Link>

                {/* Main detail card */}
                <Card className="relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1.5 h-full ${transaction.type === 'income' ? 'bg-success' : 'bg-danger'}`} />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pl-2">
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${transaction.type === 'income' ? 'bg-success-light' : 'bg-danger-light'}`}>
                                {transaction.type === 'income' ? (
                                    <TrendingUp className="w-7 h-7 text-success" />
                                ) : (
                                    <TrendingDown className="w-7 h-7 text-danger" />
                                )}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Transação #{transaction.id}</h1>
                                <Badge variant={transaction.type === 'income' ? 'income' : 'expense'} className="mt-1">
                                    {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                                </Badge>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link href={`/transactions/${transaction.id}/edit`}>
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

                    {/* Amount display */}
                    <div className={`${transaction.type === 'income' ? 'bg-success-light' : 'bg-danger-light'} rounded-xl p-5 mb-6`}>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Valor</p>
                        <p className={`text-3xl sm:text-4xl font-extrabold tabular-nums ${transaction.type === 'income' ? 'text-success' : 'text-danger'}`}>
                            {transaction.type === 'income' ? '+' : '-'} {formatBR(transaction.amount)}
                        </p>
                    </div>

                    {/* Details grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1">
                            <p className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                <Tag className="w-3 h-3" />
                                Descrição
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                                {transaction.description || <span className="text-gray-400 italic">Não informado</span>}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                Categoria
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                                {transaction.category ? (
                                    <Badge variant="green">{transaction.category.name}</Badge>
                                ) : (
                                    <span className="text-gray-400 italic">Sem categoria</span>
                                )}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                <CalendarDays className="w-3 h-3" />
                                Data
                            </p>
                            <p className="text-sm font-medium text-gray-900">{parseDate(transaction.transaction_date)}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Criada em
                            </p>
                            <p className="text-sm font-medium text-gray-900">{formatDateTime(transaction.created_at)}</p>
                        </div>
                    </div>
                </Card>
            </main>
        </AppLayout>
    )
}
