import { Link, usePage } from '@inertiajs/react'
import { useAuth } from '@clerk/clerk-react'
import { Tags, ArrowLeftRight, LogOut, Coins, BarChart3, LayoutDashboard, Hash, Settings as SettingsIcon } from 'lucide-react'
import { FlashMessage } from '@/Components'

const navLinks = [
    { href: '/dashboard', label: 'Início', icon: LayoutDashboard },
    { href: '/analytics', label: 'Dashboard', icon: BarChart3 },
    { href: '/transactions', label: 'Transações', icon: ArrowLeftRight },
    { href: '/categories', label: 'Categorias', icon: Tags },
    { href: '/tags', label: 'Tags', icon: Hash },
]

export default function AppLayout({ children }) {
    const { signOut } = useAuth()
    const { url } = usePage()

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

    function isActive(href) {
        if (href === '/dashboard') return url === '/dashboard'
        return url.startsWith(href)
    }

    return (
        <div className="min-h-screen bg-background">
            <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-gray-200/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/dashboard" className="flex items-center gap-2.5 group">
                            <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-600/20 group-hover:shadow-green-600/30 group-hover:scale-105 transition-all duration-200">
                                <Coins className="w-[18px] h-[18px] text-white" />
                            </div>
                            <span className="text-green-600 font-bold text-lg tracking-tight">Salomão</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map(link => {
                                const active = isActive(link.href)
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                                            active
                                                ? 'text-green-600 bg-green-600/10'
                                                : 'text-gray-500 hover:text-gray-400 hover:bg-gray-100'
                                        }`}
                                    >
                                        <link.icon className={`w-4 h-4 ${active ? 'text-green-600' : ''}`} />
                                        {link.label}
                                        {active && (
                                            <span className="absolute -bottom-[9px] left-1/2 -translate-x-1/2 w-6 h-[2px] bg-green-600 rounded-full" />
                                        )}
                                    </Link>
                                )
                            })}
                            <Link
                                href="/settings"
                                className={`p-2 rounded-xl transition-all duration-150 ${
                                    isActive('/settings')
                                        ? 'text-green-600 bg-green-600/10'
                                        : 'text-gray-500 hover:text-gray-400 hover:bg-gray-100'
                                }`}
                            >
                                <SettingsIcon className="w-4 h-4" />
                            </Link>
                            <div className="w-px h-5 bg-gray-200 mx-1" />
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-gray-500 hover:text-gray-400 px-3 py-2 rounded-xl text-sm font-medium hover:bg-gray-100 transition-all duration-150 cursor-pointer"
                            >
                                <LogOut className="w-4 h-4" />
                                Sair
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <FlashMessage />
            <div className="pb-20 md:pb-0">
                {children}
            </div>

            {/* Bottom navigation — mobile only */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl border-t border-gray-200/60" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
                <div className="flex items-center justify-around h-16 px-1">
                    {navLinks.map(link => {
                        const active = isActive(link.href)
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex flex-col items-center justify-center gap-0.5 px-1 py-1.5 rounded-xl min-w-0 flex-1 transition-all duration-150 ${
                                    active ? 'text-green-600' : 'text-gray-500'
                                }`}
                            >
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-150 ${
                                    active ? 'bg-green-600/10' : ''
                                }`}>
                                    <link.icon className={`w-5 h-5 ${active ? 'text-green-600' : ''}`} />
                                </div>
                                <span className={`text-[10px] font-medium leading-tight ${
                                    active ? 'text-green-600' : 'text-gray-500'
                                }`}>
                                    {link.label}
                                </span>
                            </Link>
                        )
                    })}
                    <Link
                        href="/settings"
                        className={`flex flex-col items-center justify-center gap-0.5 px-1 py-1.5 rounded-xl min-w-0 flex-1 transition-all duration-150 ${
                            isActive('/settings') ? 'text-green-600' : 'text-gray-500'
                        }`}
                    >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-150 ${
                            isActive('/settings') ? 'bg-green-600/10' : ''
                        }`}>
                            <SettingsIcon className={`w-5 h-5 ${isActive('/settings') ? 'text-green-600' : ''}`} />
                        </div>
                        <span className={`text-[10px] font-medium leading-tight ${
                            isActive('/settings') ? 'text-green-600' : 'text-gray-500'
                        }`}>
                            Ajustes
                        </span>
                    </Link>
                </div>
            </nav>
        </div>
    )
}
