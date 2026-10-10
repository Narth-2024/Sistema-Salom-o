import { useState } from 'react'
import { Link, router } from '@inertiajs/react'
import { AuthShell, Button, Input } from '@/Components'
import { Mail, Lock, User, ArrowRight } from 'lucide-react'

export default function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    function handleSubmit(e) {
        e.preventDefault()
        setError(null)
        if (loading) return

        if (password.length < 8) {
            setError('A senha precisa ter no mínimo 8 caracteres.')
            return
        }
        if (password !== passwordConfirmation) {
            setError('As senhas não coincidem.')
            return
        }

        setLoading(true)
        router.post('/register', {
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
        }, {
            onFinish: () => setLoading(false),
            onError: (errors) => {
                setError(errors.email || errors.name || errors.password || 'Não foi possível criar a conta.')
            },
        })
    }

    return (
        <AuthShell title="Criar conta" cardClassName="p-6">
            <h1 className="text-2xl font-bold text-gray-800">Crie sua conta</h1>
            <p className="text-sm text-gray-500 mt-1 mb-5">Comece a organizar suas finanças em menos de 1 minuto.</p>

            {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400" role="alert">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                    label="Nome"
                    icon={User}
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    autoComplete="name"
                    required
                />
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
                    autoComplete="new-password"
                    minLength={8}
                    required
                />
                <Input
                    label="Confirmar senha"
                    type="password"
                    icon={Lock}
                    placeholder="••••••••"
                    value={passwordConfirmation}
                    onChange={e => setPasswordConfirmation(e.target.value)}
                    autoComplete="new-password"
                    minLength={8}
                    required
                />
                <p className="text-xs text-gray-500 -mt-1">Mínimo de 8 caracteres.</p>

                <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                    {loading ? 'Criando conta…' : 'Criar conta'}
                    {!loading && <ArrowRight className="w-4 h-4" />}
                </Button>

                <p className="text-sm text-gray-500 text-center pt-1 border-t border-border">
                    Já tem uma conta?{' '}
                    <Link href="/login" className="text-accent-text hover:opacity-80 font-medium">
                        Entrar
                    </Link>
                </p>
            </form>
        </AuthShell>
    )
}
