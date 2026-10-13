import { Head, Link, usePage } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout.jsx'
import { Card, Button, RecoveryCodeList } from '@/Components'
import { KeyRound, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react'

export default function RecoveryCodes() {
    const { flash } = usePage().props
    const codes = flash?.recoveryCodes

    return (
        <AppLayout>
            <Head title="Códigos de recuperação" />

            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <KeyRound className="w-7 h-7 text-accent-text" />
                        Códigos de recuperação
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Guarde estes códigos. Eles são a sua forma de recuperar a senha sem depender de email.
                    </p>
                </div>

                <Card>
                    {codes?.length ? (
                        <>
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-5">
                                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    Estes códigos são exibidos <strong>uma única vez</strong>. Copie e guarde em um
                                    lugar seguro (gerenciador de senhas, por exemplo). Depois de usados, não podem ser
                                    recuperados.
                                </p>
                            </div>

                            <RecoveryCodeList codes={codes} />

                            <div className="mt-6 pt-5 border-t border-border">
                                <Link href="/dashboard">
                                    <Button variant="primary" className="w-full">
                                        Já guardei, ir para a dashboard
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20 mb-5">
                                <ShieldCheck className="w-5 h-5 text-accent-text shrink-0 mt-0.5" aria-hidden="true" />
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    Seus códigos de recuperação já foram gerados, mas não podem ser exibidos de novo —
                                    apenas o hash fica salvo no sistema.
                                </p>
                            </div>

                            <p className="text-sm text-gray-600 mb-5">
                                Se você não salvou os códigos anteriores, gere um conjunto novo em{' '}
                                <Link href="/settings" className="text-accent-text hover:opacity-80 font-medium">
                                    Configurações
                                </Link>
                                . Os códigos antigos deixam de funcionar.
                            </p>

                            <Link href="/dashboard">
                                <Button variant="primary" className="w-full">
                                    Ir para a dashboard
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </>
                    )}
                </Card>
            </div>
        </AppLayout>
    )
}
