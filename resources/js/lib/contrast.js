// Escolhe texto preto ou branco conforme o contraste com o fundo.
// Usa a luminância relativa (WCAG) para decidir qual cor de texto garante
// melhor legibilidade sobre um fundo arbitrário (ex.: cor da tag).

function relativeLuminance([r, g, b]) {
    const [rs, gs, bs] = [r, g, b].map(v => {
        const s = v / 255
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function parseHex(hex) {
    if (typeof hex !== 'string') return null
    let h = hex.trim().replace('#', '')
    if (h.length === 3) h = h.split('').map(c => c + c).join('')
    if (h.length !== 6) return null
    const n = parseInt(h, 16)
    if (Number.isNaN(n)) return null
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

// Retorna '#000000' ou '#ffffff' — a cor com maior contraste sobre o fundo.
export function contrastText(hex) {
    const rgb = parseHex(hex)
    if (!rgb) return '#ffffff'
    const lum = relativeLuminance(rgb)
    // Limiar de luminância: acima disso o fundo é claro → texto escuro.
    return lum > 0.179 ? '#000000' : '#ffffff'
}
