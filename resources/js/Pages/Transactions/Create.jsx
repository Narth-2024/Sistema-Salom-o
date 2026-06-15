import { Head, Link, useForm } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout.jsx'

export default function TransactionsCreate({ categories }) {
    const { data, setData, post, processing, errors } = useForm({
        type: 'expense',
        category_id: '',
        amount: '',
        transaction_date: new Date().toISOString().slice(0, 10),
        description: '',
    })

    function handleSubmit(e) {
        e.preventDefault()
        post('/transactions')
    }

    const filteredCategories = categories.filter(c => c.type === data.type)

    return (
        <AppLayout>
            <Head title="Nova Transação" />

            <main className="max-w-3xl mx-auto px-6 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900">Nova Transação</h1>
                    <p className="text-neutral-500 mt-1">Registre uma nova entrada ou saída financeira.</p>
                </div>

                {Object.keys(errors).length > 0 && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        <ul className="list-disc list-inside text-sm">
                            {Object.values(errors).map((error, i) => <li key={i}>{error}</li>)}
                        </ul>
                    </div>
                )}

                <div className="bg-white border border-[#d4e8cf] rounded-2xl p-6 shadow-sm">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="text-sm text-neutral-600 mb-1 block">Tipo</label>
                            <select
                                value={data.type}
                                onChange={e => { setData('type', e.target.value); setData('category_id', '') }}
                                required
                                className="w-full px-4 py-2 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#567c4b] transition"
                            >
                                <option value="expense">Despesa</option>
                                <option value="income">Receita</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="text-sm text-neutral-600 mb-1 block">Categoria</label>
                            <select
                                value={data.category_id}
                                onChange={e => setData('category_id', e.target.value)}
                                required
                                className="w-full px-4 py-2 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#567c4b] transition"
                            >
                                <option value="">Selecione...</option>
                                {filteredCategories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
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

                        <div className="mb-4">
                            <label className="text-sm text-neutral-600 mb-1 block">Data</label>
                            <input
                                type="date"
                                value={data.transaction_date}
                                onChange={e => setData('transaction_date', e.target.value)}
                                required
                                className="w-full px-4 py-2 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#567c4b] transition"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="text-sm text-neutral-600 mb-1 block">Descrição (opcional)</label>
                            <input
                                type="text"
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#567c4b] transition"
                                placeholder="Ex: Compras do mês, Pagamento de aluguel..."
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-[#567c4b] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#4a6d40] transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Registrar
                            </button>
                            <Link href="/transactions" className="text-[#567c4b] hover:underline font-medium">
                                &larr; Voltar
                            </Link>
                        </div>
                    </form>
                </div>
            </main>
        </AppLayout>
    )
}
