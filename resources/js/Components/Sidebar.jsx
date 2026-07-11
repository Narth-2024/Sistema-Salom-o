import { Link, usePage } from '@inertiajs/react'
import { useAuth } from '@clerk/react'
import {
    LayoutDashboard, BarChart3, ArrowLeftRight, Tags, Hash,
    Settings, LogOut, ChevronLeft, ChevronRight, Coins,
} from 'lucide-react'

const navLinks = [
    { href: '/dashboard', label: 'Início', icon: LayoutDashboard },
    { href: '/analytics', label: 'Dashboard', icon: BarChart3 },
    { href: '/transactions', label: 'Transações', icon: ArrowLeftRight },
    { href: '/categories', label: 'Categorias', icon: Tags },
    { href: '/tags', label: 'Tags', icon: Hash },
]

export default function Sidebar({ collapsed, onToggle }) {
    const { signOut } = useAuth()
    const { url } = usePage()

    function isActive(href) {
        if (href === '/dashboard') return url === '/dashboard'
        return url.startsWith(href)
    }

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
        <aside className={`hidden md:flex flex-col fixed left-0 top-0 h-full z-40 bg-surface border-r border-gray-200/60 transition-all duration-200 ease-in-out ${collapsed ? 'w-16' : 'w-56'}`}>
            {/* Logo */}
            <div className={`flex items-center h-16 border-b border-gray-200/60 shrink-0 ${collapsed ? 'justify-center px-0' : 'px-4'}`}>
                <Link href="/dashboard" className="flex items-center gap-2.5 group">
                    <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-600/20 shrink-0">
                        <Coins className="w-[18px] h-[18px] text-white" />
                    </div>
                    {!collapsed && (
                        <span className="text-green-600 font-bold text-lg tracking-tight">Salomão</span>
                    )}
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col gap-0.5 p-2 overflow-y-auto">
                {navLinks.map(link => {
                    const active = isActive(link.href)
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                                collapsed ? 'justify-center px-0' : ''
                            } ${
                                active
                                    ? 'text-green-600 bg-green-600/10'
                                    : 'text-gray-500 hover:text-gray-400 hover:bg-gray-100'
                            }`}
                            title={collapsed ? link.label : undefined}
                        >
                            <link.icon className={`w-5 h-5 shrink-0 ${active ? 'text-green-600' : ''}`} />
                            {!collapsed && <span>{link.label}</span>}
                            {active && !collapsed && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-600" />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom: Settings + Logout + Toggle */}
            <div className="border-t border-gray-200/60 p-2 flex flex-col gap-0.5">
                <Link
                    href="/settings"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                        collapsed ? 'justify-center px-0' : ''
                    } ${
                        isActive('/settings')
                            ? 'text-green-600 bg-green-600/10'
                            : 'text-gray-500 hover:text-gray-400 hover:bg-gray-100'
                    }`}
                    title={collapsed ? 'Ajustes' : undefined}
                >
                    <Settings className="w-5 h-5 shrink-0" />
                    {!collapsed && <span>Ajustes</span>}
                </Link>
                <button
                    onClick={handleLogout}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-400 hover:bg-gray-100 transition-all duration-150 cursor-pointer ${
                        collapsed ? 'justify-center px-0' : ''
                    }`}
                    title={collapsed ? 'Sair' : undefined}
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    {!collapsed && <span>Sair</span>}
                </button>

                <button
                    onClick={onToggle}
                    className="flex items-center justify-center w-full py-2 rounded-xl text-gray-400 hover:text-gray-300 hover:bg-gray-100 transition-all duration-150 cursor-pointer mt-1"
                    title={collapsed ? 'Expandir' : 'Recolher'}
                >
                    {collapsed ? (
                        <ChevronRight className="w-4 h-4" />
                    ) : (
                        <ChevronLeft className="w-4 h-4" />
                    )}
                </button>
            </div>
        </aside>
    )
}
