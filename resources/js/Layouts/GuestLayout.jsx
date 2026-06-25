import { Link } from '@inertiajs/react'
import { Coins } from 'lucide-react'

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-background">
            <nav className="fixed top-0 w-full z-50 bg-green-800 shadow-xl">
                <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-8 h-16">
                    <Link href="/" className="flex items-center gap-2 text-lg font-bold text-white tracking-wide">
                        <Coins className="w-6 h-6" />
                        Salomão
                    </Link>
                    <Link
                        href="/login"
                        className="bg-white text-green-700 px-5 py-2 rounded-xl text-sm font-medium hover:bg-green-50 transition shadow-sm"
                    >
                        Acessar
                    </Link>
                </div>
            </nav>
            {children}
        </div>
    )
}
