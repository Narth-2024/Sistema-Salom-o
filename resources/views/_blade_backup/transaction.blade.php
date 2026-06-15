<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Transações</title>
    @vite('resources/css/app.css')
</head>
<body class="bg-gray-100 p-10">

<div class="max-w-5xl mx-auto bg-white p-6 rounded shadow">

    <h1 class="text-2xl font-bold mb-6">Transações</h1>

    <form action="{{ route('transactions.store') }}" method="POST" class="mb-6">
        @csrf

        <input type="number" step="0.01" name="amount"
            placeholder="Valor"
            class="border p-2 rounded w-full mb-3">

        <input type="date" name="transaction_date"
            class="border p-2 rounded w-full mb-3">

        <input type="text" name="description"
            placeholder="Descrição"
            class="border p-2 rounded w-full mb-3">

        <select name="type" class="border p-2 rounded w-full mb-3">
            <option value="expense">Despesa</option>
            <option value="income">Receita</option>
        </select>

        <select name="category_id" class="border p-2 rounded w-full mb-3">
            @foreach(auth()->user()->categories as $category)
                <option value="{{ $category->id }}">
                    {{ $category->name }}
                </option>
            @endforeach
        </select>

        <button class="bg-green-600 text-white px-4 py-2 rounded">
            Registrar
        </button>
    </form>

    @foreach($transactions as $transaction)
        <div class="border-b py-2 flex justify-between">
            <div>
                <strong>{{ $transaction->category->name }}</strong><br>
                <small>{{ $transaction->description }}</small>
            </div>
            <div>
                R$ {{ number_format($transaction->amount, 2, ',', '.') }}
            </div>
        </div>
    @endforeach

</div>

</body>
</html>
