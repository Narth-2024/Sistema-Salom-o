<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sistema Salomão - Controle Financeiro</title>
<script src="https://cdn.tailwindcss.com"></script>

<style>
@keyframes fadeUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fadeUp {
    animation: fadeUp 0.8s ease forwards;
}
</style>

</head>

<body class="bg-gradient-to-br from-[#567c4b] to-[#2f4f2f] text-white overflow-x-hidden">

<!-- HERO -->
<section class="min-h-screen flex flex-col justify-center items-center text-center px-6 relative">

    <div class="absolute w-72 h-72 bg-white/10 rounded-full blur-3xl top-20 left-10 animate-pulse"></div>
    <div class="absolute w-96 h-96 bg-black/20 rounded-full blur-3xl bottom-20 right-10 animate-pulse"></div>

    <h1 class="text-6xl font-bold mb-6 animate-fadeUp">
        Sistema Salomão
    </h1>

    <p class="max-w-2xl text-lg text-white/80 leading-relaxed animate-fadeUp" style="animation-delay: 0.2s">
        Plataforma web para gerenciamento financeiro pessoal.
        Organização, controle e clareza sobre seu dinheiro.
    </p>

    <div class="mt-10 animate-fadeUp" style="animation-delay: 0.4s">
        <a href="{{ route('auth.show') }}"
           class="bg-black px-10 py-4 rounded-xl font-semibold text-white
           hover:scale-105 hover:shadow-2xl transition duration-300">
            Criar conta / Entrar
        </a>
    </div>

</section>

<!-- SOBRE -->
<section class="bg-white text-neutral-800 py-24 px-6">
    <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

        <div class="animate-fadeUp">
            <h2 class="text-4xl font-bold mb-6">Por que usar?</h2>
            <p class="text-neutral-600 leading-relaxed">
                Muitas pessoas enfrentam dificuldades para manter
                controle organizado das finanças. O Sistema Salomão
                oferece uma interface intuitiva para registrar,
                categorizar e visualizar despesas e receitas.
            </p>
        </div>

        <div class="bg-[#567c4b] text-white p-10 rounded-3xl shadow-2xl transform hover:scale-105 transition duration-500 animate-fadeUp">
            <h3 class="text-2xl font-semibold mb-4">Benefícios</h3>
            <ul class="space-y-3 text-white/90">
                <li>✔ Organização financeira simplificada</li>
                <li>✔ Controle total de entradas e saídas</li>
                <li>✔ Segurança com autenticação</li>
                <li>✔ Interface moderna e responsiva</li>
            </ul>
        </div>

    </div>
</section>


<!-- FUNCIONALIDADES -->
<section class="py-5 bg-gradient-to-t from-neutral-100 to-white"></section>
<section class="py-24 px-6 bg-neutral-100 text-neutral-800">
    <div class="max-w-6xl mx-auto text-center">

        <h2 class="text-4xl font-bold mb-16 animate-fadeUp">
            Funcionalidades Principais
        </h2>

        <div class="grid md:grid-cols-3 gap-10">

            <div class="bg-white p-10 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300 animate-fadeUp">
                <h3 class="text-xl font-semibold mb-4">Autenticação</h3>
                <p class="text-neutral-600 text-sm">
                    Registro e login com proteção e criptografia de senha.
                </p>
            </div>

            <div class="bg-white p-10 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300 animate-fadeUp" style="animation-delay:0.2s">
                <h3 class="text-xl font-semibold mb-4">Categorias</h3>
                <p class="text-neutral-600 text-sm">
                    Organização personalizada dos tipos de despesas.
                </p>
            </div>

            <div class="bg-white p-10 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300 animate-fadeUp" style="animation-delay:0.4s">
                <h3 class="text-xl font-semibold mb-4">Transações</h3>
                <p class="text-neutral-600 text-sm">
                    Registro detalhado de entradas e saídas financeiras.
                </p>
            </div>

        </div>

    </div>
</section>


<!-- CTA FINAL -->
<section class="bg-black text-white py-20 text-center px-6
    bg-gradient-to-t from-black via-[#22232a] to-[#22232a]">
    <h2 class="text-4xl font-bold mb-6 animate-fadeUp">
        Comece agora
    </h2>

    <p class="text-white/70 mb-10 animate-fadeUp" style="animation-delay:0.2s">
        Crie sua conta gratuitamente e organize suas finanças.
    </p>

    <a href="{{ route('auth.show') }}"
       class="bg-[#567c4b] px-10 py-4 rounded-xl font-semibold
       hover:scale-105 transition duration-300 animate-fadeUp"
       style="animation-delay:0.4s">
        Acessar Sistema
    </a>
</section>


<footer class="bg-black text-white text-center py-6 text-sm">
    © 2026 Sistema Salomão — Trabalho de Conclusão de Curso
</footer>

</body>
</html>
