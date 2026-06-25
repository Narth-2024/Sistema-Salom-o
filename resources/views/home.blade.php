<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sistema Salomão - Controle Financeiro Inteligente</title>
<script src="https://cdn.tailwindcss.com"></script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
* { font-family: 'Inter', sans-serif; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideIn { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
@keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
@keyframes pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 0.8; } }

.animate-in { animation: fadeIn 0.7s ease forwards; }
.animate-up { animation: fadeInUp 0.7s ease forwards; }
.animate-slide { animation: slideIn 0.7s ease forwards; }
.animate-float { animation: float 5s ease-in-out infinite; }
.animate-pulse-slow { animation: pulse 3s ease-in-out infinite; }

.delay-1 { animation-delay: 0.1s; }
.delay-2 { animation-delay: 0.2s; }
.delay-3 { animation-delay: 0.3s; }
.delay-4 { animation-delay: 0.4s; }
.delay-5 { animation-delay: 0.5s; }
</style>
</head>
<body class="bg-[#f0f7da] text-[#5d5d5d] overflow-x-hidden">

<!-- NAVBAR -->
<nav class="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-[#c9df8a]/30">
    <div class="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-8 h-16">
        <a href="/" class="flex items-center gap-2.5 group">
            <div class="w-8 h-8 bg-gradient-to-br from-[#36802d] to-[#234d20] rounded-lg flex items-center justify-center shadow-sm">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                </svg>
            </div>
            <span class="text-lg font-bold text-[#234d20] tracking-tight">Salomão</span>
        </a>
        <div class="flex items-center gap-2">
            <a href="{{ route('login') }}" class="text-sm font-medium text-[#5d5d5d] hover:text-[#234d20] px-4 py-2 rounded-lg hover:bg-[#d9ead3] transition">Entrar</a>
            <a href="{{ route('register') }}" class="text-sm font-semibold text-white bg-[#36802d] hover:bg-[#2a623d] px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all">Começar grátis</a>
        </div>
    </div>
</nav>

<!-- HERO -->
<section class="relative min-h-screen flex items-center pt-20 overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-[#f0f7da] via-white to-[#d9ead3]/40"></div>
    <div class="absolute top-20 left-10 w-72 h-72 bg-[#77ab59]/10 rounded-full blur-3xl animate-pulse-slow"></div>
    <div class="absolute bottom-20 right-10 w-96 h-96 bg-[#36802d]/10 rounded-full blur-3xl animate-pulse-slow" style="animation-delay: 1.5s"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#c9df8a]/10 rounded-full blur-3xl"></div>

    <div class="relative max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center py-16 lg:py-24">
        <div class="space-y-8">
            <div class="animate-in">
                <span class="inline-flex items-center gap-2 bg-[#d9ead3] text-[#36802d] text-xs font-semibold px-4 py-1.5 rounded-full">
                    <span class="w-1.5 h-1.5 bg-[#36802d] rounded-full animate-pulse"></span>
                    Gestão financeira pessoal
                </span>
            </div>
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1a472a] leading-tight tracking-tight animate-up delay-1">
                Controle suas<br/>
                <span class="text-[#36802d]">finanças com<br/>inteligência</span>
            </h1>
            <p class="text-lg text-[#5d5d5d]/80 leading-relaxed max-w-lg animate-up delay-2">
                Registre entradas e saídas, organize por categorias, acompanhe gráficos e tenha uma visão clara de para onde vai cada centavo.
            </p>
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 animate-up delay-3">
                <a href="{{ route('register') }}" class="inline-flex items-center justify-center gap-2 bg-[#36802d] text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-[#2a623d] hover:shadow-lg transition-all shadow-md text-sm sm:text-base">
                    Criar conta gratuita
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                </a>
                <a href="#recursos" class="inline-flex items-center justify-center gap-2 text-[#36802d] hover:text-[#234d20] font-medium px-6 py-3.5 rounded-xl hover:bg-[#d9ead3] transition text-sm sm:text-base">
                    Ver recursos
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                </a>
            </div>
            <div class="flex items-center gap-6 text-sm text-[#aaaaaa] animate-up delay-4">
                <span class="flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-[#77ab59]" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                    Grátis
                </span>
                <span class="flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-[#77ab59]" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                    Seguro
                </span>
                <span class="flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-[#77ab59]" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                    Privacidade
                </span>
            </div>
        </div>

        <!-- Dashboard mockup -->
        <div class="relative animate-up delay-4">
            <div class="relative bg-white rounded-2xl shadow-2xl border border-[#c9df8a]/40 overflow-hidden">
                <div class="bg-gradient-to-r from-[#234d20] to-[#36802d] px-6 py-4 flex items-center gap-3">
                    <div class="flex gap-1.5">
                        <div class="w-3 h-3 rounded-full bg-red-400/80"></div>
                        <div class="w-3 h-3 rounded-full bg-yellow-400/80"></div>
                        <div class="w-3 h-3 rounded-full bg-green-400/80"></div>
                    </div>
                    <span class="text-white/60 text-xs font-medium">Salomão — Dashboard</span>
                </div>
                <div class="p-6 space-y-5">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-xs text-[#aaaaaa] font-medium uppercase tracking-wider">Saldo total</p>
                            <p class="text-2xl font-extrabold text-[#1a472a]">R$ 12.450,00</p>
                        </div>
                        <span class="text-xs font-semibold text-[#36802d] bg-[#d9ead3] px-3 py-1 rounded-full">+15,2%</span>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div class="bg-[#f0f7da] rounded-xl p-4">
                            <p class="text-xs text-[#aaaaaa]">Receitas</p>
                            <p class="text-lg font-bold text-[#36802d]">R$ 8.200</p>
                        </div>
                        <div class="bg-[#f0f7da] rounded-xl p-4">
                            <p class="text-xs text-[#aaaaaa]">Despesas</p>
                            <p class="text-lg font-bold text-[#2a623d]">R$ 5.750</p>
                        </div>
                    </div>
                    <div class="h-20 flex items-end gap-2 pt-2">
                        <div class="flex-1 bg-gradient-to-t from-[#36802d] to-[#77ab59] rounded-t-md" style="height: 60%"></div>
                        <div class="flex-1 bg-gradient-to-t from-[#dc2626] to-[#f87171] rounded-t-md" style="height: 85%"></div>
                        <div class="flex-1 bg-gradient-to-t from-[#36802d] to-[#77ab59] rounded-t-md" style="height: 45%"></div>
                        <div class="flex-1 bg-gradient-to-t from-[#dc2626] to-[#f87171] rounded-t-md" style="height: 70%"></div>
                        <div class="flex-1 bg-gradient-to-t from-[#36802d] to-[#77ab59] rounded-t-md" style="height: 55%"></div>
                        <div class="flex-1 bg-gradient-to-t from-[#dc2626] to-[#f87171] rounded-t-md" style="height: 90%"></div>
                    </div>
                </div>
            </div>
            <div class="absolute -bottom-4 -right-4 w-full h-full bg-[#36802d]/5 rounded-2xl -z-10"></div>
        </div>
    </div>
</section>

<!-- MÉTRICAS -->
<section class="relative py-16 lg:py-20 bg-white border-y border-[#c9df8a]/20">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            <div class="text-center">
                <p class="text-3xl lg:text-4xl font-extrabold text-[#36802d]">100%</p>
                <p class="text-sm text-[#aaaaaa] mt-1">Controle dos seus gastos</p>
            </div>
            <div class="text-center">
                <p class="text-3xl lg:text-4xl font-extrabold text-[#36802d]">24/7</p>
                <p class="text-sm text-[#aaaaaa] mt-1">Acesso de qualquer lugar</p>
            </div>
            <div class="text-center">
                <p class="text-3xl lg:text-4xl font-extrabold text-[#36802d]">Grátis</p>
                <p class="text-sm text-[#aaaaaa] mt-1">Sem custo para você</p>
            </div>
            <div class="text-center">
                <p class="text-3xl lg:text-4xl font-extrabold text-[#36802d]">Seguro</p>
                <p class="text-sm text-[#aaaaaa] mt-1">Dados protegidos</p>
            </div>
        </div>
    </div>
</section>

<!-- RECURSOS -->
<section id="recursos" class="relative py-20 lg:py-28">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-16">
            <span class="text-xs font-semibold text-[#36802d] bg-[#d9ead3] px-4 py-1.5 rounded-full inline-block mb-4">Recursos</span>
            <h2 class="text-3xl lg:text-4xl font-bold text-[#1a472a] mb-4">Tudo que você precisa para<br/>organizar suas finanças</h2>
            <p class="text-[#5d5d5d]/70">Ferramentas simples e eficientes para você ter controle total do seu dinheiro.</p>
        </div>

        <div class="grid md:grid-cols-3 gap-6 lg:gap-8">
            <div class="group bg-white rounded-2xl p-8 shadow-sm border border-[#c9df8a]/30 hover:shadow-lg hover:border-[#77ab59]/50 transition-all duration-300">
                <div class="w-12 h-12 bg-[#d9ead3] rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#36802d] transition-colors duration-300">
                    <svg class="w-6 h-6 text-[#36802d] group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                </div>
                <h3 class="text-lg font-semibold text-[#1a472a] mb-2">Autenticação segura</h3>
                <p class="text-sm text-[#5d5d5d]/70 leading-relaxed">Login protegido com criptografia. Seus dados financeiros ficam seguros.</p>
            </div>

            <div class="group bg-white rounded-2xl p-8 shadow-sm border border-[#c9df8a]/30 hover:shadow-lg hover:border-[#77ab59]/50 transition-all duration-300">
                <div class="w-12 h-12 bg-[#d9ead3] rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#36802d] transition-colors duration-300">
                    <svg class="w-6 h-6 text-[#36802d] group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"/>
                    </svg>
                </div>
                <h3 class="text-lg font-semibold text-[#1a472a] mb-2">Categorias inteligentes</h3>
                <p class="text-sm text-[#5d5d5d]/70 leading-relaxed">Organize receitas e despesas em categorias personalizadas para entender seus hábitos.</p>
            </div>

            <div class="group bg-white rounded-2xl p-8 shadow-sm border border-[#c9df8a]/30 hover:shadow-lg hover:border-[#77ab59]/50 transition-all duration-300">
                <div class="w-12 h-12 bg-[#d9ead3] rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#36802d] transition-colors duration-300">
                    <svg class="w-6 h-6 text-[#36802d] group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                    </svg>
                </div>
                <h3 class="text-lg font-semibold text-[#1a472a] mb-2">Transações completas</h3>
                <p class="text-sm text-[#5d5d5d]/70 leading-relaxed">Registre entradas e saídas com data, valor, descrição e categoria.</p>
            </div>

            <div class="group bg-white rounded-2xl p-8 shadow-sm border border-[#c9df8a]/30 hover:shadow-lg hover:border-[#77ab59]/50 transition-all duration-300">
                <div class="w-12 h-12 bg-[#d9ead3] rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#36802d] transition-colors duration-300">
                    <svg class="w-6 h-6 text-[#36802d] group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                </div>
                <h3 class="text-lg font-semibold text-[#1a472a] mb-2">Gráficos e relatórios</h3>
                <p class="text-sm text-[#5d5d5d]/70 leading-relaxed">Visualize seus dados com gráficos de barras, linha do tempo e comparativos mensais.</p>
            </div>

            <div class="group bg-white rounded-2xl p-8 shadow-sm border border-[#c9df8a]/30 hover:shadow-lg hover:border-[#77ab59]/50 transition-all duration-300">
                <div class="w-12 h-12 bg-[#d9ead3] rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#36802d] transition-colors duration-300">
                    <svg class="w-6 h-6 text-[#36802d] group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                    </svg>
                </div>
                <h3 class="text-lg font-semibold text-[#1a472a] mb-2">Dashboard completo</h3>
                <p class="text-sm text-[#5d5d5d]/70 leading-relaxed">Visão geral do seu saldo, receitas, despesas e últimas movimentações.</p>
            </div>

            <div class="group bg-white rounded-2xl p-8 shadow-sm border border-[#c9df8a]/30 hover:shadow-lg hover:border-[#77ab59]/50 transition-all duration-300">
                <div class="w-12 h-12 bg-[#d9ead3] rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#36802d] transition-colors duration-300">
                    <svg class="w-6 h-6 text-[#36802d] group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"/>
                    </svg>
                </div>
                <h3 class="text-lg font-semibold text-[#1a472a] mb-2">Simples e intuitivo</h3>
                <p class="text-sm text-[#5d5d5d]/70 leading-relaxed">Interface limpa e fácil de usar. Você não precisa ser expert em finanças.</p>
            </div>
        </div>
    </div>
</section>

<!-- COMO FUNCIONA -->
<section class="relative py-20 lg:py-28 bg-white">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-16">
            <span class="text-xs font-semibold text-[#36802d] bg-[#d9ead3] px-4 py-1.5 rounded-full inline-block mb-4">Como funciona</span>
            <h2 class="text-3xl lg:text-4xl font-bold text-[#1a472a] mb-4">Comece em 3 passos</h2>
            <p class="text-[#5d5d5d]/70">Rápido e sem complicação.</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div class="relative text-center">
                <div class="w-16 h-16 bg-[#36802d] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[#36802d]/20">
                    <span class="text-2xl font-bold text-white">1</span>
                </div>
                <div class="hidden md:block absolute top-8 left-[60%] w-[calc(100%-4rem)] h-px bg-gradient-to-r from-[#c9df8a] to-transparent"></div>
                <h3 class="text-lg font-semibold text-[#1a472a] mb-2">Crie sua conta</h3>
                <p class="text-sm text-[#5d5d5d]/70">Cadastre-se gratuitamente em segundos com seu Google ou email.</p>
            </div>
            <div class="relative text-center">
                <div class="w-16 h-16 bg-[#77ab59] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[#77ab59]/20">
                    <span class="text-2xl font-bold text-white">2</span>
                </div>
                <div class="hidden md:block absolute top-8 left-[60%] w-[calc(100%-4rem)] h-px bg-gradient-to-r from-[#c9df8a] to-transparent"></div>
                <h3 class="text-lg font-semibold text-[#1a472a] mb-2">Registre seus dados</h3>
                <p class="text-sm text-[#5d5d5d]/70">Adicione suas receitas, despesas e crie categorias personalizadas.</p>
            </div>
            <div class="relative text-center">
                <div class="w-16 h-16 bg-[#36802d] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[#36802d]/20">
                    <span class="text-2xl font-bold text-white">3</span>
                </div>
                <h3 class="text-lg font-semibold text-[#1a472a] mb-2">Acompanhe</h3>
                <p class="text-sm text-[#5d5d5d]/70">Veja gráficos, compare meses e tenha controle total das suas finanças.</p>
            </div>
        </div>
    </div>
</section>

<!-- CTA -->
<section class="relative py-20 lg:py-28 overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-br from-[#1a472a] via-[#234d20] to-[#36802d]"></div>
    <div class="absolute top-0 left-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px]"></div>
    <div class="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#77ab59]/10 rounded-full blur-[100px]"></div>
    <div class="relative max-w-3xl mx-auto px-6 lg:px-8 text-center">
        <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">Pronto para ter controle<br/>das suas finanças?</h2>
        <p class="text-white/60 text-lg mb-10 max-w-lg mx-auto">Crie sua conta grátis e comece a organizar seu dinheiro em menos de 1 minuto.</p>
        <a href="{{ route('register') }}" class="inline-flex items-center gap-2 bg-white text-[#234d20] font-semibold px-10 py-4 rounded-xl hover:bg-[#d9ead3] hover:shadow-2xl transition-all shadow-lg text-base">
            Criar conta gratuita
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
        </a>
    </div>
</section>

<!-- FOOTER -->
<footer class="bg-[#1a472a]">
    <div class="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div class="grid md:grid-cols-4 gap-8 mb-10">
            <div class="md:col-span-2">
                <div class="flex items-center gap-2.5 mb-4">
                    <div class="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                        </svg>
                    </div>
                    <span class="text-lg font-bold text-white">Salomão</span>
                </div>
                <p class="text-white/40 text-sm max-w-sm">Sistema de controle financeiro pessoal. Organize suas receitas e despesas de forma simples e intuitiva.</p>
            </div>
            <div>
                <h4 class="text-sm font-semibold text-white/80 mb-4">Produto</h4>
                <ul class="space-y-2.5">
                    <li><a href="#recursos" class="text-sm text-white/40 hover:text-white/70 transition">Recursos</a></li>
                    <li><a href="{{ route('register') }}" class="text-sm text-white/40 hover:text-white/70 transition">Cadastro</a></li>
                    <li><a href="{{ route('login') }}" class="text-sm text-white/40 hover:text-white/70 transition">Login</a></li>
                </ul>
            </div>
            <div>
                <h4 class="text-sm font-semibold text-white/80 mb-4">Contato</h4>
                <ul class="space-y-2.5">
                    <li><a href="mailto:nathanbs.trabalho@gmail.com" class="text-sm text-white/40 hover:text-white/70 transition">Email</a></li>
                    <li><a href="https://github.com/Narth-2024" target="_blank" class="text-sm text-white/40 hover:text-white/70 transition">GitHub</a></li>
                    <li><a href="https://www.linkedin.com/feed/" target="_blank" class="text-sm text-white/40 hover:text-white/70 transition">LinkedIn</a></li>
                </ul>
            </div>
        </div>
        <div class="border-t border-white/10 pt-8 text-center text-sm text-white/30">
            2026 Sistema Salomão — Trabalho de Conclusão de Curso
        </div>
    </div>
</footer>

</body>
</html>
