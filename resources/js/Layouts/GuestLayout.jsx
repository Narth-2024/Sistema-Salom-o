import { Link } from '@inertiajs/react'

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#F4FDFF]">
            <nav className="fixed top-0 w-full z-50 bg-[#3a5433] shadow-xl">
                <div className="max-w-6xl mx-auto flex items-center justify-between px-8 py-5">
                    <Link href="/" className="text-lg font-bold text-white tracking-wide">
                        Sistema Salomão
                    </Link>
                    <Link
                        href="/login"
                        className="bg-white text-[#567c4b] px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#e8f5e4] transition"
                    >
                        Acessar
                    </Link>
                </div>
            </nav>
            {children}
        </div>
    )
}
