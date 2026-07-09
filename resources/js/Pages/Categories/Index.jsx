import { Head, Link, useForm, router } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout.jsx'
import { Card, Button, Input, Select, Badge, Pagination } from '@/Components'
import { Plus, Edit2, Trash2, TrendingUp, TrendingDown, ArrowLeft, Tags, FolderOpen } from 'lucide-react'
import { useState } from 'react'

const presetColors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
    '#f97316', '#eab308', '#22c55e', '#14b8a6',
    '#06b6d4', '#3b82f6', '#8b6fe0', '#f87171',
]

export default function CategoriesIndex({ categories }) {
    const items = categories.data || categories
    const meta = categories.meta || null

    const { data, setData, post, processing, reset } = useForm({
        name: '',
        type: 'expense',
        color: '#6366f1',
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

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Categorias</h1>
                        <p className="text-gray-500 mt-1">Organize suas receitas e despesas em categorias.</p>
                    </div>
                </div>

                {/* Quick add card */}
                <div className="mb-8 bg-gradient-to-br from-green-600/5 to-green-600/[0.02] rounded-2xl p-6 border border-gray-200/60 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-green-600/30 to-transparent" />
                    <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-green-600" />
                        Nova categoria
                    </h2>
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 flex-wrap">
                        <Input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            required
                            placeholder="Ex: Alimentação, Transporte..."
                            className="flex-1 min-w-[160px]"
                        />
                        <Select
                            value={data.type}
                            onChange={e => setData('type', e.target.value)}
                            required
                            className="sm:w-36"
                        >
                            <option value="expense">Despesa</option>
                            <option value="income">Receita</option>
                        </Select>
                        <div className="flex items-center gap-1">
                            {presetColors.map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setData('color', c)}
                                    className={`w-6 h-6 rounded-full border-2 transition cursor-pointer ${
                                        data.color === c ? 'border-gray-200 scale-110' : 'border-transparent'
                                    }`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                        <Button type="submit" variant="primary" disabled={processing}>
                            <Plus className="w-4 h-4" />
                            Nova
                        </Button>
                    </form>
                </div>

                {items.length === 0 ? (
                    <Card className="text-center py-16">
                        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-4 ring-1 ring-white/5">
                            <FolderOpen className="w-8 h-8 text-gray-500" />
                        </div>
                        <p className="text-gray-400 font-medium">Nenhuma categoria cadastrada</p>
                        <p className="text-gray-500 text-sm mt-1">Crie categorias para organizar suas finanças.</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.map(category => (
                            <Card key={category.id} className="relative group" hover accent={category.type === 'income' ? true : 'danger'}>
                                <div className="flex items-start justify-between mb-3">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center ring-1 ring-white/5"
                                        style={{ backgroundColor: category.color ? `${category.color}20` : (category.type === 'income' ? 'rgba(62,207,142,0.1)' : 'rgba(248,113,113,0.1)') }}
                                    >
                                        {category.type === 'income' ? (
                                            <TrendingUp className="w-5 h-5" style={{ color: category.color || '#3ecf8e' }} />
                                        ) : (
                                            <TrendingDown className="w-5 h-5" style={{ color: category.color || '#f87171' }} />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                                        <Link href={`/categories/${category.id}/edit`}
                                            className="text-gray-500 hover:text-green-600 transition p-1.5 rounded-lg hover:bg-gray-100">
                                            <Edit2 className="w-4 h-4" />
                                        </Link>
                                        <button onClick={() => handleDelete(category)}
                                            className="text-gray-500 hover:text-red-400 transition p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <Link href={`/categories/${category.id}`} className="block group/link">
                                    <h3 className="text-base font-semibold text-gray-800 group-hover/link:text-green-500 transition flex items-center gap-2">
                                        {category.color && (
                                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: category.color }} />
                                        )}
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

                <Pagination meta={meta} />

                <div className="mt-8 flex justify-center">
                    <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 font-medium transition">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar para Início
                    </Link>
                </div>
            </main>
        </AppLayout>
    )
}
