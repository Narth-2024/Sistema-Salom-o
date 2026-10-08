import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children }) {
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden'
            const handleKey = e => { if (e.key === 'Escape') onClose() }
            document.addEventListener('keydown', handleKey)
            return () => {
                document.body.style.overflow = ''
                document.removeEventListener('keydown', handleKey)
            }
        }
        document.body.style.overflow = ''
        return () => { document.body.style.overflow = '' }
    }, [open, onClose])

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
            <div role="dialog" aria-modal="true" aria-label={title} className="relative bg-surface border border-gray-200 rounded-2xl shadow-xl w-full max-w-md p-6 animate-in">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                    <button onClick={onClose} aria-label="Fechar" className="text-gray-500 hover:text-gray-700 transition p-1 rounded-lg hover:bg-gray-100 cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}
