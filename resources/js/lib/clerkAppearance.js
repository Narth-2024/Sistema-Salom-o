/**
 * Aparência dos widgets do Clerk, nas cores do sistema.
 *
 * O cabeçalho do Clerk é escondido porque o AuthShell já renderiza título e
 * subtítulo — deixar os dois geraria texto duplicado.
 */
const VARIABLES = {
    dark: {
        colorPrimary: '#3ecf8e',
        colorPrimaryHover: '#66e2a8',
        colorBackground: '#1c1c20',
        colorInputBackground: '#24242a',
        colorInputText: '#e4e4e7',
        colorText: '#f4f4f5',
        colorTextSecondary: '#a1a1aa',
        colorNeutral: '#27272a',
        colorDanger: '#f87171',
        colorSuccess: '#3ecf8e',
        colorWarning: '#fbbf24',
        borderRadius: '0.75rem',
    },
    light: {
        colorPrimary: '#047857',
        colorPrimaryHover: '#065f46',
        colorBackground: '#ffffff',
        colorInputBackground: '#f5f2ec',
        colorInputText: '#1f2937',
        colorText: '#111827',
        colorTextSecondary: '#6b7280',
        colorNeutral: '#e5e7eb',
        colorDanger: '#dc2626',
        colorSuccess: '#047857',
        colorWarning: '#d97706',
        borderRadius: '0.75rem',
    },
}

export function clerkAppearance(colorScheme = 'dark') {
    return {
        variables: VARIABLES[colorScheme] ?? VARIABLES.dark,
        elements: {
            rootBox: 'w-full',
            card: 'w-full max-w-none bg-transparent shadow-none border-0 p-0 text-left',
            headerTitle: 'hidden',
            headerSubtitle: 'hidden',
            footerLine: 'hidden',
            footerActionText: 'text-sm',
            formFieldInput: 'rounded-xl',
            formButtonPrimary: 'rounded-xl font-semibold',
            socialButtonsBlockButton: 'rounded-xl',
            otpCodeFieldInput: 'rounded-xl',
        },
    }
}

export default clerkAppearance
