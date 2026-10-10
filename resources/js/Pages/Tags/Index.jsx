import { Head, Link, useForm, router } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout.jsx'
import { Card, Button, Input, Badge, Pagination, ConfirmDialog } from '@/Components'
import { Plus, Trash2, Hash, Palette } from 'lucide-react'
import { useState } from 'react'

const presetColors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
    '#f97316', '#eab308', '#22c55e', '#14b8a6',
    '#06b6d4', '#3b82f6',
]

export default function TagsIndex({ tags }) {
    const items = tags.data || tags
    const meta = tags.meta || null

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        color: '#6366f1',
    })

    const [editingId, setEditingId] = useState(null)
    const [editForm, setEditForm] = useState({ name: '', color: '' })
    const [editError, setEditError] = useState(null)
    const [deleteTarget, setDeleteTarget] = useState(null)

    function handleSubmit(e) {
        e.preventDefault()
        post('/tags', { onSuccess: () => reset() })
    }

    function handleDelete(tag) {
        router.delete(`/tags/${tag.id}`)
    }

    function startEdit(tag) {
        setEditingId(tag.id)
        setEditForm({ name: tag.name, color: tag.color })
        setEditError(null)
    }

    function saveEdit(tag) {
        setEditError(null)
        router.put(`/tags/${tag.id}`, editForm, {
            preserveScroll: true,
            onSuccess: () => setEditingId(null),
            onError: (errs) => setEditError(errs.name || 'Não foi possível salvar.'),
        })
    }

    function cancelEdit() {
        setEditingId(null)
        setEditError(null)
    }

    return (
        <AppLayout>
            <Head title="Tags" />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8" data-tour="tags-header">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Tags</h1>
                        <p className="text-gray-500 mt-1">Adicione rótulos às suas transações para organizar melhor.</p>
                    </div>
                </div>

                {/* Quick add */}
                <div className="mb-8 bg-indigo-600/5 rounded-2xl p-6 border border-border relative overflow-hidden" data-tour="tags-form">
                    <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-indigo-400" />
                        Nova tag
                    </h2>
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-end">
                        <Input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            required
                            placeholder="Ex: cartão_credito, parcelado..."
                            className="flex-1"
                            error={errors.name}
                        />
                        <div className="flex items-center gap-1">
                            {presetColors.map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setData('color', c)}
                                    className={`w-7 h-7 rounded-full border-2 transition cursor-pointer ${
                                        data.color === c ? 'border-border scale-110' : 'border-transparent'
                                    }`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                        <Button type="submit" variant="primary" disabled={processing}>
                            <Plus className="w-4 h-4" />
                            Criar
                        </Button>
                    </form>
                </div>

                {/* Tags list */}
                {items.length === 0 ? (
                    <Card className="text-center py-16" data-tour="tags-list">
                        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-4 ring-1 ring-border-strong">
                            <Hash className="w-8 h-8 text-gray-500" />
                        </div>
                        <p className="text-gray-500 font-medium">Nenhuma tag cadastrada</p>
                        <p className="text-gray-500 text-sm mt-1">Crie tags para categorizar suas transações de forma flexível.</p>
                    </Card>
                ) : (
                    <div className="space-y-2" data-tour="tags-list">
                        {items.map(tag => (
                            <Card key={tag.id} className="flex items-center justify-between gap-4" hover>
                                {editingId === tag.id ? (
                                    <div className="flex-1 flex items-center gap-3">
                                        <div className="flex items-center gap-1">
                                            {presetColors.map(c => (
                                                <button
                                                    key={c}
                                                    type="button"
                                                    onClick={() => setEditForm(f => ({ ...f, color: c }))}
                                                    className={`w-6 h-6 rounded-full border-2 transition cursor-pointer ${
                                                        editForm.color === c ? 'border-border scale-110' : 'border-transparent'
                                                    }`}
                                                    style={{ backgroundColor: c }}
                                                />
                                            ))}
                                        </div>
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                                            className="flex-1 px-3 py-1.5 rounded-lg border border-border bg-surface-elevated text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            autoFocus
                                        />
                                        {editError && (
                                            <span className="text-xs text-red-400">{editError}</span>
                                        )}
                                        <Button size="sm" variant="primary" onClick={() => saveEdit(tag)}>Salvar</Button>
                                        <Button size="sm" variant="ghost" onClick={cancelEdit}>Cancelar</Button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-3">
                                            <span
                                                className="w-4 h-4 rounded-full ring-1 ring-white/10"
                                                style={{ backgroundColor: tag.color }}
                                            />
                                            <span className="text-sm font-medium text-gray-800">{tag.name}</span>
                                            <Badge variant="default">{tag.transactions_count} transação(ões)</Badge>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => startEdit(tag)}
                                                className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget(tag)}
                                                className="text-gray-500 hover:text-red-400 transition p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </Card>
                        ))}
                    </div>
                )}

                <Pagination meta={meta} standalone />

                <ConfirmDialog
                    open={!!deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
                    title="Excluir tag"
                    message="Tem certeza que deseja excluir esta tag? Ela será removida de todas as transações vinculadas."
                    itemLabel={deleteTarget?.name}
                />
            </main>
        </AppLayout>
    )
}
