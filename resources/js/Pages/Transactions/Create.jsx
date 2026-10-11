import { Head, Link, useForm } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout.jsx'
import { Card, Button, Input, MoneyInput, Select, TagPicker } from '@/Components'
import useSubmitLock from '@/hooks/useSubmitLock'
import { toNumberString, toNumber } from '@/lib/decimal'
import { ArrowLeft, Plus, AlertTriangle, RefreshCcw, Layers } from 'lucide-react'

const INSTALLMENT_OPTIONS = [1, 2, 3, 4, 5, 6, 10, 12, 18, 24, 36, 48]

export default function TransactionsCreate({ categories, tags }) {
    const { data, setData, post, processing, errors } = useForm({
        type: 'expense',
        category_id: '',
        amount: '',
        transaction_date: new Date().toISOString().slice(0, 10),
        description: '',
        is_recurring: false,
        installments: 1,
        tag_ids: [],
    })
    const submitLock = useSubmitLock()

    const isInstallment = data.installments > 1
    const perInstallment = isInstallment && toNumber(data.amount) > 0
        ? toNumber(data.amount) / data.installments
        : 0

    function handleSubmit(e) {
        e.preventDefault()
        if (!submitLock.tryLock()) return
        const payload = { ...data, amount: toNumberString(data.amount) }
        if (isInstallment) {
            post('/installments', {
                data: {
                    category_id: data.category_id,
                    type: data.type,
                    total_amount: payload.amount,
                    installments: data.installments,
                    first_date: data.transaction_date,
                    description: data.description || null,
                },
                onFinish: submitLock.unlock,
            })
        } else {
            post('/transactions', { data: payload, onFinish: submitLock.unlock })
        }
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
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Nova Transação</h1>
                    <p className="text-gray-500 mt-1">Registre uma nova entrada ou saída financeira.</p>
                </div>

                {Object.keys(errors).length > 0 && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-red-400 mb-1">Verifique os campos abaixo</p>
                            <ul className="list-disc list-inside text-sm text-red-400 space-y-0.5">
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

                            <MoneyInput
                                value={data.amount}
                                onChange={e => setData('amount', e.target.value)}
                                required
                                min={0.01}
                                max={99999999.99}
                                error={errors.amount}
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

                        <div className="mb-6">
                            <TagPicker
                                tags={tags}
                                selectedIds={data.tag_ids}
                                onChange={ids => setData('tag_ids', ids)}
                            />
                        </div>

                        <div className="mb-6">
                            <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1.5">
                                <Layers className="w-4 h-4 text-accent-text" />
                                Parcelamento
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {INSTALLMENT_OPTIONS.map(n => (
                                    <button
                                        key={n}
                                        type="button"
                                        onClick={() => setData('installments', n)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                            data.installments === n
                                                ? 'bg-primary text-primary-fg shadow-sm'
                                                : 'bg-surface border border-border text-gray-600 hover:border-border-strong hover:bg-gray-100'
                                        }`}
                                    >
                                        {n}x
                                    </button>
                                ))}
                            </div>
                            {isInstallment && (
                                <p className="text-xs text-gray-500 mt-2">
                                    {toNumber(data.amount) > 0
                                        ? <span>Serão criadas <strong className="text-gray-700">{data.installments} parcelas</strong> de <strong className="text-gray-700">{perInstallment.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>, uma por mês a partir da data escolhida.</span>
                                        : <span>Preencha o valor para ver o valor de cada parcela.</span>}
                                </p>
                            )}
                        </div>

                        {!isInstallment && (
                            <label className="flex items-center gap-3 p-4 rounded-xl border border-border bg-surface-elevated mb-6 cursor-pointer hover:border-border-strong transition" data-tour="tx-recurring">
                                <input
                                    type="checkbox"
                                    checked={data.is_recurring}
                                    onChange={e => setData('is_recurring', e.target.checked)}
                                    className="w-4 h-4 rounded accent-[var(--color-primary)] cursor-pointer"
                                />
                                <div className="flex items-center gap-2">
                                    <RefreshCcw className="w-4 h-4 text-accent-text" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">Transação recorrente</p>
                                        <p className="text-xs text-gray-500">Será replicada automaticamente todo mês</p>
                                    </div>
                                </div>
                            </label>
                        )}

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t border-border">
                            <Button type="submit" variant="primary" disabled={processing || submitLock.locked} className="flex-1 sm:flex-none">
                                <Plus className="w-4 h-4" />
                                Registrar transação
                            </Button>
                            <Link href="/transactions" className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm text-gray-500 hover:text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition">
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
