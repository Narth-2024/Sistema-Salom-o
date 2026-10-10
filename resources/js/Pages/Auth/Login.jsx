import { useState } from 'react'
import { Link, router } from '@inertiajs/react'
import { AuthShell, Button, Input } from '@/Components'
import { Mail, Lock, ArrowRight } from 'lucide-react'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    function handleSubmit(e) {
        e.preventDefault()
        setError(null)
        if (loading) return
        setLoading(true)

        router.post('/login', { email, password }, {
            onFinish: () => setLoading(false),
            onError: (errors) => {
                setError(errors.email || 'Não foi possível entrar. Tente novamente.')
            },
        })
    }

    return (
        <AuthShell title="Entrar">
            <h1 className="text-2xl font-bold text-gray-800">Entre na sua conta</h1>
            <p className="text-sm text-gray-500 mt-1 mb-6">Acesse o Sistema Salomão com seu email e senha.</p>

            {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400" role="alert">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Email"
                    type="email"
                    icon={Mail}
                    placeholder="seu@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                />
                <Input
                    label="Senha"
                    type="password"
                    icon={Lock}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                />

                <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                    {loading ? 'Entrando…' : 'Entrar'}
                    {!loading && <ArrowRight className="w-4 h-4" />}
                </Button>

                <p className="text-sm text-gray-500 text-center pt-2 border-t border-border">
                    Não tem uma conta?{' '}
                    <Link href="/register" className="text-accent-text hover:opacity-80 font-medium">
                        Criar conta
                    </Link>
                </p>
            </form>
        </AuthShell>
    )
}
