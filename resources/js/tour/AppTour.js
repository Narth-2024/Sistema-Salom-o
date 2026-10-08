import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { router } from '@inertiajs/react'
import { ONBOARDING_STORAGE } from '@/Components/OnboardingChecklist'

const SEGMENTS = [
    {
        path: '/categories',
        steps: [
            {
                element: '[data-tour="cat-header"]',
                popover: {
                    title: 'Categorias',
                    description:
                        'Categorias são os "envelopes" do seu dinheiro: Alimentação, Transporte, Salário... Cada transação aponta para uma categoria — é assim que o sistema sabe para onde seu dinheiro vai.',
                    side: 'bottom',
                },
            },
            {
                element: '[data-tour="cat-form"]',
                popover: {
                    title: 'Nova categoria',
                    description:
                        'Dê um nome, escolha o tipo (despesa ou receita) e uma cor. Cores diferentes deixam os gráficos legíveis à primeira vista. Comece com 3 a 5 categorias do dia a dia.',
                    side: 'bottom',
                },
            },
            {
                element: '[data-tour="cat-list"]',
                popover: {
                    title: 'Sua lista',
                    description:
                        'Cada carta mostra nome, tipo e quantas transações usam a categoria. O lápis edita e a lixeira exclui — sempre com confirmação.',
                    side: 'top',
                },
            },
        ],
    },
    {
        path: '/transactions',
        steps: [
            {
                element: '[data-tour="tx-header"]',
                popover: {
                    title: 'Transações',
                    description:
                        'Todo movimento de dinheiro vira uma transação: entrada (+) ou saída (-), com valor, data e categoria. É a matéria-prima de todos os gráficos e relatórios.',
                    side: 'bottom',
                },
            },
            {
                element: '[data-tour="tx-create"]',
                popover: {
                    title: 'Nova transação',
                    description:
                        'Registre sua primeira entrada ou saída por aqui. Use uma descrição detalhada, ex: "feira da semana".',
                    side: 'bottom',
                },
            },
            {
                element: '[data-tour="tx-stats"]',
                popover: {
                    title: 'Resumo do período',
                    description:
                        'Receitas, despesas e saldo calculados sobre os filtros ativos. Mexeu no filtro? Os totais mudam junto.',
                    side: 'bottom',
                },
            },
            {
                element: '[data-tour="tx-filters"]',
                popover: {
                    title: 'Filtros e busca',
                    description:
                        'Busque por descrição e combine tipo, categoria, tag e período — tudo ao mesmo tempo. "Limpar" volta ao estado padrão.',
                    side: 'top',
                },
            },
            {
                element: '[data-tour="tx-table"]',
                popover: {
                    title: 'Histórico',
                    description:
                        'Cada linha é uma transação: data, descrição, categoria, tags, tipo e valor. Transações recorrentes exibem o selo "Recorrente" ao lado do tipo. Passe o mouse para ver os ícones de ver, editar e excluir — com confirmação antes de apagar.',
                    side: 'top',
                },
            },
        ],
    },
    {
        path: '/transactions/create',
        steps: [
            {
                element: '[data-tour="tx-recurring"]',
                popover: {
                    title: 'Transação recorrente',
                    description:
                        'Marque esta opção para despesas fixas como aluguel, internet ou salário. O sistema replica a transação automaticamente todo mês — você nunca mais esquece de registrar.',
                    side: 'top',
                },
            },
        ],
    },
    {
        path: '/tags',
        steps: [
            {
                element: '[data-tour="tags-header"]',
                popover: {
                    title: 'Tags',
                    description:
                        'Rótulos livres que cruzam suas transações de outros jeitos que as categorias — "assinatura", "viagem", "imposto"... Uma transação pode ter várias tags.',
                    side: 'bottom',
                },
            },
            {
                element: '[data-tour="tags-form"]',
                popover: {
                    title: 'Nova tag',
                    description:
                        'Escolha nome e cor. Crie as suas primeiro — depois é só marcá-las ao registrar transações.',
                    side: 'bottom',
                },
            },
            {
                element: '[data-tour="tags-list"]',
                popover: {
                    title: 'Suas tags',
                    description:
                        'Cada tag mostra quantas transações está usando. Editar ou excluir uma tag nunca apaga as transações.',
                    side: 'top',
                },
            },
        ],
    },
    {
        path: '/analytics',
        steps: [
            {
                element: '[data-tour="an-header"]',
                popover: {
                    title: 'Analytics',
                    description:
                        'Com dados registrados, aqui eles viram decisão: totais, comparação entre meses e gráficos de evolução.',
                    side: 'bottom',
                },
            },
            {
                element: '[data-tour="an-totals"]',
                popover: {
                    title: 'Totais',
                    description:
                        'Receitas, despesas e saldo gerais do recorte atual, sempre no topo para consulta rápida.',
                    side: 'bottom',
                },
            },
            {
                element: '[data-tour="an-compare"]',
                popover: {
                    title: 'Mês atual vs anterior',
                    description:
                        'Cada cartão traz o valor atual, o do mês anterior e a variação em %. É assim que você enxerga tendências sem decorar números.',
                    side: 'bottom',
                },
            },
            {
                element: '[data-tour="an-bars"]',
                popover: {
                    title: 'Receitas vs Despesas',
                    description:
                        'Barras mensais: verde para entradas, vermelho para saídas. De relance você vê se o mês fecha positivo.',
                    side: 'top',
                },
            },
            {
                element: '[data-tour="an-timeline"]',
                popover: {
                    title: 'Evolução do saldo',
                    description:
                        'A linha acompanha seu saldo mês a mês. Subindo, você está acumulando dinheiro.',
                    side: 'top',
                },
            },
        ],
    },
    {
        path: '/settings',
        steps: [
            {
                element: '[data-tour="help-card"]',
                skipMissingElement: true,
                popover: {
                    title: 'Central de ajuda',
                    description:
                        'Aqui você refaz o tutorial e o checklist quando quiser — e também avalia o sistema.',
                    side: 'top',
                },
            },
            {
                element: '[data-tour="help-survey"]',
                skipMissingElement: true,
                popover: {
                    title: 'Avalie o sistema',
                    description:
                        'Este é o formulário de avaliação do Salomão. Depois de usá-lo no seu dia a dia, volte aqui e responda: sua opinião mostra se o sistema cumpriu o que propôs — organizar, controlar e apoiar suas decisões.',
                    side: 'top',
                },
            },
            {
                element: '[data-tour="help-bug"]',
                skipMissingElement: true,
                popover: {
                    title: 'Reportar bug',
                    description:
                        'Encontrou um erro? Clique aqui para abrir um issue no GitHub e descrever o problema — assim conseguimos corrigir mais rápido.',
                    side: 'top',
                },
            },
        ],
    },
    {
        path: '/dashboard',
        steps: () => [
            {
                element: '[data-tour="checklist"]',
                skipMissingElement: true,
                popover: {
                    title: 'Checklist de boas-vindas',
                    description:
                        'Seus primeiros passos com progresso em tempo real. Ele some sozinho quando tudo estiver concluído — e você pode ocultar quando quiser.',
                    side: 'bottom',
                },
            },
            {
                element: '[data-tour="dash-period"]',
                skipMissingElement: true,
                popover: {
                    title: 'Filtro de período',
                    description:
                        'Escolha o recorte dos dados: este mês, mês passado, últimos 3 meses, ano inteiro ou tudo. O resumo, o gráfico e as transações recentes se ajustam na hora.',
                    side: 'bottom',
                },
            },
            {
                element: '[data-tour="dash-banner"]',
                popover: {
                    title: 'Tour concluído!',
                    description:
                        'Esse é o seu Dashboard: saudação, resumo do período e atalhos. O botão ? no canto da tela reassiste este tour a qualquer momento.',
                    side: 'bottom',
                },
            },
        ],
    },
]

let running = false

function normalizePath(path) {
    return path.replace(/\/+$/, '') || '/'
}

function visitPath(path) {
    if (normalizePath(window.location.pathname) === normalizePath(path)) {
        return Promise.resolve()
    }
    return new Promise(resolve => {
        router.visit(path, {
            onFinish: () => setTimeout(resolve, 80),
        })
    })
}

function driveSegment(steps) {
    return new Promise(resolve => {
        let completed = false
        const tour = driver({
            steps,
            animate: true,
            smoothScroll: true,
            allowKeyboardControl: true,
            overlayClickBehavior: 'none',
            disableActiveInteraction: true,
            waitForElement: 4000,
            showProgress: true,
            progressText: '{{current}} de {{total}}',
            nextBtnText: 'Próximo',
            prevBtnText: 'Anterior',
            doneBtnText: 'Concluir',
            closeBtnLabel: 'Fechar tour',
            popoverClass: 'salomao-tour',
            stagePadding: 8,
            popoverOffset: 12,
            onDoneClick: (_element, _step, opts) => {
                completed = true
                opts.driver.destroy()
            },
            onDestroyed: () => resolve(completed),
        })
        tour.drive()
    })
}

export function isTourRunning() {
    return running
}

export async function startAppTour() {
    if (running) return
    running = true
    localStorage.setItem(ONBOARDING_STORAGE.WELCOME, '1')
    try {
        for (const segment of SEGMENTS) {
            await visitPath(segment.path)
            const steps = typeof segment.steps === 'function' ? segment.steps() : segment.steps
            const completed = await driveSegment(steps)
            if (!completed) break
        }
    } finally {
        running = false
    }
}
