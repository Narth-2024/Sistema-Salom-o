<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Transações — Sistema Salomão</title>
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
<main class="max-w-5xl mx-auto px-6 py-10">

    <div class="mb-8">
        <h1 class="text-3xl font-bold text-neutral-900">Transações</h1>
        <p class="text-neutral-500 mt-1">Registre suas entradas e saídas financeiras.</p>
    </div>

    <!-- FORMULÁRIO DE NOVA TRANSAÇÃO -->
    <div class="bg-white border border-[#d4e8cf] rounded-2xl p-6 shadow-sm mb-8">
        <h2 class="text-lg font-semibold text-neutral-900 mb-4">Nova Transação</h2>
        <form action="{{ route('transactions.store') }}" method="POST" class="grid grid-cols-1 md:grid-cols-5 gap-4">
            @csrf

            <!-- Tipo -->
            <div class="md:col-span-1">
                <label class="text-sm text-neutral-600 mb-1 block">Tipo</label>
                <select name="type" required id="typeSelect"
                    class="w-full px-4 py-2 rounded-lg border border-neutral-300 bg-white
                           focus:outline-none focus:ring-2 focus:ring-[#567c4b] transition">
                    <option value="expense">Despesa</option>
                    <option value="income">Receita</option>
                </select>
            </div>

            <!-- Categoria -->
            <div class="md:col-span-1">
                <label class="text-sm text-neutral-600 mb-1 block">Categoria</label>
                <select name="category_id" required
                    class="w-full px-4 py-2 rounded-lg border border-neutral-300 bg-white
                           focus:outline-none focus:ring-2 focus:ring-[#567c4b] transition">
                    <option value="">Selecione...</option>
                    @foreach(auth()->user()->categories as $cat)
                        <option value="{{ $cat->id }}">{{ $cat->name }}</option>
                    @endforeach
                </select>
            </div>

            <!-- Valor -->
            <div class="md:col-span-1">
                <label class="text-sm text-neutral-600 mb-1 block">Valor (R$)</label>
                <input type="number" name="amount" step="0.01" min="0.01" required
                    class="w-full px-4 py-2 rounded-lg border border-neutral-300 bg-white
                           focus:outline-none focus:ring-2 focus:ring-[#567c4b] transition"
                    placeholder="0,00">
            </div>

            <!-- Data -->
            <div class="md:col-span-1">
                <label class="text-sm text-neutral-600 mb-1 block">Data</label>
                <input type="date" name="transaction_date" required
                    value="{{ date('Y-m-d') }}"
                    class="w-full px-4 py-2 rounded-lg border border-neutral-300 bg-white
                           focus:outline-none focus:ring-2 focus:ring-[#567c4b] transition">
            </div>

            <!-- Botão -->
            <div class="md:col-span-1 flex items-end">
                <button type="submit"
                    class="w-full bg-[#567c4b] text-white px-4 py-2 rounded-lg font-medium
                           hover:bg-[#4a6d40] transition whitespace-nowrap">
                    Adicionar
                </button>
            </div>

            <!-- Descrição (full width) -->
            <div class="md:col-span-5">
                <label class="text-sm text-neutral-600 mb-1 block">Descrição (opcional)</label>
                <input type="text" name="description"
                    class="w-full px-4 py-2 rounded-lg border border-neutral-300 bg-white
                           focus:outline-none focus:ring-2 focus:ring-[#567c4b] transition"
                    placeholder="Ex: Compras do mês, Pagamento de aluguel...">
            </div>
        </form>
    </div>

    <!-- LISTA DE TRANSAÇÕES -->
    <div class="bg-white border border-[#d4e8cf] rounded-2xl shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-neutral-900">Histórico</h2>
            <span class="text-sm text-neutral-500">{{ $transactions->count() }} registro(s)</span>
        </div>

        @if($transactions->isEmpty())
            <div class="px-6 py-12 text-center">
                <svg class="w-16 h-16 mx-auto text-neutral-300 mb-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                <p class="text-neutral-500">Nenhuma transação registrada.</p>
                <p class="text-neutral-400 text-sm mt-1">Adicione sua primeira transação acima.</p>
            </div>
        @else
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Data</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Descrição</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Categoria</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Tipo</th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Valor</th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        @foreach($transactions as $t)
                            <tr class="hover:bg-gray-50 transition">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="text-sm text-neutral-700">
                                        {{ \Carbon\Carbon::parse($t->transaction_date)->format('d/m/Y') }}
                                    </span>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="text-sm text-neutral-800">
                                        {{ $t->description ?: '—' }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                        {{ $t->category ? 'bg-[#567c4b]/10 text-[#567c4b]' : 'bg-neutral-100 text-neutral-500' }}">
                                        {{ $t->category->name ?? 'Sem categoria' }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="inline-flex items-center gap-1 text-xs font-medium
                                        {{ $t->type === 'income' ? 'text-green-600' : 'text-red-500' }}">
                                        @if($t->type === 'income')
                                            <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12"/>
                                            </svg>
                                        @else
                                            <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M17 13l-5 5m0 0l-5-5m5 5V6"/>
                                            </svg>
                                        @endif
                                        {{ $t->type === 'income' ? 'Receita' : 'Despesa' }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right">
                                    <span class="text-sm font-semibold {{ $t->type === 'income' ? 'text-green-600' : 'text-red-500' }}">
                                        {{ $t->type === 'income' ? '+' : '-' }} R$ {{ number_format($t->amount, 2, ',', '.') }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right">
                                    <form action="{{ route('transactions.destroy', $t) }}" method="POST"
                                          onsubmit="return confirm('Tem certeza que deseja excluir esta transação?');">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit"
                                            class="text-neutral-400 hover:text-red-500 transition p-2">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                            </svg>
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
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
