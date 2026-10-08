// Appearance compartilhada do Clerk — mapeia as variáveis de design do Clerk
// para os tokens do tema (claro/escuro) e aplica os elementos estruturais.
// Uso: appearance={clerkAppearance()} em SignIn/SignUp e no ClerkProvider.

export const clerkVariables = {
    colorPrimary: 'var(--color-primary)',
    colorPrimaryText: 'var(--color-primary-fg)',
    colorText: 'var(--color-gray-800)',
    colorTextSecondary: 'var(--color-gray-500)',
    colorBackground: 'var(--color-surface)',
    colorInputBackground: 'var(--color-surface-elevated)',
    colorInputText: 'var(--color-gray-800)',
    colorNeutral: 'var(--color-gray-500)',
    colorDanger: 'var(--color-red-500)',
    colorSuccess: 'var(--color-primary)',
    borderRadius: '0.75rem',
    fontFamily: "'Inter', sans-serif",
}

export const clerkElements = {
    rootBox: 'w-full',
    card: 'shadow-none p-0 bg-transparent w-full',
    headerTitle: 'text-2xl font-bold text-gray-800',
    headerSubtitle: 'text-sm text-gray-500',
    formHeaderTitle: 'text-2xl font-bold text-gray-800',
    formHeaderSubtitle: 'text-sm text-gray-500',
    formButtonPrimary:
        'bg-primary hover:bg-primary-hover text-sm text-primary-fg font-semibold shadow-lg shadow-primary/15',
    formFieldLabel: 'text-sm font-medium text-gray-600',
    formFieldInput:
        'w-full px-4 py-3 rounded-xl border border-border bg-surface-elevated text-gray-800 placeholder-gray-400',
    footerActionLink: 'text-accent-text hover:opacity-80 font-medium',
    dividerLine: 'bg-border',
    dividerText: 'text-xs text-gray-500',
    socialButtonsBlockButton:
        'border border-border bg-surface hover:bg-surface-accent text-sm text-gray-700 rounded-xl',
    socialButtonsBlockButtonText: 'text-gray-700 font-medium',
    identityPreviewEditButton: 'text-accent-text font-medium',
    formResendCodeLink: 'text-accent-text font-medium',
    formFieldErrorText: 'text-xs text-red-400',
    alertText: 'text-sm text-gray-600',
}

export function clerkAppearance() {
    return {
        variables: clerkVariables,
        elements: clerkElements,
    }
}
