@extends('layouts.app')

@section('content')
<div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-start mb-6">
            <h1 class="text-2xl font-bold text-gray-800">{{ $category->name }}</h1>
            <div class="space-x-3">
                <a href="{{ route('categories.edit', $category) }}"
                   class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">
                    Editar
                </a>
                <form action="{{ route('categories.destroy', $category) }}" method="POST" class="inline">
                    @csrf
                    @method('DELETE')
                    <button type="submit"
                            onclick="return confirm('Tem certeza que deseja excluir esta categoria?')"
                            class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                        Excluir
                    </button>
                </form>
                <a href="{{ route('categories.index') }}"
                   class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                    Voltar
                </a>
            </div>
        </div>

        <div class="space-y-4">
            <p class="text-gray-600"><strong>Tipo:</strong> {{ ucfirst($category->type) }}</p>
            <p class="text-gray-600"><strong>Criada em:</strong> {{ $category->created_at->format('d/m/Y H:i') }}</p>
            <p class="text-gray-600"><strong>Atualizada em:</strong> {{ $category->updated_at->format('d/m/Y H:i') }}</p>
        </div>

        @if($transactions->isNotEmpty())
            <div class="mt-8">
                <h2 class="text-xl font-bold text-gray-800 mb-4">Transações nesta categoria</h2>
                <div class="overflow-x-auto">
                    <table class="min-w-full bg-white">
                        <thead class="bg-gray-100">
                            <tr>
                                <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">Data</th>
                                <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">Descrição</th>
                                <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">Valor</th>
                                <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">Tipo</th>
                                <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($transactions as $transaction)
                                <tr class="border-t hover:bg-gray-50">
                                    <td class="px-4 py-2 text-sm text-gray-700">{{ $transaction->transaction_date->format('d/m/Y') }}</td>
                                    <td class="px-4 py-2 text-sm text-gray-700">{{ $transaction->description ?? '-' }}</td>
                                    <td class="px-4 py-2 text-sm font-medium">{{ $transaction->type === 'income' ? 'text-green-600' : 'text-red-600' }}">{{ number_format($transaction->amount, 2, ',', '.') }}</td>
                                    <td class="px-4 py-2 text-sm text-gray-700">{{ ucfirst($transaction->type) }}</td>
                                    <td class="px-4 py-2 text-sm space-x-2">
                                        <a href="{{ route('transactions.show', $transaction) }}"
                                           class="text-blue-600 hover:text-blue-800 underline">Ver</a>
                                        <a href="{{ route('transactions.edit', $transaction) }}"
                                           class="text-yellow-600 hover:text-yellow-800 underline">Editar</a>
                                        <form action="{{ route('transactions.destroy', $transaction) }}" method="POST" class="inline">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit"
                                                    onclick="return confirm('Tem certeza que deseja excluir esta transação?')"
                                                    class="text-red-600 hover:text-red-800 underline">
                                                Excluir
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        @else
            <p class="text-gray-500 text-center py-8">Nenhuma transação encontrada nesta categoria.</p>
        @endif
    </div>
</div>
@endsection