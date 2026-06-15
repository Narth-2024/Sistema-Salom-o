<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dashboard — Sistema Salomão</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://cdn.tailwindcss.com"></script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
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
<main class="max-w-7xl mx-auto px-6 py-10">

    <div class="mb-8">
        <h1 class="text-3xl font-bold text-neutral-900">
            Olá, {{ auth()->user()->name ?? 'Usuário' }}
        </h1>
        <p class="text-neutral-500 mt-1">Aqui está o resumo das suas finanças.</p>
    </div>

    <!-- CARDS DE RESUMO -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <!-- Receitas -->
        <div class="bg-white border border-[#d4e8cf] rounded-2xl p-6 shadow-sm">
            <div class="flex items-center justify-between mb-4">
                <p class="text-sm font-medium text-neutral-500 uppercase tracking-wide">Receitas</p>
                <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12"/>
                    </svg>
                </div>
            </div>
            <p class="text-3xl font-extrabold text-green-600">
                R$ {{ number_format($income, 2, ',', '.') }}
            </p>
        </div>

        <!-- Despesas -->
        <div class="bg-white border border-red-100 rounded-2xl p-6 shadow-sm">
            <div class="flex items-center justify-between mb-4">
                <p class="text-sm font-medium text-neutral-500 uppercase tracking-wide">Despesas</p>
                <div class="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17 13l-5 5m0 0l-5-5m5 5V6"/>
                    </svg>
                </div>
            </div>
            <p class="text-3xl font-extrabold text-red-500">
                R$ {{ number_format($expense, 2, ',', '.') }}
            </p>
        </div>

        <!-- Saldo -->
        <div class="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
            <div class="flex items-center justify-between mb-4">
                <p class="text-sm font-medium text-neutral-500 uppercase tracking-wide">Saldo</p>
                <div class="w-10 h-10
    @if($balance >= 0) bg-green-100 @else bg-red-100 @endif
                    rounded-xl flex items-center justify-center">
                    <svg class="w-5 h-5 {{ $balance >= 0 ? 'text-green-600' : 'text-red-500' }}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                    </svg>
                </div>
            </div>
            <p class="text-3xl font-extrabold {{ $balance >= 0 ? 'text-green-700' : 'text-red-600' }}">
                R$ {{ number_format($balance, 2, ',', '.') }}
            </p>
        </div>
    </div>

    <!-- GRÁFICO E ÚLTIMAS TRANSAÇÕES -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10">

        <!-- Gráfico: despesas por categoria -->
        <div class="lg:col-span-2 bg-white border border-[#d4e8cf] rounded-2xl p-6 shadow-sm">
            <h2 class="text-lg font-semibold text-neutral-900 mb-4">Despesas por categoria</h2>
            <canvas id="categoryChart"></canvas>
            @if($expensesByCategory->isEmpty())
                <p class="text-neutral-400 text-sm text-center mt-4">Sem despesas registradas.</p>
            @endif
        </div>

        <!-- Últimas transações -->
        <div class="lg:col-span-3 bg-white border border-[#d4e8cf] rounded-2xl p-6 shadow-sm">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-semibold text-neutral-900">Últimas transações</h2>
                <a href="{{ route('transactions.index') }}"
                   class="text-sm text-[#567c4b] hover:underline font-medium">
                    Ver todas →
                </a>
            </div>

            @if($recentTransactions->isEmpty())
                <p class="text-neutral-400 text-sm text-center py-8">Nenhuma transação registrada.</p>
            @else
                <div class="space-y-3">
                    @foreach($recentTransactions as $t)
                        <div class="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                            <div class="flex items-center gap-3">
                                <div class="w-9 h-9 rounded-xl flex items-center justify-center
                                    {{ $t->type === 'income' ? 'bg-green-100' : 'bg-red-100' }}">
                                    @if($t->type === 'income')
                                        <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12"/>
                                        </svg>
                                    @else
                                        <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M17 13l-5 5m0 0l-5-5m5 5V6"/>
                                        </svg>
                                    @endif
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-neutral-800">
                                        {{ $t->category->name ?? 'Sem categoria' }}
                                    </p>
                                    <p class="text-xs text-neutral-400">
                                        {{ $t->description ?: '—' }}
                                    </p>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="text-sm font-semibold
                                    {{ $t->type === 'income' ? 'text-green-600' : 'text-red-500' }}">
                                    {{ $t->type === 'income' ? '+' : '-' }}
                                    R$ {{ number_format($t->amount, 2, ',', '.') }}
                                </p>
                                <p class="text-xs text-neutral-400">
                                    {{ \Carbon\Carbon::parse($t->transaction_date)->format('d/m/Y') }}
                                </p>
                            </div>
                        </div>
                    @endforeach
                </div>
            @endif
        </div>
    </div>

    <!-- LINK RÁPIDO: nova transação -->
    <div class="bg-[#edf6ea] border border-[#d4e8cf] rounded-2xl p-8 text-center">
        <h3 class="text-lg font-semibold text-neutral-900 mb-2">Registrar nova transação</h3>
        <p class="text-neutral-500 text-sm mb-4">Adicione uma entrada ou saída rapidamente.</p>
        <a href="{{ route('transactions.index') }}"
           class="bg-[#567c4b] text-white px-8 py-3 rounded-xl font-medium
                  hover:bg-[#4a6d40] hover:shadow-lg transition">
            Adicionar transação
        </a>
    </div>

</main>

<script>
@if(!$expensesByCategory->isEmpty())
const ctx = document.getElementById('categoryChart');
new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: {!! json_encode($expensesByCategory->pluck('name')) !!},
        datasets: [{
            data: {!! json_encode($expensesByCategory->pluck('total')) !!},
            backgroundColor: ['#567c4b', '#82aa77', '#d4edcc', '#3a5433', '#6e9562'],
            borderWidth: 0,
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: { padding: 16, usePointStyle: true, font: { family: 'Inter' } }
            }
        }
    }
});
@endif
</script>

</body>
</html>
