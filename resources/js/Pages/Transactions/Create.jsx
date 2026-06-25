import { Head, Link, useForm } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout.jsx'
import { Card, Button, Input, Select } from '@/Components'
import { ArrowLeft, Plus, AlertCircle } from 'lucide-react'
import { AlertTriangle } from 'lucide-react'

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

            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="mb-6 sm:mb-8">
                    <Link href="/transactions" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium mb-4 transition">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar para transações
                    </Link>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Nova Transação</h1>
                    <p className="text-gray-500 mt-1">Registre uma nova entrada ou saída financeira.</p>
                </div>

                {Object.keys(errors).length > 0 && (
                    <div className="bg-danger-light border border-danger/20 rounded-xl p-4 mb-6 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-danger mb-1">Verifique os campos abaixo</p>
                            <ul className="list-disc list-inside text-sm text-danger space-y-0.5">
                                {Object.values(errors).map((error, i) => <li key={i}>{error}</li>)}
                            </ul>
                        </div>
                    </div>
                )}

                <Card>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                            <Select
                                label="Tipo"
                                value={data.type}
                                onChange={e => { setData('type', e.target.value); setData('category_id', '') }}
                                required
                            >
                                <option value="expense">Despesa</option>
                                <option value="income">Receita</option>
                            </Select>

                            <Select
                                label="Categoria"
                                value={data.category_id}
                                onChange={e => setData('category_id', e.target.value)}
                                required
                            >
                                <option value="">Selecione...</option>
                                {filteredCategories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </Select>

                            <Input
                                label="Valor (R$)"
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={data.amount}
                                onChange={e => setData('amount', e.target.value)}
                                required
                                placeholder="0,00"
                            />

                            <Input
                                label="Data"
                                type="date"
                                value={data.transaction_date}
                                onChange={e => setData('transaction_date', e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <Input
                                label="Descrição (opcional)"
                                type="text"
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                placeholder="Ex: Compras do mês, Pagamento de aluguel..."
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t border-gray-100">
                            <Button type="submit" variant="primary" disabled={processing} className="flex-1 sm:flex-none">
                                <Plus className="w-4 h-4" />
                                Registrar transação
                            </Button>
                            <Link href="/transactions" className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm text-gray-600 hover:text-gray-800 font-medium rounded-xl hover:bg-gray-50 transition">
                                <ArrowLeft className="w-4 h-4" />
                                Cancelar
                            </Link>
                        </div>
                    </form>
                </Card>
            </main>
        </AppLayout>
    )
}
