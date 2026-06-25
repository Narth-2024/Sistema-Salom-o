import GuestLayout from '@/Layouts/GuestLayout.jsx'
import { TrendingUp, Tags, BarChart3, Coins, ShieldCheck } from 'lucide-react'

function FeatureCard({ icon: Icon, title, description }) {
    return (
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 flex items-center gap-5">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 text-white" />
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
            <div className="absolute inset-0 bg-gradient-to-br from-green-800 via-green-700 to-green-600" />
            <div className="absolute top-40 left-20 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-20 right-20 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[100px]" />

            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center px-8 py-20 relative z-10">
                <div className="space-y-8">
                    <p className="text-green-200 text-sm font-medium tracking-widest uppercase">
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
                            className="bg-white text-green-700 px-10 py-4 rounded-xl font-semibold hover:bg-green-50 hover:shadow-2xl transition-all duration-300 inline-block"
                        >
                            Começar agora
                        </a>
                    </div>
                </div>

                <div>
                    <div className="grid grid-cols-1 gap-5">
                        <FeatureCard
                            icon={TrendingUp}
                            title="Registre suas transações"
                            description="Entradas e saídas organizadas por data e categoria"
                        />
                        <FeatureCard
                            icon={Tags}
                            title="Categorias personalizadas"
                            description="Classifique gastos como quiser"
                        />
                        <FeatureCard
                            icon={BarChart3}
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
                    <p className="text-3xl font-bold text-green-600">100%</p>
                    <p className="text-sm text-gray-500 mt-1">Controle total</p>
                </div>
                <div>
                    <p className="text-3xl font-bold text-green-600">24/7</p>
                    <p className="text-sm text-gray-500 mt-1">Acesso de qualquer lugar</p>
                </div>
                <div>
                    <p className="text-3xl font-bold text-green-600">0 R$</p>
                    <p className="text-sm text-gray-500 mt-1">Custo para o usuário</p>
                </div>
            </div>
        </section>
    )
}

function FeaturesSection() {
    const features = [
        {
            icon: ShieldCheck,
            title: 'Autenticação segura',
            description: 'Login protegido. Seus dados ficam seguros.',
        },
        {
            icon: Tags,
            title: 'Categorias',
            description: 'Organize despesas e receitas em categorias personalizadas.',
        },
        {
            icon: Coins,
            title: 'Transações',
            description: 'Registre entradas e saídas com data, valor e descrição.',
        },
    ]

    return (
        <section className="py-32 px-8 bg-green-50">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-20">
                    <p className="text-green-600 text-sm font-medium tracking-widest uppercase mb-3">Recursos</p>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Tudo que você precisa</h2>
                    <p className="text-gray-500 max-w-xl mx-auto">Ferramentas simples e eficientes para sua vida financeira</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className="bg-white p-10 rounded-2xl shadow-sm border border-green-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                        >
                            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-200 transition">
                                <feature.icon className="w-7 h-7 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

function CtaSection() {
    return (
        <section className="py-28 px-8 bg-gradient-to-br from-green-800 via-green-700 to-green-600 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px]" />
            <div className="relative z-10">
                <h2 className="text-4xl font-bold mb-4">Pronto para ter controle?</h2>
                <p className="text-white/50 mb-10 max-w-md mx-auto">
                    Crie sua conta e comece a organizar suas finanças agora.
                </p>
                <a
                    href="/login"
                    className="bg-white text-green-700 px-10 py-4 rounded-xl font-semibold hover:bg-green-50 hover:shadow-2xl transition-all duration-300 inline-block"
                >
                    Acessar Sistema
                </a>
            </div>
        </section>
    )
}

function Footer() {
    return (
        <footer className="bg-green-900 text-white/50 text-center py-6 text-sm">
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
