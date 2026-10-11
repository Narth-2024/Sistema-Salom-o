import { useEffect, useRef } from 'react'
import { AlertTriangle } from 'lucide-react'

// Resumo de erros de validação com role="alert" e foco automático.
// Usado no topo dos formulários; leitores de tela anunciam e o foco
// vai para o bloco para o usuário saber que algo falhou.
export default function ErrorSummary({ errors, className = '' }) {
    const ref = useRef(null)
    const entries = Object.values(errors || {})

    useEffect(() => {
        if (entries.length > 0 && ref.current) {
            ref.current.focus()
        }
    }, [entries.length])

    if (entries.length === 0) return null

    return (
        <div
            ref={ref}
            tabIndex={-1}
            role="alert"
            className={`bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-start gap-3 focus:outline-none focus:ring-2 focus:ring-red-500/30 ${className}`}
        >
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
                <p className="text-sm font-semibold text-red-400 mb-1">Verifique os campos abaixo</p>
                <ul className="list-disc list-inside text-sm text-red-400 space-y-0.5">
                    {entries.map((error, i) => <li key={i}>{error}</li>)}
                </ul>
            </div>
        </div>
    )
}
