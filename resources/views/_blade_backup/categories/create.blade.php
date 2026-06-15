<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Nova Categoria — Sistema Salomão</title>
<script src="https://cdn.tailwindcss.com"></script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
* { font-family: 'Inter', sans-serif; }
</style>
</head>
<body class="bg-[#F4FDFF] min-h-screen">

<!-- NAVBAR -->
<nav class="bg-[#3a5433] shadow-lg sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="{{ route('dashboard') }}" class="text-white font-bold text-lg tracking-wide hover:opacity-90 transition">
            Sistema Salomão
        </a>
        <div class="flex items-center gap-6">
            <a href="{{ route('dashboard') }}"
               class="text-white/80 hover:text-white text-sm font-medium transition">
                Dashboard
            </a>
            <a href="{{ route('categories.index') }}"
               class="text-white/80 hover:text-white text-sm font-medium transition">
                Categorias
            </a>
            <a href="{{ route('transactions.index') }}"
               class="text-white/80 hover:text-white text-sm font-medium transition">
                Transações
            </a>
            <form action="{{ route('logout') }}" method="GET" class="inline">
                <button type="submit"
                        class="bg-white/10 text-white/80 px-4 py-2 rounded-lg text-sm font-medium
                               hover:bg-white/20 hover:text-white transition">
                    Sair
                </button>
            </form>
        </div>
    </div>
</nav>

<!-- CONTEÚDO -->
<main class="max-w-4xl mx-auto px-6 py-10">

    <div class="mb-8">
        <h1 class="text-3xl font-bold text-neutral-900">Nova Categoria</h1>
        <p class="text-neutral-500 mt-1">Cadastre uma nova categoria de receita ou despesa.</p>
    </div>

    <div class="bg-white border border-[#d4e8cf] rounded-2xl p-6 shadow-sm">
        <form action="{{ route('categories.store') }}" method="POST" class="space-y-5">
            @csrf

            <div>
                <label class="text-sm text-neutral-600 mb-1 block">Nome</label>
                <input type="text" name="name" required
                    class="w-full px-4 py-2 rounded-lg border border-neutral-300 bg-white
                           focus:outline-none focus:ring-2 focus:ring-[#567c4b] transition"
                    placeholder="Ex: Alimentação, Transporte, Salário...">
            </div>

            <div>
                <label class="text-sm text-neutral-600 mb-1 block">Tipo</label>
                <select name="type" required
                    class="w-full px-4 py-2 rounded-lg border border-neutral-300 bg-white
                           focus:outline-none focus:ring-2 focus:ring-[#567c4b] transition">
                    <option value="income">Receita</option>
                    <option value="expense">Despesa</option>
                </select>
            </div>

            <div class="flex items-center gap-4 pt-2">
                <button type="submit"
                    class="bg-[#567c4b] text-white px-6 py-2 rounded-lg font-medium
                           hover:bg-[#4a6d40] transition">
                    Criar Categoria
                </button>
                <a href="{{ route('categories.index') }}"
                   class="text-[#567c4b] hover:underline font-medium">
                    &larr; Voltar
                </a>
            </div>
        </form>
    </div>

</main>

</body>
</html>
