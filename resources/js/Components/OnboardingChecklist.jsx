import { useState } from 'react'
import { Link, usePage } from '@inertiajs/react'
import Card from './Card'
import { ArrowRight, CheckCircle2, ListChecks, X } from 'lucide-react'

export const ONBOARDING_STORAGE = {
    WELCOME: 'salomao-onboarding-welcome',
    DISMISSED: 'salomao-onboarding-dismissed',
}

export default function OnboardingChecklist() {
    const { onboarding } = usePage().props
    const [dismissed, setDismissed] = useState(
        () => localStorage.getItem(ONBOARDING_STORAGE.DISMISSED) === '1'
    )

    if (!onboarding?.inProgress || dismissed) return null

    const completed = onboarding.steps.filter(s => s.complete).length
    const nextIndex = onboarding.steps.findIndex(s => !s.complete)

    function dismiss() {
        localStorage.setItem(ONBOARDING_STORAGE.DISMISSED, '1')
        setDismissed(true)
    }

    return (
        <Card accent className="mb-6 sm:mb-8 animate-fade-in" data-tour="checklist">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                        <ListChecks className="w-4 h-4 text-accent-text" />
                        Comece por aqui
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {completed} de {onboarding.steps.length} passos concluídos
                    </p>
                </div>
                <button
                    onClick={dismiss}
                    title="Ocultar checklist"
                    className="text-gray-500 hover:text-gray-700 transition p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="h-1.5 w-full bg-gray-200 rounded-full mt-4 mb-5">
                <div
                    className="h-full bg-primary rounded-full transition duration-500"
                    style={{ width: `${onboarding.percentage}%` }}
                />
            </div>

            <ol className="space-y-2">
                {onboarding.steps.map((step, idx) => {
                    const isNext = idx === nextIndex
                    return (
                        <li
                            key={step.title}
                            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 border ${
                                isNext
                                    ? 'border-primary/40 bg-primary/[0.06]'
                                    : 'border-border'
                            }`}
                        >
                            <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                                    step.complete
                                        ? 'bg-primary text-primary-fg'
                                        : isNext
                                          ? 'bg-primary/15 text-accent-text'
                                          : 'bg-gray-200 text-gray-500'
                                }`}
                            >
                                {step.complete ? (
                                    <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                    <span className="text-xs font-semibold">{idx + 1}</span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p
                                    className={`text-sm ${
                                        step.complete
                                            ? 'text-gray-500 line-through'
                                            : 'text-gray-700 font-medium'
                                    }`}
                                >
                                    {step.title}
                                </p>
                                {isNext && step.description && (
                                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                                        {step.description}
                                    </p>
                                )}
                            </div>
                            {!step.complete && (
                                <Link
                                    href={step.link}
                                    className={`inline-flex items-center gap-1 text-xs font-semibold shrink-0 transition-colors ${
                                        isNext
                                            ? 'text-accent-text hover:text-accent-text-hover'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {step.cta}
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            )}
                        </li>
                    )
                })}
            </ol>
        </Card>
    )
}
