import { Head, Link, useForm, router } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout.jsx'

export default function CategoriesIndex({ categories }) {
    const { data, setData, post, processing, reset } = useForm({
        name: '',
        type: 'expense',
    })

    function handleSubmit(e) {
        e.preventDefault()
        post('/categories', { onSuccess: () => reset() })
    }

    function handleDelete(category) {
        if (!confirm('Tem certeza que deseja excluir esta categoria?')) return
        router.delete(`/categories/${category.id}`)
    }

    return (
        <AppLayout>
            <Head title="Categorias" />

            <main className="max-w-4xl mx-auto px-6 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900">Categorias</h1>
                    <p className="text-neutral-500 mt-1">Gerencie suas categorias de receitas e despesas.</p>
                </div>

                <div className="bg-white border border-[#d4e8cf] rounded-2xl p-6 shadow-sm mb-8">
                    <h2 className="text-lg font-semibold text-neutral-900 mb-4">Nova Categoria</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <label className="text-sm text-neutral-600 mb-1 block">Nome</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                required
                                className="w-full px-4 py-2 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#567c4b] transition"
                                placeholder="Ex: Alimentação, Transporte, Salário..."
                            />
                        </div>
                        <div className="w-full md:w-48">
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
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full md:w-auto bg-[#567c4b] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#4a6d40] transition whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Adicionar
                        </button>
                    </form>
                </div>

                <div className="bg-white border border-[#d4e8cf] rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-neutral-900">Suas Categorias</h2>
                    </div>

                    {categories.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <svg className="w-16 h-16 mx-auto text-neutral-300 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024-.195 1.414-.586l7-7a2 2 0 012.828 2.828l-7 7a1.998 1.998 0 01-1.414.586H3a2 2 0 01-2-2V5c0-.512.195-1.024.586-1.414l7-7A2 2 0 0112 3z" />
                            </svg>
                            <p className="text-neutral-500">Nenhuma categoria cadastrada.</p>
                            <p className="text-neutral-400 text-sm mt-1">Adicione sua primeira categoria acima.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {categories.map(category => (
                                <div key={category.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${category.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                                            {category.type === 'income' ? (
                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                                                </svg>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-neutral-800">{category.name}</p>
                                            <p className="text-xs text-neutral-400">{category.type === 'income' ? 'Receita' : 'Despesa'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/categories/${category.id}/edit`}
                                            className="text-neutral-400 hover:text-[#567c4b] transition p-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(category)}
                                            className="text-neutral-400 hover:text-red-500 transition p-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
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
