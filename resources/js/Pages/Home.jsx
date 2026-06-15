import GuestLayout from '@/Layouts/GuestLayout.jsx'

function FeatureCard({ icon, title, description }) {
    return (
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 flex items-center gap-5">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">{icon}</svg>
            </div>
            <div>
                <p className="text-white font-semibold text-lg">{title}</p>
                <p className="text-white/50 text-sm">{description}</p>
            </div>
        </div>
    )
}

function Hero() {
    return (
        <section className="min-h-screen flex items-center relative pt-24">
            <div className="absolute inset-0 bg-gradient-to-br from-[#567c4b] via-[#6e9562] to-[#82aa77]" />
            <div className="absolute top-40 left-20 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-20 right-20 w-[600px] h-[600px] bg-[#4a8c3f]/10 rounded-full blur-[100px]" />

            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center px-8 py-20 relative z-10">
                <div className="space-y-8">
                    <p className="text-[#d4edcc] text-sm font-medium tracking-widest uppercase">
                        Gestão financeira pessoal
                    </p>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
                        Controle seu dinheiro<br />de verdade
                    </h1>
                    <p className="text-lg text-white/60 leading-relaxed max-w-lg">
                        Registre entradas e saídas, organize por categorias e tenha visão clara de para onde vai cada centavo.
                    </p>
                    <div className="flex items-center gap-4">
                        <a
                            href="/login"
                            className="bg-white text-[#567c4b] px-10 py-4 rounded-xl font-semibold hover:bg-[#e8f5e4] hover:shadow-2xl transition-all duration-300 inline-block"
                        >
                            Começar agora
                        </a>
                    </div>
                </div>

                <div>
                    <div className="grid grid-cols-1 gap-5">
                        <FeatureCard
                            icon={<path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />}
                            title="Registre suas transações"
                            description="Entradas e saídas organizadas por data e categoria"
                        />
                        <FeatureCard
                            icon={<path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />}
                            title="Categorias personalizadas"
                            description="Classifique gastos como quiser"
                        />
                        <FeatureCard
                            icon={<path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />}
                            title="Visão clara das finanças"
                            description="Dados e relatórios para decisões melhores"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

function Metrics() {
    return (
        <section className="py-8 bg-white border-b border-gray-100">
            <div className="max-w-6xl mx-auto px-8 grid grid-cols-3 gap-8 text-center">
                <div>
                    <p className="text-3xl font-bold text-[#567c4b]">100%</p>
                    <p className="text-sm text-neutral-500 mt-1">Controle total</p>
                </div>
                <div>
                    <p className="text-3xl font-bold text-[#567c4b]">24/7</p>
                    <p className="text-sm text-neutral-500 mt-1">Acesso de qualquer lugar</p>
                </div>
                <div>
                    <p className="text-3xl font-bold text-[#567c4b]">0 R$</p>
                    <p className="text-sm text-neutral-500 mt-1">Custo para o usuário</p>
                </div>
            </div>
        </section>
    )
}

function FeaturesSection() {
    const features = [
        {
            icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
            title: 'Autenticação segura',
            description: 'Login protegido. Seus dados ficam seguros.',
        },
        {
            icon: <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 012.828 2.828l-7 7a1.998 1.998 0 01-1.414.586H3a2 2 0 01-2-2V5c0-.512.195-1.024.586-1.414l7-7A2 2 0 0112 3z" />,
            title: 'Categorias',
            description: 'Organize despesas e receitas em categorias personalizadas.',
        },
        {
            icon: <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
            title: 'Transações',
            description: 'Registre entradas e saídas com data, valor e descrição.',
        },
    ]

    return (
        <section className="py-32 px-8 bg-[#edf6ea]">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-20">
                    <p className="text-[#567c4b] text-sm font-medium tracking-widest uppercase mb-3">Recursos</p>
                    <h2 className="text-4xl font-bold text-neutral-900 mb-4">Tudo que você precisa</h2>
                    <p className="text-neutral-500 max-w-xl mx-auto">Ferramentas simples e eficientes para sua vida financeira</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className="bg-white p-10 rounded-2xl shadow-sm border border-[#d4e8cf] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                        >
                            <div className="w-14 h-14 bg-[#e8f5e4] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#d4edcc] transition">
                                <svg className="w-7 h-7 text-[#567c4b]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">{feature.icon}</svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-neutral-900">{feature.title}</h3>
                            <p className="text-neutral-500 text-sm leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

function CtaSection() {
    return (
        <section className="py-28 px-8 bg-gradient-to-br from-[#567c4b] via-[#6e9562] to-[#82aa77] text-white text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px]" />
            <div className="relative z-10">
                <h2 className="text-4xl font-bold mb-4">Pronto para ter controle?</h2>
                <p className="text-white/50 mb-10 max-w-md mx-auto">
                    Crie sua conta e comece a organizar suas finanças agora.
                </p>
                <a
                    href="/login"
                    className="bg-white text-[#567c4b] px-10 py-4 rounded-xl font-semibold hover:bg-[#e8f5e4] hover:shadow-2xl transition-all duration-300 inline-block"
                >
                    Acessar Sistema
                </a>
            </div>
        </section>
    )
}

function Footer() {
    return (
        <footer className="bg-[#3a5433] text-white/50 text-center py-6 text-sm">
            2026 Sistema Salomão — Trabalho de Conclusão de Curso
        </footer>
    )
}

export default function Home() {
    return (
        <GuestLayout>
            <Hero />
            <Metrics />
            <FeaturesSection />
            <CtaSection />
            <Footer />
        </GuestLayout>
    )
}
