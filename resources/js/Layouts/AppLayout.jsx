import { Link } from '@inertiajs/react'
import { useAuth } from '@clerk/clerk-react'
import { LayoutDashboard, Tags, ArrowLeftRight, LogOut, Coins, BarChart3, Home } from 'lucide-react'

const navLinks = [
    { href: '/dashboard', label: 'Início', icon: Home },
    { href: '/analytics', label: 'Dashboard', icon: BarChart3 },
    { href: '/categories', label: 'Categorias', icon: Tags },
    { href: '/transactions', label: 'Transações', icon: ArrowLeftRight },
]

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
        <div className="min-h-screen bg-background">
            <nav className="bg-green-800 shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/dashboard" className="flex items-center gap-2 text-white font-bold text-lg tracking-wide hover:opacity-90 transition">
                            <Coins className="w-6 h-6" />
                            Salomão
                        </Link>

                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map(link => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="flex items-center gap-2 text-white/80 hover:text-white px-3 py-2 rounded-xl text-sm font-medium hover:bg-white/10 transition"
                                >
                                    <link.icon className="w-4 h-4" />
                                    {link.label}
                                </Link>
                            ))}
                            <div className="w-px h-6 bg-white/20 mx-2" />
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-white/80 hover:text-white px-3 py-2 rounded-xl text-sm font-medium hover:bg-white/10 transition cursor-pointer"
                            >
                                <LogOut className="w-4 h-4" />
                                Sair
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            {children}
        </div>
    )
}
