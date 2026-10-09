import { Head, Link } from '@inertiajs/react'
import { ArrowLeft } from 'lucide-react'

export default function AuthShell({ title, children, cardClassName = 'p-8' }) {
    return (
        <>
            <Head title={title} />
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-border">
                    <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-8 h-16">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                                <svg className="w-4 h-4 text-primary-fg" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
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

                <div className={`bg-surface rounded-2xl shadow-xl w-full max-w-md border border-border ${cardClassName}`}>
                    {children}
                </div>
            </div>
        </>
    )
}
