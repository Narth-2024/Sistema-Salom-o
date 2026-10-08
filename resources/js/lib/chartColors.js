export function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

export function hexToRgba(hex, alpha = 1) {
    const clean = hex.replace('#', '')
    const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean
    const num = parseInt(full, 16)
    const r = (num >> 16) & 255
    const g = (num >> 8) & 255
    const b = num & 255
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function chartColors() {
    return {
        income: cssVar('--color-chart-income'),
        expense: cssVar('--color-chart-expense'),
        balance: cssVar('--color-chart-balance'),
        text: cssVar('--color-gray-600'),
        muted: cssVar('--color-gray-500'),
        grid: cssVar('--color-border'),
        background: cssVar('--color-background'),
    }
}
