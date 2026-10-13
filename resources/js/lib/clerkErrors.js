/**
 * Converte os erros do Clerk em mensagens que fazem sentido em português.
 *
 * A API do Clerk devolve chaves técnicas (`form_identifier_not_found`,
 * `form_param_format_invalid`...). Sem esse mapeamento o usuário vê o código
 * cru — que foi boa parte do que parecia "bugado" na versão anterior.
 */
const MESSAGES = {
    form_identifier_not_found: 'Email ou senha incorretos.',
    form_password_incorrect: 'Email ou senha incorretos.',
    form_param_format_invalid: 'Verifique os dados informados.',
    form_param_length_invalid: 'Valor muito curto ou muito longo.',
    form_code_incorrect: 'Código incorreto. Tente novamente.',
    form_code_expired: 'Código expirado. Solicite um novo.',
    form_identifier_exists: 'Já existe uma conta com este email.',
    form_identifier_exists_identifier: 'Já existe uma conta com este email.',
    password_minimum_length: 'A senha precisa ter no mínimo 8 caracteres.',
    password_complexity: 'A senha é muito simples. Use letras, números e símbolos.',
    too_many_attempts: 'Muitas tentativas. Aguarde alguns minutos e tente de novo.',
    session_expired: 'Sua sessão expirou. Entre novamente.',
    already_signed_in: 'Você já está conectado.',
    not_allowed_to_continue: 'Esta conta não pode continuar por aqui.',
    captcha_failed: 'Falha na verificação anti-robô. Tente novamente.',
    web_browser_not_supported: 'Este navegador não é suportado.',
}

const FALLBACK = 'Não foi possível continuar. Tente novamente.'

/**
 * @param {unknown} error  a exceção lançada pelo SDK do Clerk
 * @param {object} fallback  mensagem própria, usada quando o código é desconhecido
 */
export function clerkErrorMessage(error, fallback = FALLBACK) {
    const errors = error?.errors

    if (Array.isArray(errors) && errors.length > 0) {
        for (const item of errors) {
            const key = item?.longMessage || item?.message
            if (typeof key === 'string' && MESSAGES[key]) {
                return MESSAGES[key]
            }
            if (typeof key === 'string' && key.length > 0 && key.length < 160 && !key.includes('_')) {
                return key
            }
        }

        const first = errors[0]?.longMessage || errors[0]?.message
        if (typeof first === 'string' && first.length > 0 && first.length < 200) {
            return first
        }
    }

    return fallback
}

export default clerkErrorMessage
