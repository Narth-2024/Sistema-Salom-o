import { Head, Link } from '@inertiajs/react'
import { SignUp } from '@clerk/react'
import { ArrowLeft } from 'lucide-react'

export default function Register() {
    return (
        <>
            <Head title="Criar conta" />
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-gray-200">
                    <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-8 h-16">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-500 rounded-lg flex items-center justify-center shadow-sm">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                                </svg>
                            </div>
                            <span className="text-lg font-bold text-gray-800 tracking-tight">Salomão</span>
                        </Link>
                        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition font-medium">
                            <ArrowLeft className="w-4 h-4" />
                            Voltar
                        </Link>
                    </div>
                </nav>

                <div className="bg-surface rounded-2xl shadow-xl w-full max-w-md p-8 border border-gray-200/50">
                    <SignUp
                        afterSignUpUrl="/auth/clerk-callback"
                        signInUrl="/login"
                        appearance={{
                            elements: {
                                rootBox: 'w-full',
                                card: 'shadow-none p-0',
                                headerTitle: 'text-2xl font-bold text-gray-800',
                                headerSubtitle: 'text-sm text-gray-500',
                                formButtonPrimary: 'bg-green-600 hover:bg-green-700 text-sm text-white font-semibold',
                                formFieldLabel: 'text-sm text-gray-600',
                                formFieldInput: 'w-full px-4 py-3 rounded-xl border border-gray-200 bg-surface-elevated text-gray-800 focus:ring-2 focus:ring-green-600/30 focus:border-green-600 placeholder-gray-400',
                                footerActionLink: 'text-green-600 hover:text-green-700 font-medium',
                                dividerLine: 'bg-gray-200',
                                dividerText: 'text-xs text-gray-400',
                                socialButtonsBlockButton: 'border border-gray-200 bg-surface hover:bg-surface-accent text-sm text-gray-700 rounded-xl',
                                socialButtonsBlockButtonText: 'text-gray-700 font-medium',
                                formHeaderTitle: 'text-2xl font-bold text-gray-800',
                                formHeaderSubtitle: 'text-sm text-gray-500',
                            },
                        }}
                    />
                </div>
            </div>
        </>
    )
}
