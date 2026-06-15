import { Head, Link, useForm, router } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout.jsx'

function formatBR(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function parseDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('pt-BR')
}

export default function TransactionsIndex({ transactions, categories }) {
    const { data, setData, post, processing, reset } = useForm({
        type: 'expense',
        category_id: '',
        amount: '',
        transaction_date: new Date().toISOString().slice(0, 10),
        description: '',
    })

    function handleSubmit(e) {
        e.preventDefault()
        post('/transactions', { onSuccess: () => reset() })
    }

    function handleDelete(t) {
        if (!confirm('Tem certeza que deseja excluir esta transação?')) return
        router.delete(`/transactions/${t.id}`)
    }

    return (
        <AppLayout>
            <Head title="Transações" />

            <main className="max-w-5xl mx-auto px-6 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900">Transações</h1>
                    <p className="text-neutral-500 mt-1">Registre suas entradas e saídas financeiras.</p>
                </div>

                <div className="bg-white border border-[#d4e8cf] rounded-2xl p-6 shadow-sm mb-8">
                    <h2 className="text-lg font-semibold text-neutral-900 mb-4">Nova Transação</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="md:col-span-1">
                            <label className="text-sm text-neutral-600 mb-1 block">Tipo</label>
                            <select
                                value={data.type}
                                onChange={e => setData('type', e.target.value)}
                                required
                                className="w-full px-4 py-2 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#567c4b] transition"
                            >
                                <option value="expense">Despesa</option>
                                <option value="income">Receita</option>
                            </select>
                        </div>

                        <div className="md:col-span-1">
                            <label className="text-sm text-neutral-600 mb-1 block">Categoria</label>
                            <select
                                value={data.category_id}
                                onChange={e => setData('category_id', e.target.value)}
                                required
                                className="w-full px-4 py-2 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#567c4b] transition"
                            >
                                <option value="">Selecione...</option>
                                {categories.filter(c => c.type === data.type).map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-1">
                            <label className="text-sm text-neutral-600 mb-1 block">Valor (R$)</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={data.amount}
                                onChange={e => setData('amount', e.target.value)}
                                required
                                className="w-full px-4 py-2 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#567c4b] transition"
                                placeholder="0,00"
                            />
                        </div>

                        <div className="md:col-span-1">
                            <label className="text-sm text-neutral-600 mb-1 block">Data</label>
                            <input
                                type="date"
                                value={data.transaction_date}
                                onChange={e => setData('transaction_date', e.target.value)}
                                required
                                className="w-full px-4 py-2 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#567c4b] transition"
                            />
                        </div>

                        <div className="md:col-span-1 flex items-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-[#567c4b] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#4a6d40] transition whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Adicionar
                            </button>
                        </div>

                        <div className="md:col-span-5">
                            <label className="text-sm text-neutral-600 mb-1 block">Descrição (opcional)</label>
                            <input
                                type="text"
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#567c4b] transition"
                                placeholder="Ex: Compras do mês, Pagamento de aluguel..."
                            />
                        </div>
                    </form>
                </div>

                <div className="bg-white border border-[#d4e8cf] rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-neutral-900">Histórico</h2>
                        <span className="text-sm text-neutral-500">{transactions.length} registro(s)</span>
                    </div>

                    {transactions.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <svg className="w-16 h-16 mx-auto text-neutral-300 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className="text-neutral-500">Nenhuma transação registrada.</p>
                            <p className="text-neutral-400 text-sm mt-1">Adicione sua primeira transação acima.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Data</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Descrição</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Categoria</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Tipo</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Valor</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {transactions.map(t => (
                                        <tr key={t.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">{parseDate(t.transaction_date)}</td>
                                            <td className="px-6 py-4 text-sm text-neutral-800">{t.description || '—'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${t.category ? 'bg-[#567c4b]/10 text-[#567c4b]' : 'bg-neutral-100 text-neutral-500'}`}>
                                                    {t.category?.name || 'Sem categoria'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1 text-xs font-medium ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                                                    {t.type === 'income' ? (
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                                                        </svg>
                                                    )}
                                                    {t.type === 'income' ? 'Receita' : 'Despesa'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <span className={`text-sm font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                                                    {t.type === 'income' ? '+' : '-'} {formatBR(t.amount)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link href={`/transactions/${t.id}`} className="text-neutral-400 hover:text-blue-500 transition p-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </Link>
                                                    <Link href={`/transactions/${t.id}/edit`} className="text-neutral-400 hover:text-[#567c4b] transition p-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </Link>
                                                    <button onClick={() => handleDelete(t)} className="text-neutral-400 hover:text-red-500 transition p-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-center">
                    <Link href="/dashboard" className="text-[#567c4b] hover:underline font-medium">
                        &larr; Voltar ao Dashboard
                    </Link>
                </div>
            </main>
        </AppLayout>
    )
}
