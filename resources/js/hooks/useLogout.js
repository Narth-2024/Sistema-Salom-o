import { useClerk } from '@clerk/react'
import { router } from '@inertiajs/react'

/**
 * Encerra as DUAS sessões.
 *
 * O signOut do Clerk limpa a sessão de frontend, mas não derruba a do Laravel
 * (guard `web`). Se parássemos só no Clerk, o cookie de sessão continuaria
 * válido e o usuário voltaria logado no sistema.
 */
export default function useLogout() {
    const { signOut } = useClerk()

    return function logout(options = {}) {
        router.post('/logout', {}, {
            ...options,
            onFinish: () => {
                signOut({ redirectUrl: options.redirectUrl ?? '/' })
            },
        })
    }
}
