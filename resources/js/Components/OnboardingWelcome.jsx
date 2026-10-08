import { useEffect, useState } from 'react'
import { Link, usePage } from '@inertiajs/react'
import Modal from './Modal'
import Button from './Button'
import { ONBOARDING_STORAGE } from './OnboardingChecklist'
import {
    ArrowLeft, ArrowLeftRight, ArrowRight, Hash, LineChart,
    Rocket, Sparkles, Tags, CircleHelp,
} from 'lucide-react'

export const OPEN_TOUR_EVENT = 'salomao:open-tour'

const tourSteps = [
    {
        icon: Sparkles,
        title: 'Bem-vindo ao Salomão',
        desc: 'Seu controle financeiro pessoal: registre receitas e despesas, organize por categorias e acompanhe gráficos — tudo em um só lugar.',
        bullets: [
            'Este tour leva menos de 1 minuto',
            'Você pode reassistir a qualquer momento pelo botão ? no canto da tela',
        ],
    },
    {
        icon: Tags,
        title: '1. Crie suas categorias',
        desc: 'Categorias agrupam o seu dinheiro: “Alimentação”, “Transporte”, “Salário”... É o que permite o gráfico de rosca do Dashboard mostrar para onde seu dinheiro está indo.',
        bullets: [
            'Comece por 3 a 5 categorias do dia a dia',
            'Dê uma cor diferente para cada uma',
            'Depois é só vincular as categorias às transações',
        ],
    },
    {
        icon: ArrowLeftRight,
        title: '2. Registre suas transações',
        desc: 'Cada entrada (+) ou saída (-) vira uma transação com valor, data e categoria. É a matéria-prima de todos os gráficos e relatórios.',
        bullets: [
            'Receitas somam, despesas subtraem — o saldo aparece na hora',
            'Use a descrição para detalhar (ex: “feira da semana”)',
            'Filtre e busque tudo na página de Transações',
        ],
    },
    {
        icon: Hash,
        title: '3. Organize com tags',
        desc: 'Tags são rótulos livres que cruzam suas transações de formas que categorias não cobrem — como “assinatura”, “imposto” ou “viagem”.',
        bullets: [
            'Uma transação pode ter várias tags',
            'Filtre por tag na página de Transações',
            'Opcional, mas deixa a análise muito mais forte',
        ],
    },
    {
        icon: LineChart,
        title: '4. Acompanhe seus resultados',
        desc: 'Com dados registrados, o Dashboard e o Analytics mostram a saúde das suas finanças: resumo do mês, despesas por categoria, evolução e saldo acumulado.',
        bullets: [
            'Dashboard: visão rápida e últimas transações',
            'Analytics: barras mensais, linha de saldo e comparação de períodos',
        ],
    },
    {
        icon: Rocket,
        title: 'Pronto para começar!',
        desc: 'Siga o checklist “Comece por aqui” na Dashboard — ele acompanha seu progresso e some sozinho quando tudo estiver feito.',
        bullets: [],
        isFinal: true,
    },
]

export default function OnboardingWelcome() {
    const { onboarding } = usePage().props
    const [open, setOpen] = useState(false)
    const [step, setStep] = useState(0)

    function openTour() {
        setStep(0)
        setOpen(true)
    }

    function close() {
        localStorage.setItem(ONBOARDING_STORAGE.WELCOME, '1')
        setOpen(false)
    }

    useEffect(() => {
        if (
            onboarding?.inProgress &&
            localStorage.getItem(ONBOARDING_STORAGE.WELCOME) !== '1' &&
            localStorage.getItem(ONBOARDING_STORAGE.DISMISSED) !== '1'
        ) {
            openTour()
        }
    }, [onboarding?.inProgress])

    useEffect(() => {
        window.addEventListener(OPEN_TOUR_EVENT, openTour)
        return () => window.removeEventListener(OPEN_TOUR_EVENT, openTour)
    }, [])

    if (!onboarding) return null

    const nextStep = onboarding.steps.find(s => !s.complete)
    const current = tourSteps[step]
    const isLast = step === tourSteps.length - 1
    const Icon = current.icon

    return (
        <>
            {/* Floating help button — available on every page, any time */}
            <button
                onClick={openTour}
                title="Assistir o tour novamente"
                aria-label="Assistir o tour novamente"
                className="fixed z-40 right-4 bottom-24 md:bottom-6 w-12 h-12 rounded-full bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-600/30 flex items-center justify-center transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer"
            >
                <CircleHelp className="w-6 h-6" />
                {onboarding.inProgress && (
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-amber-500 border-2 border-background rounded-full" />
                )}
            </button>

            <Modal open={open} onClose={close} title="Tour pelo Salomão">
                <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-3">
                    Passo {step + 1} de {tourSteps.length}
                </p>

                <div className="flex items-start gap-3.5 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-green-600/10 text-green-600 flex items-center justify-center shrink-0 ring-1 ring-green-600/20">
                        <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-base font-semibold text-gray-800 leading-snug">
                            {current.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                            {current.desc}
                        </p>
                    </div>
                </div>

                {current.bullets.length > 0 && (
                    <ul className="space-y-2 mb-5">
                        {current.bullets.map(b => (
                            <li key={b} className="flex items-start gap-2.5 text-sm text-gray-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2 shrink-0" />
                                {b}
                            </li>
                        ))}
                    </ul>
                )}

                <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-200/60">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                            {tourSteps.map((_, i) => (
                                <span
                                    key={i}
                                    className={`h-1.5 rounded-full transition-all duration-200 ${
                                        i === step ? 'w-4 bg-green-600' : 'w-1.5 bg-gray-300'
                                    }`}
                                />
                            ))}
                        </div>
                        <button
                            onClick={close}
                            className="text-xs text-gray-500 hover:text-gray-400 font-medium transition cursor-pointer"
                        >
                            Pular tour
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        {step > 0 && (
                            <Button variant="ghost" size="sm" onClick={() => setStep(s => s - 1)}>
                                <ArrowLeft className="w-3.5 h-3.5" />
                                Anterior
                            </Button>
                        )}
                        {!isLast && (
                            <Button variant="primary" size="sm" onClick={() => setStep(s => s + 1)}>
                                Próximo
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Button>
                        )}
                        {isLast && (nextStep ? (
                            <Link href={nextStep.link} onClick={close}>
                                <Button variant="primary" size="sm">
                                    {nextStep.cta}
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Button>
                            </Link>
                        ) : (
                            <Button variant="primary" size="sm" onClick={close}>
                                Concluir
                            </Button>
                        ))}
                    </div>
                </div>
            </Modal>
        </>
    )
}
