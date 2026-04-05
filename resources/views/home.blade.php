<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sistema Salomão - Controle Financeiro</title>
<script src="https://cdn.tailwindcss.com"></script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
* { font-family: 'Inter', sans-serif; }

@keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
}
.animate-fadeUp {
    animation: fadeUp 0.8s ease forwards;
    opacity: 0;
}

@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%      { transform: translateY(-20px); }
}
.animate-float {
    animation: float 6s ease-in-out infinite;
}
</style>
</head>

<body class="bg-[#F4FDFF] text-neutral-800 overflow-x-hidden">

<!-- NAVBAR -->
<nav class="fixed top-0 w-full z-50 bg-[#3a5433] shadow-xl">
    <div class="max-w-6xl mx-auto flex items-center justify-between px-8 py-5">
        <h1 class="text-lg font-bold text-white tracking-wide">Sistema Salomão</h1>
        <a href="{{ route('auth.show') }}"
           class="bg-white text-[#567c4b] px-6 py-2.5 rounded-lg text-sm font-medium
                  hover:bg-[#e8f5e4] transition">
            Acessar
        </a>
    </div>
</nav>

<!-- HERO -->
<section class="min-h-screen flex items-center relative pt-24">
    <div class="absolute inset-0 bg-gradient-to-br from-[#567c4b] via-[#6e9562] to-[#82aa77]"></div>
    <div class="absolute top-40 left-20 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px]"></div>
    <div class="absolute bottom-20 right-20 w-[600px] h-[600px] bg-[#4a8c3f]/10 rounded-full blur-[100px]"></div>

    <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center px-8 py-20 relative z-10">
        <div class="space-y-8">
            <p class="text-[#d4edcc] text-sm font-medium tracking-widest uppercase animate-fadeUp">
                Gestão financeira pessoal
            </p>
            <h1 class="text-5xl md:text-6xl font-extrabold text-white leading-tight animate-fadeUp" style="animation-delay: 0.15s">
                Controle seu dinheiro<br>de verdade
            </h1>
            <p class="text-lg text-white/60 leading-relaxed max-w-lg animate-fadeUp" style="animation-delay: 0.3s">
                Registre entradas e saídas, organize por categorias e tenha visão clara de para onde vai cada centavo.
            </p>
            <div class="flex items-center gap-4 animate-fadeUp" style="animation-delay: 0.45s">
                <a href="{{ route('auth.show') }}"
                   class="bg-white text-[#567c4b] px-10 py-4 rounded-xl font-semibold
                          hover:bg-[#e8f5e4] hover:shadow-2xl transition-all duration-300 inline-block">
                    Começar agora
                </a>
            </div>
        </div>

        <div class="animate-fadeUp" style="animation-delay: 0.6s">
            <div class="grid grid-cols-1 gap-5">
                <div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 flex items-center gap-5">
                    <div class="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                    </div>
                    <div>
                        <p class="text-white font-semibold text-lg">Registre suas transações</p>
                        <p class="text-white/50 text-sm">Entradas e saídas organizadas por data e categoria</p>
                    </div>
                </div>
                <div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 flex items-center gap-5">
                    <div class="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"/>
                        </svg>
                    </div>
                    <div>
                        <p class="text-white font-semibold text-lg">Categorias personalizadas</p>
                        <p class="text-white/50 text-sm">Classifique gastos como quiser</p>
                    </div>
                </div>
                <div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 flex items-center gap-5">
                    <div class="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                        </svg>
                    </div>
                    <div>
                        <p class="text-white font-semibold text-lg">Visão clara das finanças</p>
                        <p class="text-white/50 text-sm">Dados e relatórios para decisões melhores</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- METRICAS -->
<section class="py-8 bg-white border-b border-gray-100">
    <div class="max-w-6xl mx-auto px-8 grid grid-cols-3 gap-8 text-center">
        <div>
            <p class="text-3xl font-bold text-[#567c4b]">100%</p>
            <p class="text-sm text-neutral-500 mt-1">Controle total</p>
        </div>
        <div>
            <p class="text-3xl font-bold text-[#567c4b]">24/7</p>
            <p class="text-sm text-neutral-500 mt-1">Acesso de qualquer lugar</p>
        </div>
        <div>
            <p class="text-3xl font-bold text-[#567c4b]">0 R$</p>
            <p class="text-sm text-neutral-500 mt-1">Custo para o usuário</p>
        </div>
    </div>
</section>

<!-- FUNCIONALIDADES -->
<section class="py-32 px-8 bg-[#edf6ea]">
    <div class="max-w-6xl mx-auto">
        <div class="text-center mb-20">
            <p class="text-[#567c4b] text-sm font-medium tracking-widest uppercase mb-3">Recursos</p>
            <h2 class="text-4xl font-bold text-neutral-900 mb-4">Tudo que você precisa</h2>
            <p class="text-neutral-500 max-w-xl mx-auto">Ferramentas simples e eficientes para sua vida financeira</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
            <div class="bg-white p-10 rounded-2xl shadow-sm border border-[#d4e8cf] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div class="w-14 h-14 bg-[#e8f5e4] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#d4edcc] transition">
                    <svg class="w-7 h-7 text-[#567c4b]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                </div>
                <h3 class="text-xl font-semibold mb-3 text-neutral-900">Autenticação segura</h3>
                <p class="text-neutral-500 text-sm leading-relaxed">
                    Login protegido com Clerk. Seus dados ficam seguros.
                </p>
            </div>

            <div class="bg-white p-10 rounded-2xl shadow-sm border border-[#d4e8cf] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div class="w-14 h-14 bg-[#e8f5e4] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#d4edcc] transition">
                    <svg class="w-7 h-7 text-[#567c4b]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"/>
                    </svg>
                </div>
                <h3 class="text-xl font-semibold mb-3 text-neutral-900">Categorias</h3>
                <p class="text-neutral-500 text-sm leading-relaxed">
                    Organize despesas e receitas em categorias personalizadas.
                </p>
            </div>

            <div class="bg-white p-10 rounded-2xl shadow-sm border border-[#d4e8cf] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div class="w-14 h-14 bg-[#e8f5e4] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#d4edcc] transition">
                    <svg class="w-7 h-7 text-[#567c4b]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                    </svg>
                </div>
                <h3 class="text-xl font-semibold mb-3 text-neutral-900">Transações</h3>
                <p class="text-neutral-500 text-sm leading-relaxed">
                    Registre entradas e saídas com data, valor e descrição.
                </p>
            </div>
        </div>
    </div>
</section>

<!-- CTA FINAL -->
<section class="py-28 px-8 bg-gradient-to-br from-[#567c4b] via-[#6e9562] to-[#82aa77] text-white text-center relative overflow-hidden">
    <div class="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px]"></div>
    <div class="relative z-10">
        <h2 class="text-4xl font-bold mb-4">Pronto para ter controle?</h2>
        <p class="text-white/50 mb-10 max-w-md mx-auto">
            Crie sua conta e comece a organizar suas finanças agora.
        </p>
        <a href="{{ route('auth.show') }}"
           class="bg-white text-[#567c4b] px-10 py-4 rounded-xl font-semibold
                  hover:bg-[#e8f5e4] hover:shadow-2xl transition-all duration-300 inline-block">
            Acessar Sistema
        </a>
    </div>
</section>

<footer class="bg-[#3a5433] text-white/50 text-center py-6 text-sm">
    2026 Sistema Salomão — Trabalho de Conclusão de Curso
</footer>

</body>
</html>
