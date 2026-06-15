<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Nova Transação — Sistema Salomão</title>
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
               class="text-white font-medium transition">
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
<main class="max-w-3xl mx-auto px-6 py-10">

    <div class="mb-8">
        <h1 class="text-3xl font-bold text-neutral-900">Nova Transação</h1>
        <p class="text-neutral-500 mt-1">Registre uma nova entrada ou saída financeira.</p>
    </div>

    @if ($errors->any())
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <ul class="list-disc list-inside text-sm">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <div class="bg-white border border-[#d4e8cf] rounded-2xl p-6 shadow-sm">
        <form action="{{ route('transactions.store') }}" method="POST">
            @csrf

            <!-- Tipo -->
            <div class="mb-4">
                <label class="text-sm text-neutral-600 mb-1 block">Tipo</label>
                <select name="type" id="typeSelect" required
                    class="w-full px-4 py-2 rounded-lg border border-neutral-300 bg-white
                           focus:outline-none focus:ring-2 focus:ring-[#567c4b] transition">
                    <option value="expense">Despesa</option>
                    <option value="income">Receita</option>
                </select>
            </div>

            <!-- Categoria -->
            <div class="mb-4">
                <label class="text-sm text-neutral-600 mb-1 block">Categoria</label>
                <select name="category_id" id="categorySelect" required
                    class="w-full px-4 py-2 rounded-lg border border-neutral-300 bg-white
                           focus:outline-none focus:ring-2 focus:ring-[#567c4b] transition">
                    <option value="">Selecione...</option>
                    @foreach(auth()->user()->categories as $cat)
                        <option value="{{ $cat->id }}" data-type="{{ $cat->type }}">
                            {{ $cat->name }}
                        </option>
                    @endforeach
                </select>
            </div>

            <!-- Valor -->
            <div class="mb-4">
                <label class="text-sm text-neutral-600 mb-1 block">Valor (R$)</label>
                <input type="number" name="amount" step="0.01" min="0.01" required
                    class="w-full px-4 py-2 rounded-lg border border-neutral-300 bg-white
                           focus:outline-none focus:ring-2 focus:ring-[#567c4b] transition"
                    placeholder="0,00">
            </div>

            <!-- Data -->
            <div class="mb-4">
                <label class="text-sm text-neutral-600 mb-1 block">Data</label>
                <input type="date" name="transaction_date" required
                    value="{{ date('Y-m-d') }}"
                    class="w-full px-4 py-2 rounded-lg border border-neutral-300 bg-white
                           focus:outline-none focus:ring-2 focus:ring-[#567c4b] transition">
            </div>

            <!-- Descrição -->
            <div class="mb-6">
                <label class="text-sm text-neutral-600 mb-1 block">Descrição (opcional)</label>
                <input type="text" name="description"
                    class="w-full px-4 py-2 rounded-lg border border-neutral-300 bg-white
                           focus:outline-none focus:ring-2 focus:ring-[#567c4b] transition"
                    placeholder="Ex: Compras do mês, Pagamento de aluguel...">
            </div>

            <!-- Botões -->
            <div class="flex items-center gap-4">
                <button type="submit"
                    class="bg-[#567c4b] text-white px-6 py-2 rounded-lg font-medium
                           hover:bg-[#4a6d40] transition">
                    Registrar
                </button>
                <a href="{{ route('transactions.index') }}"
                   class="text-[#567c4b] hover:underline font-medium">
                    &larr; Voltar
                </a>
            </div>
        </form>
    </div>

</main>

<script>
    // Filtrar categorias conforme o tipo selecionado
    const typeSelect = document.getElementById('typeSelect');
    const categorySelect = document.getElementById('categorySelect');

    function filterCategories() {
        const selectedType = typeSelect.value;
        const options = categorySelect.querySelectorAll('option[data-type]');
        options.forEach(opt => {
            opt.style.display = (opt.dataset.type === selectedType) ? '' : 'none';
        });
        categorySelect.value = '';
    }

    typeSelect.addEventListener('change', filterCategories);
    filterCategories();
</script>

</body>
</html>
