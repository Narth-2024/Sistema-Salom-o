import { SignUp } from '@clerk/react'
import { Link } from '@inertiajs/react'
import { AuthShell } from '@/Components'
import { clerkAppearance } from '@/lib/clerkAppearance'
import useColorScheme from '@/hooks/useColorScheme'

export default function Register() {
    const colorScheme = useColorScheme()

    return (
        <AuthShell title="Criar conta">
            <h1 className="text-2xl font-bold text-gray-800">Crie sua conta</h1>
            <p className="text-sm text-gray-500 mt-1 mb-6">
                Comece a organizar suas finanças em menos de 1 minuto.
            </p>

            <SignUp
                routing="hash"
                fallbackRedirectUrl="/auth/clerk-callback"
                appearance={clerkAppearance(colorScheme)}
            />

            <p className="text-sm text-gray-500 text-center pt-4 mt-4 border-t border-border">
                Já tem uma conta?{' '}
                <Link href="/login" className="text-accent-text hover:opacity-80 font-medium">
                    Entrar
                </Link>
            </p>
        </AuthShell>
    )
}
