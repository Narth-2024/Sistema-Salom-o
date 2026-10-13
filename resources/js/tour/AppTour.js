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
                        'Cada carta mostra nome, tipo e quantas transações usam a categoria. Use o seletor de ordenação para reorganizar por nome, tipo ou data. O lápis edita e a lixeira exclui — e a exclusão é segura: você tem um aviso com botão "Desfazer" antes de a mudança se tornar definitiva.',
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
                element: '[data-tour="tx-export"]',
                popover: {
                    title: 'Exportar em CSV',
                    description:
                        'Baixa seu histórico em planilha. Exporta exatamente o que os filtros estão mostrando hoje — quer dizer, você pode buscar por um período ou categoria e exportar só aquilo.',
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
                        'Cada linha é uma transação: data, descrição, categoria, tags, tipo e valor. Transações recorrentes exibem o selo "Recorrente" ao lado do tipo. No celular a lista vira cartões. Passe o mouse para ver os ícones de ver, editar e excluir — e se excluir por engano, o aviso logo acima traz um botão "Desfazer".',
                    side: 'top',
                },
            },
        ],
    },
    {
        path: '/transactions/create',
        steps: [
            {
                element: '[data-tour="tx-amount"]',
                popover: {
                    title: 'Valor com vírgula',
                    description:
                        'Digite do jeito que você fala: aceita vírgula ("12,50") e ponto ("12.50"). No celular o teclado já abre numérico.',
                    side: 'bottom',
                },
            },
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
                        'Cada tag mostra quantas transações está usando, e dá para ordenar a lista por nome ou por uso. Editar ou excluir nunca apaga as transações — e a exclusão também pode ser desfeita.',
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
                element: '[data-tour="an-metrics"]',
                popover: {
                    title: 'Taxa de economia e ticket médio',
                    description:
                        'A taxa de economia mostra quanto sobra das suas receitas — se sobra. O ticket médio divide as despesas pelo número de lançamentos: é o quanto custa, em média, cada saída.',
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
            {
                element: '[data-tour="an-categories"]',
                skipMissingElement: true,
                popover: {
                    title: 'Despesas por categoria',
                    description:
                        'Onde o dinheiro realmente foi: as 5 categorias que mais consumiram no período. É o gráfico que costuma revelar o vazamento.',
                    side: 'top',
                },
            },
        ],
    },
    {
        path: '/investments',
        steps: [
            {
                element: '[data-tour="inv-header"]',
                popover: {
                    title: 'Investimentos',
                    description:
                        'Simule quanto seu dinheiro pode render em instrumentos de renda fixa seguros: Poupança, CDB, Tesouro e mais.',
                    side: 'bottom',
                },
            },
            {
                element: '[data-tour="inv-form"]',
                popover: {
                    title: 'Configure a simulação',
                    description:
                        'Informe o valor inicial, aporte mensal, prazo e IPCA estimado. O sistema compara todos os instrumentos na hora.',
                    side: 'bottom',
                },
            },
            {
                element: '[data-tour="inv-best"]',
                skipMissingElement: true,
                popover: {
                    title: 'Melhor resultado em destaque',
                    description:
                        'Depois de simular, o instrumento que rendeu mais aparece destacado no topo, com quanto rendeu a mais em relação aos demais.',
                    side: 'bottom',
                },
            },
            {
                element: '[data-tour="inv-results"]',
                skipMissingElement: true,
                popover: {
                    title: 'Comparativo',
                    description:
                        'Cada cartão mostra o valor líquido (já com IR, quando aplicável) e você pode salvar qualquer simulação no histórico para comparar depois.',
                    side: 'top',
                },
            },
            {
                element: '[data-tour="inv-chart"]',
                skipMissingElement: true,
                popover: {
                    title: 'Evolução projetada',
                    description:
                        'A curva mostra como o valor líquido cresce mês a mês em cada instrumento. As taxas de referência do Banco Central ficam no topo da página.',
                    side: 'top',
                },
            },
            {
                element: '[data-tour="inv-history"]',
                skipMissingElement: true,
                popover: {
                    title: 'Histórico de simulações',
                    description:
                        'Tudo o que você salvou fica aqui, pronto para rever. A lixeira remove uma simulação do histórico — os seus dados financeiros não são afetados.',
                    side: 'top',
                },
            },
        ],
    },
    {
        path: '/settings',
        steps: [
            {
                element: '[data-tour="settings-profile"]',
                popover: {
                    title: 'Perfil',
                    description:
                        'Mude seu nome e a foto que aparece no sistema. A foto é opcional — sem ela, mostramos a inicial do seu nome.',
                    side: 'top',
                },
            },
            {
                element: '[data-tour="settings-password"]',
                popover: {
                    title: 'Alterar senha',
                    description:
                        'Troque sua senha quando quiser, confirmando a atual. Mínimo de 8 caracteres.',
                    side: 'top',
                },
            },
            {
                element: '[data-tour="settings-theme"]',
                popover: {
                    title: 'Aparência',
                    description:
                        'Alterna entre o tema escuro e o claro do sistema. A escolha fica salva neste dispositivo.',
                    side: 'top',
                },
            },
            {
                element: '[data-tour="settings-install"]',
                skipMissingElement: true,
                popover: {
                    title: 'Instalar aplicativo',
                    description:
                        'Instala o Salomão na tela inicial do celular, para abrir como um aplicativo em tela cheia. Quem instala continua usando o sistema mesmo sem internet — os dados salvos ficam disponíveis.',
                    side: 'top',
                },
            },
            {
                element: '[data-tour="help-card"]',
                popover: {
                    title: 'Central de ajuda',
                    description:
                        'Aqui você refaz este tutorial, avalia o sistema e reporta um bug — tudo por três botões. O "?" flutuante no canto da tela faz o mesmo, de qualquer página.',
                    side: 'top',
                },
            },
            {
                element: '[data-tour="settings-account"]',
                popover: {
                    title: 'Excluir conta',
                    description:
                        'A zona de risco: apaga definitivamente a sua conta e todos os dados — transações, categorias, tags e simulações. Pedimos a senha para confirmar, e essa ação não pode ser desfeita.',
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
                element: '[data-tour="pwa-banner"]',
                skipMissingElement: true,
                popover: {
                    title: 'Instale o Salomão',
                    description:
                        'Se o seu navegador oferecer, instale o sistema na tela inicial: abre em tela cheia, sem barra de endereço, e continua funcionando offline.',
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
                        'Esse é o seu Dashboard: saudação, resumo do período e atalhos. Sem internet? Um aviso no topo avisa e você continua vendo os dados salvos. O botão ? no canto da tela reassiste este tour a qualquer momento.',
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

function driveSegment(steps, { locked = false } = {}) {
    return new Promise(resolve => {
        let completed = false
        const tour = driver({
            steps,
            animate: true,
            smoothScroll: true,
            allowKeyboardControl: true,
            allowClose: !locked,
            overlayClickBehavior: 'none',
            disableActiveInteraction: true,
            waitForElement: 4000,
            showProgress: true,
            showButtons: locked ? ['previous', 'next', 'done'] : undefined,
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

export async function startAppTour({ locked = false } = {}) {
    if (running) return
    running = true
    if (!locked) {
        localStorage.setItem(ONBOARDING_STORAGE.WELCOME, '1')
    }
    try {
        let allCompleted = true
        for (const segment of SEGMENTS) {
            await visitPath(segment.path)
            const steps = typeof segment.steps === 'function' ? segment.steps() : segment.steps
            const completed = await driveSegment(steps, { locked })
            if (!completed) {
                allCompleted = false
                break
            }
        }
        if (allCompleted) {
            localStorage.setItem(ONBOARDING_STORAGE.WELCOME, '1')
        }
    } finally {
        running = false
    }
}
