import { useEffect, useState } from 'react'
import { usePage } from '@inertiajs/react'
import { CheckCircle, XCircle, X } from 'lucide-react'

export default function FlashMessage() {
    const { flash } = usePage().props
    const [visible, setVisible] = useState(false)
    const [message, setMessage] = useState(null)
    const [type, setType] = useState('success')

    useEffect(() => {
        const msg = flash?.success || flash?.error
        if (msg) {
            setMessage(msg)
            setType(flash.success ? 'success' : 'error')
            setVisible(true)
            const timer = setTimeout(() => setVisible(false), 5000)
            return () => clearTimeout(timer)
        }
    }, [flash])

    if (!visible || !message) return null

    const isSuccess = type === 'success'

    return (
        <div className="fixed top-4 right-4 z-[100] animate-in">
            <div className={`flex items-center gap-3 px-5 py-3 rounded-xl border shadow-lg ${
                isSuccess
                    ? 'bg-green-600/10 border-green-600/20 text-green-600 shadow-green-600/10'
                    : 'bg-red-500/10 border-red-500/20 text-red-400 shadow-red-500/10'
            }`}>
                {isSuccess ? (
                    <CheckCircle className="w-5 h-5 shrink-0" />
                ) : (
                    <XCircle className="w-5 h-5 shrink-0" />
                )}
                <span className="text-sm font-medium">{message}</span>
                <button onClick={() => setVisible(false)} className="ml-2 opacity-60 hover:opacity-100 transition cursor-pointer">
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
