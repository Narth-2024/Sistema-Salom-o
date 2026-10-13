import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@clerk/react'
import { AuthShell, Button } from '@/Components'
import { Lock } from 'lucide-react'

/**
 * Conclui o login: o Clerk já autenticou no frontend, falta trocar aquela
 * sessão por uma sessão do Laravel para o resto do sistema funcionar.
 *
 * O token enviado é o session token do Clerk. O backend valida a assinatura
 * e lê o usuário do claim `sub` — nada de identidade declarada pelo cliente.
 */
export default function ClerkCallback() {
    const { isLoaded, isSignedIn, getToken } = useAuth()
    const [error, setError] = useState(null)
    const started = useRef(false)

    useEffect(() => {
        if (!isLoaded || started.current) return

        if (!isSignedIn) {
            window.location.replace('/login')
            return
        }

        started.current = true
        exchange()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded, isSignedIn])

    async function exchange() {
        try {
            const token = await getToken()

            if (!token) {
                setError('Não foi possível ler a sessão do Clerk. Entre novamente.')
                return
            }

            const { data } = await window.axios.post('/auth/clerk-exchange', {}, {
                headers: { Authorization: `Bearer ${token}` },
            })

            // Page load completa: a sessão Laravel nova precisa ser lida do zero,
            // sem o cache de página do Inertia.
            window.location.assign(data.redirect || '/dashboard')
        } catch (err) {
            setError(
                err?.response?.data?.error
                || 'Não foi possível concluir o login. Tente novamente.'
            )
        }
    }

    return (
        <AuthShell title="Entrando">
            <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
                {error ? (
                    <>
                        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                            <Lock className="w-5 h-5 text-red-400" />
                        </div>
                        <p className="text-sm text-red-400" role="alert">{error}</p>
                        <Button variant="primary" onClick={() => window.location.assign('/login')}>
                            Voltar ao login
                        </Button>
                    </>
                ) : (
                    <>
                        <div className="w-10 h-10 rounded-full border-2 border-border border-t-accent-text animate-spin" />
                        <p className="text-sm text-gray-500">Entrando na sua conta…</p>
                    </>
                )}
            </div>
        </AuthShell>
    )
}
