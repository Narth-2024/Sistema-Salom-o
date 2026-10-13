import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

/**
 * Lista os códigos de recuperação em texto puro. Eles só existem em texto
 * nesta tela: no banco fica apenas o hash, então não há como exibi-los depois.
 */
export default function RecoveryCodeList({ codes }) {
    const [copied, setCopied] = useState(false)

    async function copyAll() {
        try {
            await navigator.clipboard.writeText(codes.join('\n'))
            setCopied(true)
            setTimeout(() => setCopied(false), 2500)
        } catch {
            // Clipboard bloqueado (ex.: navegador sem permissão): o usuário
            // ainda pode copiar código a código manualmente.
            setCopied(false)
        }
    }

    return (
        <div className="space-y-4">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {codes.map(code => (
                    <li
                        key={code}
                        className="font-mono text-sm tracking-wider text-gray-800 bg-surface-elevated border border-border-strong rounded-xl px-3 py-2.5 text-center select-all"
                    >
                        {code}
                    </li>
                ))}
            </ul>

            <button
                type="button"
                onClick={copyAll}
                className="inline-flex items-center gap-2 text-sm font-medium text-accent-text hover:opacity-80 transition cursor-pointer"
            >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copiados!' : 'Copiar todos'}
            </button>
        </div>
    )
}
