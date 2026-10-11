import { Head, Link, useForm } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout.jsx'
import { Card, Button, Input, Select, ErrorSummary } from '@/Components'
import { ArrowLeft, Plus } from 'lucide-react'

export default function CategoriesCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        type: 'expense',
    })

    function handleSubmit(e) {
        e.preventDefault()
        post('/categories')
    }

    return (
        <AppLayout>
            <Head title="Nova Categoria" />

            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="mb-6 sm:mb-8">
                    <Link href="/categories" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium mb-4 transition">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar para Categorias
                    </Link>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Nova Categoria</h1>
                    <p className="text-gray-500 mt-1">Cadastre uma nova categoria de receita ou despesa.</p>
                </div>

                <ErrorSummary errors={errors} />

                <Card>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Nome"
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            required
                            placeholder="Ex: Alimentação, Transporte, Salário..."
                            error={errors.name}
                        />

                        <Select
                            label="Tipo"
                            value={data.type}
                            onChange={e => setData('type', e.target.value)}
                            required
                        >
                            <option value="expense">Despesa</option>
                            <option value="income">Receita</option>
                        </Select>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t border-border">
                            <Button type="submit" variant="primary" disabled={processing} className="flex-1 sm:flex-none">
                                <Plus className="w-4 h-4" />
                                Nova Categoria
                            </Button>
                            <Link href="/categories" className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm text-gray-600 hover:text-gray-800 font-medium rounded-xl hover:bg-gray-50 transition">
                                <ArrowLeft className="w-4 h-4" />
                                Cancelar
                            </Link>
                        </div>
                    </form>
                </Card>
            </div>
        </AppLayout>
    )
}
