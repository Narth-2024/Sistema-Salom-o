import { Head, Link, router } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout.jsx'

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

            <main className="max-w-3xl mx-auto px-6 py-10">
                <div className="bg-white border border-[#d4e8cf] rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <h1 className="text-2xl font-bold text-neutral-900">Transação #{transaction.id}</h1>
                        <div className="flex items-center gap-2">
                            <Link
                                href={`/transactions/${transaction.id}/edit`}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                            >
                                Editar
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                            >
                                Excluir
                            </button>
                            <Link
                                href="/transactions"
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                            >
                                Voltar
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-3 text-sm text-neutral-600">
                        <p><strong>Descrição:</strong> {transaction.description || 'Não informado'}</p>
                        <p>
                            <strong>Valor:</strong>{' '}
                            <span className={transaction.type === 'income' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                {formatBR(transaction.amount)}
                            </span>
                        </p>
                        <p><strong>Tipo:</strong> {transaction.type === 'income' ? 'Receita' : 'Despesa'}</p>
                        <p><strong>Data:</strong> {parseDate(transaction.transaction_date)}</p>
                        <p>
                            <strong>Categoria:</strong>{' '}
                            {transaction.category ? (
                                <span className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded">{transaction.category.name}</span>
                            ) : (
                                <span className="text-gray-500">Sem categoria</span>
                            )}
                        </p>
                        <p><strong>Criada em:</strong> {formatDateTime(transaction.created_at)}</p>
                        <p><strong>Atualizada em:</strong> {formatDateTime(transaction.updated_at)}</p>
                    </div>
                </div>

                <div className="mt-6 flex justify-center">
                    <Link href="/transactions" className="text-[#567c4b] hover:underline font-medium">
                        &larr; Voltar para Transações
                    </Link>
                </div>
            </main>
        </AppLayout>
    )
}
