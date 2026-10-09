// Converte erros do Clerk em mensagens em PT-BR.
// Códigos: https://clerk.com/docs/references/javascript/types/clerk-error
const MESSAGES = {
    form_identifier_not_found: 'Email não encontrado.',
    form_password_incorrect: 'Email ou senha incorretos.',
    form_identifier_exists: 'Este email já está em uso.',
    identifier_already_exists: 'Este email já está em uso.',
    form_param_format_invalid: 'Formato inválido.',
    form_param_nil: 'Preencha todos os campos.',
    password_requirements_failed: 'A senha não atende aos requisitos (mínimo de 8 caracteres).',
    form_password_pwned: 'Esta senha foi exposta em uma vazamento de dados. Escolha outra.',
    password_pwned: 'Esta senha foi exposta em uma vazamento de dados. Escolha outra.',
    verification_code_expired: 'O código expirou. Solicite um novo.',
    form_code_incorrect: 'Código incorreto.',
    verification_failed: 'Código incorreto ou verificação falhou.',
    form_identifier_not_found_for_phone_number: 'Número não encontrado.',
    too_many_requests: 'Muitas tentativas. Aguarde um pouco e tente novamente.',
    session_exists: 'Você já está autenticado.',
    form_param_format_invalid__first_name: 'Informe um nome válido.',
    form_param_format_invalid__last_name: 'Informe um sobrenome válido.',
    form_param_format_invalid__email_address: 'Formato de email inválido.',
    form_param_format_invalid__password: 'A senha não atende aos requisitos (mínimo de 8 caracteres).',
    password_complexity_failed: 'A senha é muito simples. Use letras, números e no mínimo 8 caracteres.',
    verification_expired: 'O código expirou. Solicite um novo.',
    already_signed_in: 'Você já está logado. Faça logout para criar outra conta.',
    clerk_error: 'Não foi possível concluir. Tente novamente.',
}

export function clerkErrorMessage(err) {
    const first = err?.errors?.[0]
    if (!first) {
        return 'Algo deu errado. Tente novamente.'
    }
    return MESSAGES[first.code] || first.longMessage || 'Algo deu errado. Tente novamente.'
}
