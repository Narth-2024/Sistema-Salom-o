import { useState } from 'react'
import { Link, router } from '@inertiajs/react'
import { AuthShell, Button, Input } from '@/Components'
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react'

export default function Login({ resetToken, resetEmail }) {
    const [mode, setMode] = useState(resetToken ? 'reset' : 'login')
    const [email, setEmail] = useState(resetEmail || '')
    const [password, setPassword] = useState('')
    const [token, setToken] = useState(resetToken || '')
    const [newPassword, setNewPassword] = useState('')
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('')
    const [error, setError] = useState(null)
    const [sent, setSent] = useState(false)
    const [loading, setLoading] = useState(false)

    function goBackToLogin() {
        setMode('login')
        setError(null)
        setSent(false)
        setPassword('')
        setNewPassword('')
        setNewPasswordConfirmation('')
    }

    function handleLogin(e) {
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

    function handleForgot(e) {
        e.preventDefault()
        setError(null)
        if (loading) return
        setLoading(true)

        router.post('/forgot-password', { email }, {
            preserveState: true,
            onFinish: () => setLoading(false),
            onSuccess: () => setSent(true),
            onError: (errors) => {
                setError(errors.email || 'Não foi possível enviar. Tente novamente.')
            },
        })
    }

    function handleReset(e) {
        e.preventDefault()
        setError(null)
        if (loading) return

        if (newPassword.length < 8) {
            setError('A senha precisa ter no mínimo 8 caracteres.')
            return
        }
        if (newPassword !== newPasswordConfirmation) {
            setError('As senhas não coincidem.')
            return
        }

        setLoading(true)
        router.post('/reset-password', {
            token,
            email: resetEmail || email,
            password: newPassword,
            password_confirmation: newPasswordConfirmation,
        }, {
            onFinish: () => setLoading(false),
            onError: (errors) => {
                setError(errors.token || errors.password || errors.email || 'Não foi possível redefinir a senha.')
            },
        })
    }

    const titles = {
        login: 'Entre na sua conta',
        forgot: 'Recuperar senha',
        reset: 'Nova senha',
    }

    const subtitles = {
        login: 'Acesse o Sistema Salomão com seu email e senha.',
        forgot: 'Informe seu email e enviaremos um link para criar uma nova senha.',
        reset: 'Escolha uma nova senha para a sua conta.',
    }

    return (
        <AuthShell title="Entrar">
            <h1 className="text-2xl font-bold text-gray-800">{titles[mode]}</h1>
            <p className="text-sm text-gray-500 mt-1 mb-6">{subtitles[mode]}</p>

            {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400" role="alert">
                    {error}
                </div>
            )}

            {mode === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
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

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => { setMode('forgot'); setError(null) }}
                            className="text-xs text-accent-text hover:opacity-80 font-medium cursor-pointer"
                        >
                            Esqueci minha senha
                        </button>
                    </div>

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
            )}

            {mode === 'forgot' && sent && (
                <div className="space-y-5" role="status" aria-live="polite">
                    <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-2">
                        <p className="text-sm font-semibold text-accent-text">Link de recuperação enviado</p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Se existir uma conta com <span className="font-medium break-all">{email}</span>, você
                            recebeu um email com o link para criar uma nova senha. Não esqueça de checar a caixa de spam.
                        </p>
                    </div>
                    <Button type="button" variant="primary" className="w-full" onClick={goBackToLogin}>
                        Voltar ao login
                    </Button>
                </div>
            )}

            {mode === 'forgot' && !sent && (
                <form onSubmit={handleForgot} className="space-y-4">
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
                    <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                        {loading ? 'Enviando…' : 'Enviar link por email'}
                    </Button>
                    <p className="text-sm text-gray-500 text-center pt-2 border-t border-border">
                        <button
                            type="button"
                            onClick={goBackToLogin}
                            className="text-accent-text hover:opacity-80 font-medium cursor-pointer"
                        >
                            Voltar ao login
                        </button>
                    </p>
                </form>
            )}

            {mode === 'reset' && (
                <form onSubmit={handleReset} className="space-y-4">
                    {!resetToken && (
                        <Input
                            label="Código de recuperação"
                            icon={ShieldCheck}
                            placeholder="Cole o código do email aqui"
                            value={token}
                            onChange={e => setToken(e.target.value)}
                            required
                        />
                    )}
                    <Input
                        label="Nova senha"
                        type="password"
                        icon={Lock}
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        autoComplete="new-password"
                        minLength={8}
                        required
                    />
                    <Input
                        label="Confirmar nova senha"
                        type="password"
                        icon={Lock}
                        placeholder="••••••••"
                        value={newPasswordConfirmation}
                        onChange={e => setNewPasswordConfirmation(e.target.value)}
                        autoComplete="new-password"
                        minLength={8}
                        required
                    />
                    <p className="text-xs text-gray-500">Mínimo de 8 caracteres.</p>
                    <Button type="submit" variant="primary" className="w-full" disabled={loading || (!resetToken && !token)}>
                        {loading ? 'Redefinindo…' : 'Redefinir senha'}
                    </Button>
                    <p className="text-sm text-gray-500 text-center pt-2 border-t border-border">
                        <button
                            type="button"
                            onClick={goBackToLogin}
                            className="text-accent-text hover:opacity-80 font-medium cursor-pointer"
                        >
                            Voltar ao login
                        </button>
                    </p>
                </form>
            )}
        </AuthShell>
    )
}
