import { useEffect, useState } from 'react'

/**
 * Espelha o tema do sistema (classe `.light` no <html>) para o SDK do Clerk.
 * O useTheme grava a escolha do usuário na classe, então observar a classe é
 * o que mantém o widget de login na mesma paleta do resto do app.
 */
export default function useColorScheme() {
    const read = () => (
        typeof document !== 'undefined'
        && !document.documentElement.classList.contains('light')
            ? 'dark'
            : 'light'
    )

    const [scheme, setScheme] = useState(read)

    useEffect(() => {
        const observer = new MutationObserver(read)

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        })

        return () => observer.disconnect()
    }, [])

    return scheme
}
