import { useEffect, useState } from 'react'
import { usePage } from '@inertiajs/react'
import Modal from './Modal'
import Button from './Button'
import { ONBOARDING_STORAGE } from './OnboardingChecklist'
import { startAppTour } from '@/tour/AppTour'
import { ArrowRight, Rocket, CircleHelp, Tags, ArrowLeftRight, Hash, LineChart } from 'lucide-react'

export default function OnboardingWelcome() {
    const { onboarding } = usePage().props
    const [open, setOpen] = useState(false)

    function close() {
        localStorage.setItem(ONBOARDING_STORAGE.WELCOME, '1')
        setOpen(false)
    }

    function startTour() {
        close()
        startAppTour()
    }

    useEffect(() => {
        if (
            onboarding?.inProgress &&
            localStorage.getItem(ONBOARDING_STORAGE.WELCOME) !== '1' &&
            localStorage.getItem(ONBOARDING_STORAGE.DISMISSED) !== '1'
        ) {
            setOpen(true)
        }
    }, [onboarding?.inProgress])

    if (!onboarding) return null

    const tourPages = [
        { icon: Tags, label: 'Categorias — organize seu dinheiro' },
        { icon: ArrowLeftRight, label: 'Transações — registre entradas e saídas' },
        { icon: Hash, label: 'Tags — rótulos flexíveis' },
        { icon: LineChart, label: 'Analytics — gráficos e comparações' },
    ]

    return (
        <>
            <button
                onClick={() => startAppTour()}
                title="Assistir o tour novamente"
                aria-label="Assistir o tour novamente"
                className="fixed z-40 right-4 bottom-24 md:bottom-6 w-12 h-12 rounded-full bg-primary hover:bg-primary-hover text-primary-fg shadow-lg shadow-primary/30 flex items-center justify-center transition duration-150 hover:scale-105 active:scale-95 cursor-pointer"
            >
                <CircleHelp className="w-6 h-6" />
                {onboarding.inProgress && (
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-amber-500 border-2 border-background rounded-full" />
                )}
            </button>

            <Modal open={open} onClose={close} title="Tour guiado pelo Salomão">
                <div className="flex items-start gap-3.5 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 text-accent-text flex items-center justify-center shrink-0 ring-1 ring-primary/20">
                        <Rocket className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-base font-semibold text-gray-800 leading-snug">
                            Vamos passear pelo sistema
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                            O tour navega até cada tela e destaca o que é importante em cada uma — você
                            acompanha sem se perder.
                        </p>
                    </div>
                </div>

                <ul className="space-y-2 mb-5">
                    {tourPages.map(page => {
                        const Icon = page.icon
                        return (
                            <li key={page.label} className="flex items-center gap-2.5 text-sm text-gray-700">
                                <span className="w-7 h-7 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center shrink-0">
                                    <Icon className="w-4 h-4" />
                                </span>
                                {page.label}
                            </li>
                        )
                    })}
                </ul>

                <p className="text-xs text-gray-500 mb-1">
                    Menos de 2 minutos — você pode pular ou reassistir quando quiser pelo botão ? da tela.
                </p>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200/60">
                    <Button variant="ghost" size="sm" onClick={close}>
                        Agora não
                    </Button>
                    <Button variant="primary" size="sm" onClick={startTour}>
                        Iniciar tour
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </Modal>
        </>
    )
}
