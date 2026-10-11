import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

// Seletor de elementos focáveis dentro do diálogo.
const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function Modal({ open, onClose, title, children, dismissible = true }) {
    const dialogRef = useRef(null)
    const previousFocus = useRef(null)

    useEffect(() => {
        if (!open) {
            document.body.style.overflow = ''
            return
        }

        document.body.style.overflow = 'hidden'
        previousFocus.current = document.activeElement

        // Foca o primeiro elemento focável do diálogo (ou o diálogo em si)
        const dialog = dialogRef.current
        const first = dialog?.querySelector(FOCUSABLE)
        ;(first || dialog)?.focus()

        function handleKey(e) {
            // Esc fecha sempre que houver saída (dismissible ou onClose definido)
            if (e.key === 'Escape' && (dismissible || onClose)) {
                e.stopPropagation()
                onClose()
                return
            }
            // Focus trap: Tab/Shift+Tab循环 dentro do diálogo
            if (e.key === 'Tab' && dialog) {
                const items = [...dialog.querySelectorAll(FOCUSABLE)].filter(
                    el => el.offsetParent !== null
                )
                if (items.length === 0) {
                    e.preventDefault()
                    return
                }
                const firstItem = items[0]
                const lastItem = items[items.length - 1]
                if (e.shiftKey && document.activeElement === firstItem) {
                    e.preventDefault()
                    lastItem.focus()
                } else if (!e.shiftKey && document.activeElement === lastItem) {
                    e.preventDefault()
                    firstItem.focus()
                } else if (!dialog.contains(document.activeElement)) {
                    e.preventDefault()
                    firstItem.focus()
                }
            }
        }

        document.addEventListener('keydown', handleKey, true)
        return () => {
            document.body.style.overflow = ''
            document.removeEventListener('keydown', handleKey, true)
            // Devolve o foco ao elemento que abriu o modal
            previousFocus.current?.focus?.()
        }
    }, [open, onClose, dismissible])

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={dismissible ? onClose : undefined} aria-hidden="true" />
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                tabIndex={-1}
                className="relative bg-surface border border-border rounded-2xl shadow-xl w-full max-w-md p-6 animate-in focus:outline-none"
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                    {dismissible && (
                        <button onClick={onClose} aria-label="Fechar" className="text-gray-500 hover:text-gray-700 transition p-1 rounded-lg hover:bg-gray-100 cursor-pointer">
                            <X className="w-5 h-5" aria-hidden="true" />
                        </button>
                    )}
                </div>
                {children}
            </div>
        </div>
    )
}
