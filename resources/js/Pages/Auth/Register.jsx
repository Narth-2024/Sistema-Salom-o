import { Head, Link } from '@inertiajs/react'
import { SignUp } from '@clerk/clerk-react'

export default function Register() {
    return (
        <>
            <Head title="Criar conta" />
            <div className="min-h-screen bg-[#F4FDFF] flex items-center justify-center">
                <nav className="fixed top-0 w-full z-50 bg-[#3a5433] shadow-xl">
                    <div className="max-w-6xl mx-auto flex items-center justify-between px-8 py-5">
                        <Link href="/" className="text-lg font-bold text-white tracking-wide">Sistema Salomão</Link>
                        <Link href="/" className="text-white/80 px-4 py-2 text-sm hover:text-white transition">Voltar</Link>
                    </div>
                </nav>

                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                    <SignUp
                        afterSignUpUrl="/auth/clerk-callback"
                        signInUrl="/login"
                        appearance={{
                            elements: {
                                rootBox: 'w-full',
                                card: 'shadow-none p-0',
                                headerTitle: 'text-2xl font-bold text-neutral-900',
                                headerSubtitle: 'text-sm text-neutral-500',
                                formButtonPrimary: 'bg-[#567c4b] hover:bg-[#3a5433] text-sm',
                                formFieldLabel: 'text-sm text-neutral-600',
                                formFieldInput: 'w-full px-4 py-3 rounded-lg border border-neutral-200 bg-[#F4FDFF] focus:ring-2 focus:ring-[#567c4b] focus:border-[#567c4b]',
                                footerActionLink: 'text-[#567c4b] hover:text-[#3a5433]',
                                dividerLine: 'bg-neutral-200',
                                dividerText: 'text-xs text-neutral-400',
                                socialButtonsBlockButton: 'border border-neutral-200 hover:bg-neutral-50 text-sm',
                            },
                        }}
                    />
                </div>
            </div>
        </>
    )
}
