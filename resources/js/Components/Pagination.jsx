import { Link } from '@inertiajs/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Card from './Card'

export default function Pagination({ meta, standalone = false }) {
    if (!meta || meta.last_page <= 1) return null

    const content = (
        <div className={`flex items-center justify-between px-4 sm:px-6 py-4 ${standalone ? '' : 'border-t border-border'}`}>
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
                                        ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
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
                                        ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
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
                                    ? 'bg-primary text-primary-fg'
                                    : link.url
                                        ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
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

    if (standalone) {
        return <Card padding={false} className="mt-6 overflow-hidden">{content}</Card>
    }

    return content
}
