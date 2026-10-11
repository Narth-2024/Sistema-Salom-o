import { Head, Link } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout.jsx'
import { Card, Badge, Pagination } from '@/Components'
import { Layers, CalendarDays, ArrowRight, Inbox } from 'lucide-react'

function formatBR(value) {
    return Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function parseDate(dateStr) {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR')
}

export default function InstallmentGroupsIndex({ groups }) {
    const items = groups.data || groups
    const meta = groups.meta || null
    const today = new Date().toISOString().slice(0, 10)

    return (
        <AppLayout>
            <Head title="Parcelamentos" />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <Layers className="w-6 h-6 text-accent-text" />
                        Parcelamentos
                    </h1>
                    <p className="text-gray-500 mt-1">Compras divididas em parcelas mensais.</p>
                </div>

                {items.length === 0 ? (
                    <Card className="text-center py-16">
                        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-4 ring-1 ring-border-strong">
                            <Inbox className="w-8 h-8 text-gray-500" />
                        </div>
                        <p className="text-gray-500 font-medium">Nenhum parcelamento</p>
                        <p className="text-gray-500 text-sm mt-1">Crie uma transação com mais de 1x em Parcelamento.</p>
                        <Link href="/transactions/create" className="text-accent-text text-sm font-medium hover:underline mt-2 inline-block">
                            Nova transação
                        </Link>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {items.map(g => {
                            const paid = (g.transactions || []).filter(t => t.transaction_date <= today).length
                            return (
                                <Link key={g.id} href={`/installments/${g.id}`} className="group">
                                    <Card hover className="h-full">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-accent-text flex items-center justify-center ring-1 ring-border-strong">
                                                <Layers className="w-5 h-5" />
                                            </div>
                                            <Badge variant={g.type === 'income' ? 'income' : 'expense'}>
                                                {g.type === 'income' ? 'Receita' : 'Despesa'}
                                            </Badge>
                                        </div>
                                        <h3 className="text-base font-semibold text-gray-800 group-hover:text-accent-text-hover transition flex items-center gap-2">
                                            {g.description || 'Compra parcelada'}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                            <CalendarDays className="w-3 h-3" />
                                            {parseDate(g.first_date)} · {g.installments} parcelas
                                        </p>
                                        <div className="flex items-baseline justify-between mt-3 pt-3 border-t border-border">
                                            <p className={`text-lg font-extrabold tabular-nums ${g.type === 'income' ? 'text-accent-text' : 'text-red-400'}`}>
                                                {formatBR(g.total_amount)}
                                            </p>
                                            <span className="text-xs text-gray-500">
                                                {g.transactions_count ?? g.transactions?.length ?? g.installments} parcelas
                                            </span>
                                        </div>
                                    </Card>
                                </Link>
                            )
                        })}
                    </div>
                )}

                <Pagination meta={meta} standalone />
            </main>
        </AppLayout>
    )
}
