<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Categorias — Sistema Salomão</title>
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
               class="text-white font-medium transition">
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
        <h1 class="text-3xl font-bold text-neutral-900">Categorias</h1>
        <p class="text-neutral-500 mt-1">Gerencie suas categorias de receitas e despesas.</p>
    </div>

    <!-- SUCCESS MESSAGE -->
    @if(session('success'))
        <div class="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {{ session('success') }}
        </div>
    @endif

    <!-- FORMULÁRIO DE NOVA CATEGORIA -->
    <div class="bg-white border border-[#d4e8cf] rounded-2xl p-6 shadow-sm mb-8">
        <h2 class="text-lg font-semibold text-neutral-900 mb-4">Nova Categoria</h2>
        <form action="{{ route('categories.store') }}" method="POST" class="flex flex-col md:flex-row gap-4 items-end">
            @csrf
            <div class="flex-1 w-full">
                <label class="text-sm text-neutral-600 mb-1 block">Nome</label>
                <input type="text" name="name" required
                    class="w-full px-4 py-2 rounded-lg border border-neutral-300 bg-white
                           focus:outline-none focus:ring-2 focus:ring-[#567c4b] transition"
                    placeholder="Ex: Alimentação, Transporte, Salário...">
            </div>
            <div class="w-full md:w-48">
                <label class="text-sm text-neutral-600 mb-1 block">Tipo</label>
                <select name="type" required
                    class="w-full px-4 py-2 rounded-lg border border-neutral-300 bg-white
                           focus:outline-none focus:ring-2 focus:ring-[#567c4b] transition">
                    <option value="expense">Despesa</option>
                    <option value="income">Receita</option>
                </select>
            </div>
            <button type="submit"
                class="w-full md:w-auto bg-[#567c4b] text-white px-6 py-2 rounded-lg font-medium
                       hover:bg-[#4a6d40] transition whitespace-nowrap">
                Adicionar
            </button>
        </form>
    </div>

    <!-- LISTA DE CATEGORIAS -->
    <div class="bg-white border border-[#d4e8cf] rounded-2xl shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100">
            <h2 class="text-lg font-semibold text-neutral-900">Suas Categorias</h2>
        </div>

        @if($categories->isEmpty())
            <div class="px-6 py-12 text-center">
                <svg class="w-16 h-16 mx-auto text-neutral-300 mb-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024-.195 1.414-.586l7-7a2 2 0 012.828 2.828l-7 7a1.998 1.998 0 01-1.414.586H3a2 2 0 01-2-2V5c0-.512.195-1.024.586-1.414l7-7A2 2 0 0112 3z"/>
                </svg>
                <p class="text-neutral-500">Nenhuma categoria cadastrada.</p>
                <p class="text-neutral-400 text-sm mt-1">Adicione sua primeira categoria acima.</p>
            </div>
        @else
            <div class="divide-y divide-gray-100">
                @foreach($categories as $category)
                    <div class="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition">
                        <div class="flex items-center gap-4">
                            <div class="w-10 h-10 rounded-xl flex items-center justify-center
                                {{ $category->type === 'income' ? 'bg-green-100' : 'bg-red-100' }}">
                                @if($category->type === 'income')
                                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12"/>
                                    </svg>
                                @else
                                    <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17 13l-5 5m0 0l-5-5m5 5V6"/>
                                    </svg>
                                @endif
                            </div>
                            <div>
                                <p class="font-medium text-neutral-800">{{ $category->name }}</p>
                                <p class="text-xs text-neutral-400">
                                    {{ $category->type === 'income' ? 'Receita' : 'Despesa' }}
                                </p>
                            </div>
                        </div>
                        <form action="{{ route('categories.destroy', $category) }}" method="POST"
                              onsubmit="return confirm('Tem certeza que deseja excluir esta categoria?');">
                            @csrf
                            @method('DELETE')
                            <button type="submit"
                                class="text-neutral-400 hover:text-red-500 transition p-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                            </button>
                        </form>
                    </div>
                @endforeach
            </div>
        @endif
    </div>

    <div class="mt-6 flex justify-center">
        <a href="{{ route('dashboard') }}"
           class="text-[#567c4b] hover:underline font-medium">
            &larr; Voltar ao Dashboard
        </a>
    </div>

</main>

</body>
</html>
