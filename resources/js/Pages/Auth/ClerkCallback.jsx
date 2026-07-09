import { useEffect, useState } from 'react'
import { Head } from '@inertiajs/react'
import { useUser } from '@clerk/react'

export default function ClerkCallback() {
    const { user, isLoaded } = useUser()
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!isLoaded) return
        if (!user) {
            setError('Usuário não autenticado no Clerk.')
            return
        }

        async function exchange() {
            try {
                const res = await fetch('/auth/clerk-exchange', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                    },
                    body: JSON.stringify({
                        clerk_id: user.id,
                        email: user.primaryEmailAddress?.emailAddress,
                        name: user.fullName,
                    }),
                })

                if (!res.ok) {
                    const text = await res.text()
                    setError(`Erro ao autenticar (${res.status})`)
                    return
                }

                window.location.href = '/dashboard'
            } catch (e) {
                setError('Erro de conexão com o servidor.')
            }
        }

        exchange()
    }, [isLoaded, user])

    return (
        <>
            <Head title="Autenticando..." />
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="bg-surface rounded-2xl shadow-xl w-full max-w-sm p-8 text-center border border-gray-200/50">
                    {error ? (
                        <>
                            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">Erro na autenticação</h2>
                            <p className="text-sm text-gray-500 mb-4">{error}</p>
                            <a href="/login" className="text-green-600 hover:underline font-medium">Voltar ao login</a>
                        </>
                    ) : (
                        <>
                            <div className="w-12 h-12 mx-auto border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4" />
                            <h2 className="text-xl font-bold text-gray-800 mb-2">Autenticando...</h2>
                            <p className="text-sm text-gray-500">Aguarde enquanto verificamos sua conta.</p>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}
