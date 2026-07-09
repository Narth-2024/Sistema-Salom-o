import { Head, Link, useForm } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout.jsx'
import { Card, Button, Input, Select } from '@/Components'
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react'
import { useState } from 'react'

const presetColors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
    '#f97316', '#eab308', '#22c55e', '#14b8a6',
    '#06b6d4', '#3b82f6', '#8b6fe0', '#f87171',
]

export default function CategoriesEdit({ category }) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name,
        type: category.type,
        color: category.color || '',
    })

    function handleSubmit(e) {
        e.preventDefault()
        put(`/categories/${category.id}`)
    }

    return (
        <AppLayout>
            <Head title="Editar Categoria" />

            <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="mb-6 sm:mb-8">
                    <Link href="/categories" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 font-medium mb-4 transition">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar para Categorias
                    </Link>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Editar Categoria</h1>
                    <p className="text-gray-500 mt-1">Alterando a categoria <span className="font-medium">"{category.name}"</span>.</p>
                </div>

                {Object.keys(errors).length > 0 && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <ul className="list-disc list-inside text-sm text-red-400 space-y-0.5">
                            {Object.values(errors).map((error, i) => <li key={i}>{error}</li>)}
                        </ul>
                    </div>
                )}

                <Card accent>
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
                            <option value="income">Receita</option>
                            <option value="expense">Despesa</option>
                        </Select>

                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-600 mb-1.5">Cor</label>
                            <div className="flex items-center gap-2 flex-wrap">
                                <button
                                    type="button"
                                    onClick={() => setData('color', '')}
                                    className={`w-8 h-8 rounded-full border-2 transition cursor-pointer flex items-center justify-center text-[10px] font-medium ${
                                        !data.color ? 'border-gray-200 scale-110 ring-2 ring-green-600/30' : 'border-transparent text-gray-500 hover:border-gray-200'
                                    } bg-gray-100`}
                                >
                                    —
                                </button>
                                {presetColors.map(c => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setData('color', c)}
                                        className={`w-8 h-8 rounded-full border-2 transition cursor-pointer ${
                                            data.color === c ? 'border-gray-200 scale-110 ring-2 ring-green-600/30' : 'border-transparent'
                                        }`}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t border-gray-200/60">
                            <Button type="submit" variant="primary" disabled={processing} className="flex-1 sm:flex-none">
                                <Save className="w-4 h-4" />
                                Salvar alterações
                            </Button>
                            <Link href="/categories" className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm text-gray-500 hover:text-gray-300 font-medium rounded-xl hover:bg-gray-100 transition">
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
