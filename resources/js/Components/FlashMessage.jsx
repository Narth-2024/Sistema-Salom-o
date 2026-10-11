import { useEffect, useState } from 'react'
import { usePage, router } from '@inertiajs/react'
import { CheckCircle, XCircle, X, Undo2 } from 'lucide-react'

export default function FlashMessage() {
    const { flash } = usePage().props
    const [visible, setVisible] = useState(false)
    const [message, setMessage] = useState(null)
    const [type, setType] = useState('success')
    const [undoUrl, setUndoUrl] = useState(null)

    useEffect(() => {
        const msg = flash?.success || flash?.error
        if (msg) {
            setMessage(msg)
            setType(flash.success ? 'success' : 'error')
            setUndoUrl(flash.success ? flash.undo || null : null)
            setVisible(true)
            const timer = setTimeout(() => setVisible(false), flash.undo ? 8000 : 5000)
            return () => clearTimeout(timer)
        }
    }, [flash])

    function handleUndo() {
        if (!undoUrl) return
        setVisible(false)
        router.post(undoUrl, {}, { preserveScroll: true })
    }

    if (!visible || !message) return null

    const isSuccess = type === 'success'

    return (
        <div className="fixed top-20 right-4 md:top-4 z-[100] animate-in">
            <div className={`flex items-center gap-3 px-5 py-3 rounded-xl border shadow-lg ${
                isSuccess
                    ? 'bg-primary/10 border-primary/20 text-accent-text shadow-primary/10'
                    : 'bg-red-500/10 border-red-500/20 text-red-400 shadow-red-500/10'
            }`}>
                {isSuccess ? (
                    <CheckCircle className="w-5 h-5 shrink-0" />
                ) : (
                    <XCircle className="w-5 h-5 shrink-0" />
                )}
                <span className="text-sm font-medium">{message}</span>
                {undoUrl && (
                    <button
                        onClick={handleUndo}
                        className="ml-1 inline-flex items-center gap-1 text-sm font-semibold underline underline-offset-2 hover:opacity-80 transition cursor-pointer"
                    >
                        <Undo2 className="w-4 h-4" />
                        Desfazer
                    </button>
                )}
                <button onClick={() => setVisible(false)} className="ml-1 opacity-60 hover:opacity-100 transition cursor-pointer">
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
