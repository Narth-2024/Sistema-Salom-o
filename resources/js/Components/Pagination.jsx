import { Link } from '@inertiajs/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ meta }) {
    if (!meta || meta.last_page <= 1) return null

    return (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
                Mostrando {meta.from} a {meta.to} de {meta.total} registro(s)
            </p>

            <div className="flex items-center gap-1">
                {meta.links.map((link, i) => {
                    if (link.label === 'pagination.previous' || link.label === '&laquo; Previous') {
                        return (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                preserveState
                                preserveScroll
                                className={`p-2 rounded-lg text-sm transition ${
                                    link.url
                                        ? 'text-gray-500 hover:text-gray-400 hover:bg-gray-100'
                                        : 'text-gray-400 cursor-default pointer-events-none'
                                }`}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Link>
                        )
                    }

                    if (link.label === 'pagination.next' || link.label === 'Next &raquo;') {
                        return (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                preserveState
                                preserveScroll
                                className={`p-2 rounded-lg text-sm transition ${
                                    link.url
                                        ? 'text-gray-500 hover:text-gray-400 hover:bg-gray-100'
                                        : 'text-gray-400 cursor-default pointer-events-none'
                                }`}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        )
                    }

                    return (
                        <Link
                            key={i}
                            href={link.url || '#'}
                            preserveState
                            preserveScroll
                            className={`min-w-[32px] h-8 flex items-center justify-center rounded-lg text-sm font-medium transition ${
                                link.active
                                    ? 'bg-green-600 text-white'
                                    : link.url
                                        ? 'text-gray-500 hover:text-gray-400 hover:bg-gray-100'
                                        : 'text-gray-400 cursor-default pointer-events-none'
                            }`}
                        >
                            {link.label}
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
