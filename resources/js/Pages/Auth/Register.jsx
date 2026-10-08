import { useState } from 'react'
import { Link } from '@inertiajs/react'
import { useSignUp } from '@clerk/react'
import { AuthShell, Button, Input } from '@/Components'
import { clerkErrorMessage } from '@/lib/clerkErrors'
import { ArrowRight, Mail, Lock, User, ShieldCheck } from 'lucide-react'

export default function Register() {
    const { isLoaded, signUp, setActive } = useSignUp()

    const [pendingVerification, setPendingVerification] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [code, setCode] = useState('')
    const [error, setError] = useState(null)
    const [notice, setNotice] = useState(null)
    const [loading, setLoading] = useState(false)

    async function handleRegister(e) {
        e.preventDefault()
        setError(null)
        if (!isLoaded || loading) return
        setLoading(true)
        try {
            const parts = name.trim().split(' ')
            await signUp.create({
                firstName: parts[0] || '',
                lastName: parts.slice(1).join(' ') || '',
                emailAddress: email,
                password,
            })
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
            setPendingVerification(true)
            setNotice(`Enviamos um código de verificação para ${email}.`)
        } catch (err) {
            setError(clerkErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    async function handleVerify(e) {
        e.preventDefault()
        setError(null)
        if (!isLoaded || loading) return
        setLoading(true)
        try {
            const result = await signUp.attemptEmailAddressVerification({ code })
            if (result.status === 'complete') {
                await setActive({ session: result.createdSessionId })
                window.location.href = '/auth/clerk-callback'
                return
            }
            setError('Verificação incompleta. Tente novamente.')
        } catch (err) {
            setError(clerkErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    async function handleResend() {
        setError(null)
        setNotice(null)
        if (!isLoaded || loading) return
        setLoading(true)
        try {
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
            setNotice('Novo código enviado.')
        } catch (err) {
            setError(clerkErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthShell title="Criar conta">
            <h1 className="text-2xl font-bold text-gray-800">
                {pendingVerification ? 'Verifique seu email' : 'Crie sua conta'}
            </h1>
            <p className="text-sm text-gray-500 mt-1 mb-6">
                {pendingVerification
                    ? 'Digite o código que enviamos para o seu email.'
                    : 'Comece a organizar suas finanças em menos de 1 minuto.'}
            </p>

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

            {!pendingVerification ? (
                <form onSubmit={handleRegister} className="space-y-4">
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
                    <p className="text-xs text-gray-500">Mínimo de 8 caracteres.</p>

                    <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                        {loading ? 'Criando conta…' : 'Criar conta'}
                        {!loading && <ArrowRight className="w-4 h-4" />}
                    </Button>

                    <p className="text-sm text-gray-500 text-center pt-2 border-t border-border">
                        Já tem uma conta?{' '}
                        <Link href="/login" className="text-accent-text hover:opacity-80 font-medium">
                            Entrar
                        </Link>
                    </p>
                </form>
            ) : (
                <form onSubmit={handleVerify} className="space-y-4">
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
                    <Button type="submit" variant="primary" className="w-full" disabled={loading || code.length !== 6}>
                        {loading ? 'Verificando…' : 'Verificar e entrar'}
                    </Button>
                    <p className="text-sm text-gray-500 text-center pt-2 border-t border-border">
                        Não recebeu?{' '}
                        <button
                            type="button"
                            onClick={handleResend}
                            className="text-accent-text hover:opacity-80 font-medium cursor-pointer"
                        >
                            Reenviar código
                        </button>
                        {' · '}
                        <Link href="/login" className="text-accent-text hover:opacity-80 font-medium">
                            Voltar ao login
                        </Link>
                    </p>
                </form>
            )}
        </AuthShell>
    )
}
