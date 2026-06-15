import { Head, Link, useForm } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout.jsx'

export default function CategoriesCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        type: 'income',
    })

    function handleSubmit(e) {
        e.preventDefault()
        post('/categories')
    }

    return (
        <AppLayout>
            <Head title="Nova Categoria" />

            <main className="max-w-4xl mx-auto px-6 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900">Nova Categoria</h1>
                    <p className="text-neutral-500 mt-1">Cadastre uma nova categoria de receita ou despesa.</p>
                </div>

                <div className="bg-white border border-[#d4e8cf] rounded-2xl p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="text-sm text-neutral-600 mb-1 block">Nome</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                required
                                className="w-full px-4 py-2 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#567c4b] transition"
                                placeholder="Ex: Alimentação, Transporte, Salário..."
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="text-sm text-neutral-600 mb-1 block">Tipo</label>
                            <select
                                value={data.type}
                                onChange={e => setData('type', e.target.value)}
                                required
                                className="w-full px-4 py-2 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#567c4b] transition"
                            >
                                <option value="income">Receita</option>
                                <option value="expense">Despesa</option>
                            </select>
                            {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                        </div>

                        <div className="flex items-center gap-4 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-[#567c4b] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#4a6d40] transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Criar Categoria
                            </button>
                            <Link href="/categories" className="text-[#567c4b] hover:underline font-medium">
                                &larr; Voltar
                            </Link>
                        </div>
                    </form>
                </div>
            </main>
        </AppLayout>
    )
}
