import { useState } from 'react'
import { Link } from '@inertiajs/react'
import { useSignIn } from '@clerk/react'
import { AuthShell, Button, Input } from '@/Components'
import { clerkErrorMessage } from '@/lib/clerkErrors'
import { ArrowRight, Mail, Lock, ShieldCheck } from 'lucide-react'

export default function Login() {
    const { isLoaded, signIn, setActive } = useSignIn()

    const [mode, setMode] = useState('login') // login | forgot | reset
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [code, setCode] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [error, setError] = useState(null)
    const [notice, setNotice] = useState(null)
    const [loading, setLoading] = useState(false)

    function goBackToLogin() {
        setMode('login')
        setError(null)
        setNotice(null)
        setCode('')
        setNewPassword('')
    }

    async function handleLogin(e) {
        e.preventDefault()
        setError(null)
        if (!isLoaded || loading) return
        setLoading(true)
        try {
            await signIn.create({ identifier: email })
            const result = await signIn.attemptFirstFactor({ strategy: 'password', password })
            if (result.status === 'complete') {
                await setActive({ session: result.createdSessionId })
                window.location.href = '/auth/clerk-callback'
                return
            }
            if (result.status === 'needs_second_factor') {
                setError('Esta conta exige verificação em dois fatores. Entre em contato com o suporte.')
                return
            }
            setError('Não foi possível entrar. Tente novamente.')
        } catch (err) {
            setError(clerkErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    async function handleForgot(e) {
        e.preventDefault()
        setError(null)
        setNotice(null)
        if (!isLoaded || loading) return
        setLoading(true)
        try {
            await signIn.create({ identifier: email })
            await signIn.prepareFirstFactor({ strategy: 'reset_password_email_code', identifier: email })
            setMode('reset')
            setNotice('Enviamos um código de verificação para seu email.')
        } catch (err) {
            setError(clerkErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    async function handleReset(e) {
        e.preventDefault()
        setError(null)
        if (!isLoaded || loading) return
        setLoading(true)
        try {
            const attempt = await signIn.attemptFirstFactor({ strategy: 'reset_password_email_code', code })
            if (attempt.status !== 'needs_new_password') {
                setError('Não foi possível validar o código. Solicite um novo.')
                return
            }
            const result = await signIn.resetPassword({ password: newPassword })
            if (result.status === 'complete') {
                await setActive({ session: result.createdSessionId })
                window.location.href = '/auth/clerk-callback'
                return
            }
            setError('Não foi possível redefinir a senha.')
        } catch (err) {
            setError(clerkErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    const titles = {
        login: 'Entre na sua conta',
        forgot: 'Recuperar senha',
        reset: 'Nova senha',
    }

    const subtitles = {
        login: 'Acesse o Sistema Salomão com seu email e senha.',
        forgot: 'Informe seu email e enviaremos um código de verificação.',
        reset: 'Digite o código recebido e escolha uma nova senha.',
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
            {notice && (
                <div className="mb-4 p-3 rounded-xl bg-primary/10 border border-primary/20 text-sm text-accent-text" role="status">
                    {notice}
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
                            onClick={() => { setMode('forgot'); setError(null); setNotice(null) }}
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

            {mode === 'forgot' && (
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
                        {loading ? 'Enviando…' : 'Enviar código'}
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
                    <Input
                        label="Código de verificação"
                        icon={ShieldCheck}
                        placeholder="000000"
                        inputMode="numeric"
                        maxLength={6}
                        value={code}
                        onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                        required
                    />
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
                    <p className="text-xs text-gray-500">Mínimo de 8 caracteres.</p>
                    <Button type="submit" variant="primary" className="w-full" disabled={loading || code.length !== 6}>
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
