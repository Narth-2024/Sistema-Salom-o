import { useEffect, useState } from 'react'
import { Link, usePage } from '@inertiajs/react'
import Modal from './Modal'
import Button from './Button'
import { ONBOARDING_STORAGE } from './OnboardingChecklist'
import { ArrowLeftRight, LineChart, Tags } from 'lucide-react'

const features = [
    { icon: Tags, title: 'Categorias e tags', desc: 'Organize receitas e despesas do seu jeito.' },
    { icon: ArrowLeftRight, title: 'Transações', desc: 'Registre entradas e saídas em segundos.' },
    { icon: LineChart, title: 'Analytics', desc: 'Acompanhe gráficos e compare meses.' },
]

export default function OnboardingWelcome() {
    const { onboarding } = usePage().props
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (
            onboarding?.inProgress &&
            localStorage.getItem(ONBOARDING_STORAGE.WELCOME) !== '1' &&
            localStorage.getItem(ONBOARDING_STORAGE.DISMISSED) !== '1'
        ) {
            setOpen(true)
        }
    }, [onboarding?.inProgress])

    if (!onboarding?.inProgress) return null

    function close() {
        localStorage.setItem(ONBOARDING_STORAGE.WELCOME, '1')
        setOpen(false)
    }

    const nextStep = onboarding.steps.find(s => !s.complete)

    return (
        <Modal open={open} onClose={close} title="Bem-vindo ao Salomão!">
            <p className="text-sm text-gray-500 mb-5">
                Seu controle financeiro pessoal em um só lugar. Complete os passos abaixo e
                você terá tudo configurado.
            </p>

            <div className="space-y-3 mb-6">
                {features.map(f => (
                    <div
                        key={f.title}
                        className="flex items-start gap-3 rounded-xl border border-gray-200/60 px-3 py-2.5"
                    >
                        <div className="w-8 h-8 rounded-lg bg-green-600/10 text-green-600 flex items-center justify-center shrink-0 ring-1 ring-white/5">
                            <f.icon className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">{f.title}</p>
                            <p className="text-xs text-gray-500">{f.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-end gap-3">
                <Button variant="ghost" onClick={close}>
                    Pular
                </Button>
                {nextStep && (
                    <Link href={nextStep.link} onClick={close}>
                        <Button variant="primary">{nextStep.cta}</Button>
                    </Link>
                )}
            </div>
        </Modal>
    )
}
