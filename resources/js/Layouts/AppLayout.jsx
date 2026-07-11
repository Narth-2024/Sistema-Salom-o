import { Link, usePage } from '@inertiajs/react'
import { useAuth } from '@clerk/react'
import { LayoutDashboard, BarChart3, ArrowLeftRight, Tags, Hash, Settings as SettingsIcon, LogOut, Coins } from 'lucide-react'
import { FlashMessage } from '@/Components'
import Sidebar from '@/Components/Sidebar'
import { useEffect, useState } from 'react'

const SIDEBAR_KEY = 'salomao-sidebar'

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
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(SIDEBAR_KEY) === 'true'
        }
        return false
    })

    useEffect(() => {
        localStorage.setItem(SIDEBAR_KEY, sidebarCollapsed)
    }, [sidebarCollapsed])

    const sidebarMargin = sidebarCollapsed ? 'md:ml-16' : 'md:ml-56'

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
            {/* Desktop sidebar */}
            <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(c => !c)} />

            {/* Desktop top bar (minimal) */}
            <header className={`hidden md:flex sticky top-0 z-30 bg-surface/80 backdrop-blur-xl border-b border-gray-200/60 ${sidebarMargin} transition-all duration-200`}>
                <div className="flex items-center justify-end h-16 px-6 gap-3 flex-1">
                    <Link
                        href="/settings"
                        className={`p-2 rounded-xl transition-all duration-150 ${
                            isActive('/settings')
                                ? 'text-green-600 bg-green-600/10'
                                : 'text-gray-500 hover:text-gray-400 hover:bg-gray-100'
                        }`}
                    >
                        <SettingsIcon className="w-5 h-5" />
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-400 px-3 py-2 rounded-xl text-sm font-medium hover:bg-gray-100 transition-all duration-150 cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" />
                        Sair
                    </button>
                </div>
            </header>

            {/* Content area */}
            <div className={`pb-20 md:pb-0 ${sidebarMargin} transition-all duration-200`}>
                <div className="md:pt-0">
                    <FlashMessage />
                    <main>
                        {children}
                    </main>
                </div>
            </div>

            {/* Mobile top bar */}
            <nav className="md:hidden sticky top-0 z-30 bg-surface/80 backdrop-blur-xl border-b border-gray-200/60">
                <div className="flex items-center justify-between h-16 px-4">
                    <Link href="/dashboard" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-600/20 shrink-0">
                            <Coins className="w-[18px] h-[18px] text-white" />
                        </div>
                        <span className="text-green-600 font-bold text-lg tracking-tight">Salomão</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="text-gray-500 hover:text-gray-400 p-2 rounded-xl hover:bg-gray-100 transition cursor-pointer"
                        title="Sair"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </nav>

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
