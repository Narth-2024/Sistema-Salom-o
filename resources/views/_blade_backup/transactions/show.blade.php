@extends('layouts.app')

@section('content')
<div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-start mb-6">
            <h1 class="text-2xl font-bold text-gray-800">Transação #{{ $transaction->id }}</h1>
            <div class="space-x-3">
                <a href="{{ route('transactions.edit', $transaction) }}"
                   class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">
                    Editar
                </a>
                <form action="{{ route('transactions.destroy', $transaction) }}" method="POST" class="inline">
                    @csrf
                    @method('DELETE')
                    <button type="submit"
                            onclick="return confirm('Tem certeza que deseja excluir esta transação?')"
                            class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                        Excluir
                    </button>
                </form>
                <a href="{{ route('transactions.index') }}"
                   class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                    Voltar
                </a>
            </div>
        </div>

        <div class="space-y-4">
            <p class="text-gray-600"><strong>Descrição:</strong> {{ $transaction->description ?? 'Não informado' }}</p>
            <p class="text-gray-600"><strong>Valor:</strong>
                <span class="{{ $transaction->type === 'income' ? 'text-green-600' : 'text-red-600' }} font-medium">
                    R$ {{ number_format($transaction->amount, 2, ',', '.') }}
                </span>
            </p>
            <p class="text-gray-600"><strong>Tipo:</strong> {{ ucfirst($transaction->type) }}</p>
            <p class="text-gray-600"><strong>Data:</strong> {{ $transaction->transaction_date->format('d/m/Y') }}</p>
            <p class="text-gray-600"><strong>Categoria:</strong>
                @if($transaction->category)
                    <span class="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded">{{ $transaction->category->name }}</span>
                @else
                    <span class="text-gray-500">Sem categoria</span>
                @endif
            </p>
            <p class="text-gray-600"><strong>Criada em:</strong> {{ $transaction->created_at->format('d/m/Y H:i') }}</p>
            <p class="text-gray-600"><strong>Atualizada em:</strong> {{ $transaction->updated_at->format('d/m/Y H:i') }}</p>
        </div>
    </div>
</div>
@endsection