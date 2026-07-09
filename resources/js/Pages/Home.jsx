import { Head, Link } from '@inertiajs/react'

export default function Home() {
    return (
        <>
            <Head title="Salomão - Controle Financeiro Inteligente" />

            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slideIn { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
                @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
                @keyframes pulse-slow { 0%,100% { opacity: 0.4; } 50% { opacity: 0.8; } }
                .animate-in { animation: fadeIn 0.7s ease forwards; }
                .animate-up { animation: fadeInUp 0.7s ease forwards; }
                .animate-slide { animation: slideIn 0.7s ease forwards; }
                .animate-float { animation: float 5s ease-in-out infinite; }
                .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
                .delay-1 { animation-delay: 0.1s; }
                .delay-2 { animation-delay: 0.2s; }
                .delay-3 { animation-delay: 0.3s; }
                .delay-4 { animation-delay: 0.4s; }
                .delay-5 { animation-delay: 0.5s; }
            `}</style>

            {/* NAVBAR */}
            <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-gray-200/50">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-500 rounded-lg flex items-center justify-center shadow-sm">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                            </svg>
                        </div>
                        <span className="text-lg font-bold text-gray-800 tracking-tight">Salomão</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-surface-accent transition">Entrar</Link>
                        <Link href="/register" className="text-sm font-semibold text-white bg-green-600 hover:bg-green-700 px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all">Começar grátis</Link>
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-green-50 via-surface to-green-50/40" />
                <div className="absolute top-20 left-10 w-72 h-72 bg-green-300/10 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-600/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-200/10 rounded-full blur-3xl"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center py-16 lg:py-24">
                    <div className="space-y-8">
                        <div className="animate-in">
                            <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-semibold px-4 py-1.5 rounded-full">
                                <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></span>
                                Gestão financeira pessoal
                            </span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-800 leading-tight tracking-tight animate-up delay-1">
                            Controle suas<br/>
                            <span className="text-green-600">finanças com<br/>inteligência</span>
                        </h1>
                        <p className="text-lg text-gray-500 leading-relaxed max-w-lg animate-up delay-2">
                            Registre entradas e saídas, organize por categorias, acompanhe gráficos e tenha uma visão clara de para onde vai cada centavo.
                        </p>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 animate-up delay-3">
                            <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-green-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-green-700 hover:shadow-lg transition-all shadow-md text-sm sm:text-base">
                                Criar conta gratuita
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                            </Link>
                            <a href="#recursos" className="inline-flex items-center justify-center gap-2 text-green-600 hover:text-green-700 font-medium px-6 py-3.5 rounded-xl hover:bg-green-50 transition text-sm sm:text-base">
                                Ver recursos
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                            </a>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-400 animate-up delay-4">
                            <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                                Grátis
                            </span>
                            <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                                Seguro
                            </span>
                            <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                                Privacidade
                            </span>
                        </div>
                    </div>

                    {/* Dashboard mockup */}
                    <div className="relative animate-up delay-4">
                        <div className="relative bg-surface rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-800 to-green-600 px-6 py-4 flex items-center gap-3">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                                </div>
                                <span className="text-white/60 text-xs font-medium">Salomão — Dashboard</span>
                            </div>
                            <div className="p-6 space-y-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Saldo total</p>
                                        <p className="text-2xl font-extrabold text-gray-800">R$ 12.450,00</p>
                                    </div>
                                    <span className="text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">+15,2%</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-green-50 rounded-xl p-4">
                                        <p className="text-xs text-gray-400">Receitas</p>
                                        <p className="text-lg font-bold text-green-600">R$ 8.200</p>
                                    </div>
                                    <div className="bg-green-50 rounded-xl p-4">
                                        <p className="text-xs text-gray-400">Despesas</p>
                                        <p className="text-lg font-bold text-green-700">R$ 5.750</p>
                                    </div>
                                </div>
                                <div className="h-20 flex items-end gap-2 pt-2">
                                    <div className="flex-1 bg-gradient-to-t from-green-600 to-green-400 rounded-t-md" style={{ height: '60%' }}></div>
                                    <div className="flex-1 bg-gradient-to-t from-red-500 to-red-400 rounded-t-md" style={{ height: '85%' }}></div>
                                    <div className="flex-1 bg-gradient-to-t from-green-600 to-green-400 rounded-t-md" style={{ height: '45%' }}></div>
                                    <div className="flex-1 bg-gradient-to-t from-red-500 to-red-400 rounded-t-md" style={{ height: '70%' }}></div>
                                    <div className="flex-1 bg-gradient-to-t from-green-600 to-green-400 rounded-t-md" style={{ height: '55%' }}></div>
                                    <div className="flex-1 bg-gradient-to-t from-red-500 to-red-400 rounded-t-md" style={{ height: '90%' }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -bottom-4 -right-4 w-full h-full bg-green-500/5 rounded-2xl -z-10"></div>
                    </div>
                </div>
            </section>

            {/* MÉTRICAS */}
            <section className="relative py-16 lg:py-20 bg-surface border-y border-gray-200/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
                        <div className="text-center">
                            <p className="text-3xl lg:text-4xl font-extrabold text-green-600">100%</p>
                            <p className="text-sm text-gray-400 mt-1">Controle dos seus gastos</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl lg:text-4xl font-extrabold text-green-600">24/7</p>
                            <p className="text-sm text-gray-400 mt-1">Acesso de qualquer lugar</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl lg:text-4xl font-extrabold text-green-600">Grátis</p>
                            <p className="text-sm text-gray-400 mt-1">Sem custo para você</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl lg:text-4xl font-extrabold text-green-600">Seguro</p>
                            <p className="text-sm text-gray-400 mt-1">Dados protegidos</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* RECURSOS */}
            <section id="recursos" className="relative py-20 lg:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-xs font-semibold text-green-700 bg-green-100 px-4 py-1.5 rounded-full inline-block mb-4">Recursos</span>
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Tudo que você precisa para<br/>organizar suas finanças</h2>
                        <p className="text-gray-500/70">Ferramentas simples e eficientes para você ter controle total do seu dinheiro.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                        {[
                            {
                                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>,
                                title: 'Autenticação segura',
                                desc: 'Login protegido com criptografia. Seus dados financeiros ficam seguros.',
                            },
                            {
                                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"/>,
                                title: 'Categorias inteligentes',
                                desc: 'Organize receitas e despesas em categorias personalizadas para entender seus hábitos.',
                            },
                            {
                                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>,
                                title: 'Transações completas',
                                desc: 'Registre entradas e saídas com data, valor, descrição e categoria.',
                            },
                            {
                                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>,
                                title: 'Gráficos e relatórios',
                                desc: 'Visualize seus dados com gráficos de barras, linha do tempo e comparativos mensais.',
                            },
                            {
                                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>,
                                title: 'Dashboard completo',
                                desc: 'Visão geral do seu saldo, receitas, despesas e últimas movimentações.',
                            },
                            {
                                icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></>,
                                title: 'Simples e intuitivo',
                                desc: 'Interface limpa e fácil de usar. Você não precisa ser expert em finanças.',
                            },
                        ].map((item, i) => (
                            <div key={i} className="group bg-surface rounded-2xl p-8 shadow-sm border border-gray-200/30 hover:shadow-lg hover:border-green-500/50 transition-all duration-300">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-5 group-hover:bg-green-600 transition-colors duration-300">
                                    <svg className="w-6 h-6 text-green-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                        {item.icon}
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* COMO FUNCIONA */}
            <section className="relative py-20 lg:py-28 bg-surface">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-xs font-semibold text-green-700 bg-green-100 px-4 py-1.5 rounded-full inline-block mb-4">Como funciona</span>
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Comece em 3 passos</h2>
                        <p className="text-gray-500/70">Rápido e sem complicação.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                        {[
                            { num: '1', color: 'from-green-600 to-green-500', title: 'Crie sua conta', desc: 'Cadastre-se gratuitamente em segundos com seu Google ou email.' },
                            { num: '2', color: 'from-green-500 to-green-400', title: 'Registre seus dados', desc: 'Adicione suas receitas, despesas e crie categorias personalizadas.' },
                            { num: '3', color: 'from-green-600 to-green-500', title: 'Acompanhe', desc: 'Veja gráficos, compare meses e tenha controle total das suas finanças.' },
                        ].map((step, i) => (
                            <div key={i} className="relative text-center">
                                <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-600/20`}>
                                    <span className="text-2xl font-bold text-white">{step.num}</span>
                                </div>
                                {i < 2 && (
                                    <div className="hidden md:block absolute top-8 left-[60%] w-[calc(100%-4rem)] h-px bg-gradient-to-r from-green-300 to-transparent"></div>
                                )}
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">{step.title}</h3>
                                <p className="text-sm text-gray-500">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="relative py-20 lg:py-28 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-green-800 to-green-700"></div>
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-green-400/10 rounded-full blur-[100px]"></div>
                <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Pronto para ter controle<br/>das suas finanças?</h2>
                    <p className="text-white/60 text-lg mb-10 max-w-lg mx-auto">Crie sua conta grátis e comece a organizar seu dinheiro em menos de 1 minuto.</p>
                    <Link href="/register" className="inline-flex items-center gap-2 bg-white text-green-800 font-semibold px-10 py-4 rounded-xl hover:bg-green-50 hover:shadow-2xl transition-all shadow-lg text-base">
                        Criar conta gratuita
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                    </Link>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-green-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid md:grid-cols-4 gap-8 mb-10">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-2.5 mb-4">
                                <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                                    </svg>
                                </div>
                                <span className="text-lg font-bold text-white">Salomão</span>
                            </div>
                            <p className="text-white/40 text-sm max-w-sm">Sistema de controle financeiro pessoal. Organize suas receitas e despesas de forma simples e intuitiva.</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-white/80 mb-4">Produto</h4>
                            <ul className="space-y-2.5">
                                <li><a href="#recursos" className="text-sm text-white/40 hover:text-white/70 transition">Recursos</a></li>
                                <li><Link href="/register" className="text-sm text-white/40 hover:text-white/70 transition">Cadastro</Link></li>
                                <li><Link href="/login" className="text-sm text-white/40 hover:text-white/70 transition">Login</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-white/80 mb-4">Contato</h4>
                            <ul className="space-y-2.5">
                                <li><a href="mailto:nathanbs.trabalho@gmail.com" className="text-sm text-white/40 hover:text-white/70 transition">Email</a></li>
                                <li><a href="https://github.com/Narth-2024" target="_blank" className="text-sm text-white/40 hover:text-white/70 transition">GitHub</a></li>
                                <li><a href="https://www.linkedin.com/feed/" target="_blank" className="text-sm text-white/40 hover:text-white/70 transition">LinkedIn</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-white/10 pt-8 text-center text-sm text-white/30">
                        2026 Sistema Salomão — Trabalho de Conclusão de Curso
                    </div>
                </div>
            </footer>
        </>
    )
}
