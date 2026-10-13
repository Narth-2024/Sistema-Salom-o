import { SignIn } from '@clerk/react'
import { Link } from '@inertiajs/react'
import { AuthShell } from '@/Components'
import { clerkAppearance } from '@/lib/clerkAppearance'
import useColorScheme from '@/hooks/useColorScheme'

export default function Login() {
    const colorScheme = useColorScheme()

    return (
        <AuthShell title="Entrar">
            <h1 className="text-2xl font-bold text-gray-800">Entre na sua conta</h1>
            <p className="text-sm text-gray-500 mt-1 mb-6">
                Acesse o Sistema Salomão com seu email e senha.
            </p>

            {/*
              routing="hash": o Clerk gerencia os passos do fluxo (segundo fator,
              redefinição de senha) pela hash da URL, então nenhuma rota extra
              precisa existir no Laravel. path routing exigiria um catch-all.
            */}
            <SignIn
                routing="hash"
                fallbackRedirectUrl="/auth/clerk-callback"
                appearance={clerkAppearance(colorScheme)}
            />

            <p className="text-sm text-gray-500 text-center pt-4 mt-4 border-t border-border">
                Não tem uma conta?{' '}
                <Link href="/register" className="text-accent-text hover:opacity-80 font-medium">
                    Criar conta
                </Link>
            </p>
        </AuthShell>
    )
}
