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

export default function CategoriesShow({ category, transactions }) {
    function handleDelete() {
        if (!confirm('Tem certeza que deseja excluir esta categoria?')) return
        router.delete(`/categories/${category.id}`)
    }

    function handleDeleteTransaction(t) {
        if (!confirm('Tem certeza que deseja excluir esta transação?')) return
        router.delete(`/transactions/${t.id}`)
    }

    return (
        <AppLayout>
            <Head title={category.name} />

            <main className="max-w-4xl mx-auto px-6 py-10">
                <div className="bg-white border border-[#d4e8cf] rounded-2xl p-6 shadow-sm mb-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-neutral-900">{category.name}</h1>
                            <p className="text-sm text-neutral-500 mt-1">
                                {category.type === 'income' ? 'Receita' : 'Despesa'}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                href={`/categories/${category.id}/edit`}
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
                                href="/categories"
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                            >
                                Voltar
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-2 text-sm text-neutral-600">
                        <p><strong>Tipo:</strong> {category.type === 'income' ? 'Receita' : 'Despesa'}</p>
                        <p><strong>Criada em:</strong> {formatDateTime(category.created_at)}</p>
                        <p><strong>Atualizada em:</strong> {formatDateTime(category.updated_at)}</p>
                    </div>
                </div>

                {transactions.length > 0 ? (
                    <div className="bg-white border border-[#d4e8cf] rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-neutral-900">Transações nesta categoria</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Data</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Descrição</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Valor</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Tipo</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {transactions.map(t => (
                                        <tr key={t.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">{parseDate(t.transaction_date)}</td>
                                            <td className="px-6 py-4 text-sm text-neutral-700">{t.description || '-'}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                                {formatBR(t.amount)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">{t.type === 'income' ? 'Receita' : 'Despesa'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                                                <Link href={`/transactions/${t.id}`} className="text-blue-600 hover:text-blue-800 underline">Ver</Link>
                                                <Link href={`/transactions/${t.id}/edit`} className="text-yellow-600 hover:text-yellow-800 underline">Editar</Link>
                                                <button onClick={() => handleDeleteTransaction(t)} className="text-red-600 hover:text-red-800 underline">Excluir</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <p className="text-neutral-400 text-sm text-center py-8">Nenhuma transação encontrada nesta categoria.</p>
                )}

                <div className="mt-6 flex justify-center">
                    <Link href="/categories" className="text-[#567c4b] hover:underline font-medium">
                        &larr; Voltar para Categorias
                    </Link>
                </div>
            </main>
        </AppLayout>
    )
}
