import { X } from 'lucide-react'

export default function TagPicker({ tags, selectedIds, onChange }) {
    function toggle(tagId) {
        const next = selectedIds.includes(tagId)
            ? selectedIds.filter(id => id !== tagId)
            : [...selectedIds, tagId]
        onChange(next)
    }

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Tags</label>
            <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-gray-200/60 bg-surface-elevated min-h-[44px]">
                {tags.length === 0 && (
                    <span className="text-sm text-gray-500">Nenhuma tag disponível. Crie uma em Tags.</span>
                )}
                {tags.map(tag => {
                    const selected = selectedIds.includes(tag.id)
                    return (
                        <button
                            key={tag.id}
                            type="button"
                            onClick={() => toggle(tag.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer ${
                                selected
                                    ? 'text-white ring-1 ring-white/10'
                                    : 'text-gray-500 bg-gray-100 hover:bg-gray-200'
                            }`}
                            style={selected ? { backgroundColor: tag.color } : {}}
                        >
                            {tag.name}
                            {selected && <X className="w-3 h-3" />}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
