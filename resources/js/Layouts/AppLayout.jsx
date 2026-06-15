import { Link } from '@inertiajs/react'
import { useAuth } from '@clerk/clerk-react'

export default function AppLayout({ children }) {
    const { signOut } = useAuth()

    async function handleLogout() {
        await fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
            },
        })
        await signOut()
        window.location.href = '/'
    }

    return (
        <div className="bg-[#F4FDFF] min-h-screen">
            <nav className="bg-[#3a5433] shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/dashboard" className="text-white font-bold text-lg tracking-wide hover:opacity-90 transition">
                        Sistema Salomão
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link href="/dashboard" className="text-white/80 hover:text-white text-sm font-medium transition">
                            Dashboard
                        </Link>
                        <Link href="/categories" className="text-white/80 hover:text-white text-sm font-medium transition">
                            Categorias
                        </Link>
                        <Link href="/transactions" className="text-white/80 hover:text-white text-sm font-medium transition">
                            Transações
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="bg-white/10 text-white/80 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 hover:text-white transition cursor-pointer"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </nav>
            {children}
        </div>
    )
}
