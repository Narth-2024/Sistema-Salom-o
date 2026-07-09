import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'salomao-theme'

export default function useTheme() {
    const [theme, setThemeState] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(STORAGE_KEY) || 'dark'
        }
        return 'dark'
    })

    useEffect(() => {
        const root = document.documentElement
        if (theme === 'light') {
            root.classList.add('light')
        } else {
            root.classList.remove('light')
        }
        localStorage.setItem(STORAGE_KEY, theme)
    }, [theme])

    const toggle = useCallback(() => {
        setThemeState(t => t === 'dark' ? 'light' : 'dark')
    }, [])

    const setTheme = useCallback((t) => {
        setThemeState(t)
    }, [])

    return { theme, toggle, setTheme, isDark: theme === 'dark' }
}
