// Converte o que o usuário digitou para o formato numérico com ponto,
// aceitando vírgula decimal ("12,50"), milhar ("1.234,56") e ponto ("12.50").
export function toNumberString(raw) {
    if (raw === null || raw === undefined) return ''
    let s = String(raw).trim().replace(/\s/g, '').replace(/R\$/gi, '')
    if (s === '') return ''

    const hasComma = s.includes(',')
    const hasDot = s.includes('.')

    if (hasComma && hasDot) {
        // Formato BR: 1.234,56 -> remove pontos, vírgula vira ponto
        s = s.replace(/\./g, '').replace(',', '.')
    } else if (hasComma) {
        // Só vírgula: assume decimal -> 12,50 -> 12.50
        s = s.replace(',', '.')
    }
    // Só ponto: já é numérico com ponto

    // Mantém apenas dígitos e um ponto decimal
    s = s.replace(/[^0-9.]/g, '')
    const parts = s.split('.')
    if (parts.length > 2) {
        s = parts[0] + '.' + parts.slice(1).join('')
    }
    return s
}

// Formata para exibição amigável com vírgula decimal (usado em inputs).
export function formatForInput(raw) {
    const normalized = toNumberString(raw)
    if (normalized === '') return ''
    return normalized.replace('.', ',')
}
