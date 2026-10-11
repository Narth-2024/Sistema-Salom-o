import { Link } from '@inertiajs/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Card from './Card'

export default function Pagination({ meta, standalone = false }) {
    if (!meta || meta.last_page <= 1) return null

    // Link clicável vs span inerte (desabilitado). O `<span>` evita que
    // o item sem URL seja focável e navegue para "#".
    function Item({ link, className, children, ariaLabel }) {
        if (!link.url) {
            return (
                <span
                    aria-disabled="true"
                    aria-label={ariaLabel}
                    className={`${className} text-gray-400 cursor-default`}
                >
                    {children}
                </span>
            )
        }
        return (
            <Link
                href={link.url}
                preserveState
                preserveScroll
                aria-label={ariaLabel}
                aria-current={link.active ? 'page' : undefined}
                className={`${className} text-gray-500 hover:text-gray-700 hover:bg-gray-100`}
            >
                {children}
            </Link>
        )
    }

    const content = (
        <nav aria-label="Paginação" className={`flex items-center justify-between px-4 sm:px-6 py-4 ${standalone ? '' : 'border-t border-border'}`}>
            <p className="text-sm text-gray-500">
                Mostrando {meta.from} a {meta.to} de {meta.total} registro(s)
            </p>

            <div className="flex items-center gap-1">
                {meta.links.map((link, i) => {
                    if (link.label === 'pagination.previous' || link.label === '&laquo; Previous') {
                        return (
                            <Item
                                key={i}
                                link={link}
                                ariaLabel="Página anterior"
                                className="p-2 rounded-lg text-sm transition"
                            >
                                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                            </Item>
                        )
                    }

                    if (link.label === 'pagination.next' || link.label === 'Next &raquo;') {
                        return (
                            <Item
                                key={i}
                                link={link}
                                ariaLabel="Próxima página"
                                className="p-2 rounded-lg text-sm transition"
                            >
                                <ChevronRight className="w-4 h-4" aria-hidden="true" />
                            </Item>
                        )
                    }

                    return (
                        <Item
                            key={i}
                            link={link}
                            ariaLabel={link.active ? `Página ${link.label}, atual` : `Página ${link.label}`}
                            className={`min-w-[32px] h-8 flex items-center justify-center rounded-lg text-sm font-medium transition ${
                                link.active ? 'bg-primary text-primary-fg' : ''
                            }`}
                        >
                            {link.label}
                        </Item>
                    )
                })}
            </div>
        </nav>
    )

    if (standalone) {
        return <Card padding={false} className="mt-6 overflow-hidden">{content}</Card>
    }

    return content
}
