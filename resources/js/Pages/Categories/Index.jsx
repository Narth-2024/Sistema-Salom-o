import { Head, Link, useForm, router } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout.jsx'
import { Card, Button, Input, Select, Badge } from '@/Components'
import { Plus, Edit2, Trash2, TrendingUp, TrendingDown, ArrowLeft, Tags, FolderOpen } from 'lucide-react'

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

    const incomeCategories = categories.filter(c => c.type === 'income')
    const expenseCategories = categories.filter(c => c.type === 'expense')

    return (
        <AppLayout>
            <Head title="Categorias" />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Categorias</h1>
                        <p className="text-gray-500 mt-1">Organize suas receitas e despesas em categorias.</p>
                    </div>
                </div>

                {/* Quick add card */}
                <Card className="mb-8 bg-green-50/50 border-green-100">
                    <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-green-600" />
                        Adicionar categoria
                    </h2>
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                        <Input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            required
                            placeholder="Ex: Alimentação, Transporte..."
                            className="flex-1"
                        />
                        <Select
                            value={data.type}
                            onChange={e => setData('type', e.target.value)}
                            required
                            className="sm:w-44"
                        >
                            <option value="expense">Despesa</option>
                            <option value="income">Receita</option>
                        </Select>
                        <Button type="submit" variant="primary" disabled={processing}>
                            <Plus className="w-4 h-4" />
                            Adicionar
                        </Button>
                    </form>
                </Card>

                {categories.length === 0 ? (
                    <Card className="text-center py-16">
                        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                            <FolderOpen className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">Nenhuma categoria cadastrada</p>
                        <p className="text-gray-400 text-sm mt-1">Crie categorias para organizar suas finanças.</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.map(category => (
                            <Card key={category.id} className="relative group hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${category.type === 'income' ? 'bg-success-light' : 'bg-danger-light'}`}>
                                        {category.type === 'income' ? (
                                            <TrendingUp className="w-5 h-5 text-success" />
                                        ) : (
                                            <TrendingDown className="w-5 h-5 text-danger" />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                                        <Link href={`/categories/${category.id}/edit`}
                                            className="text-gray-400 hover:text-green-600 transition p-1.5 rounded-lg hover:bg-green-50">
                                            <Edit2 className="w-4 h-4" />
                                        </Link>
                                        <button onClick={() => handleDelete(category)}
                                            className="text-gray-400 hover:text-danger transition p-1.5 rounded-lg hover:bg-danger-light/50 cursor-pointer">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <Link href={`/categories/${category.id}`} className="block group/link">
                                    <h3 className="text-base font-semibold text-gray-900 group-hover/link:text-green-700 transition">
                                        {category.name}
                                    </h3>
                                </Link>
                                <Badge variant={category.type === 'income' ? 'income' : 'expense'} className="mt-2">
                                    {category.type === 'income' ? 'Receita' : 'Despesa'}
                                </Badge>
                            </Card>
                        ))}
                    </div>
                )}

                <div className="mt-8 flex justify-center">
                    <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium transition">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar ao Dashboard
                    </Link>
                </div>
            </main>
        </AppLayout>
    )
}
