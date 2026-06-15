<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Categorias</title>
    @vite('resources/css/app.css')
</head>
<body class="bg-gray-100 min-h-screen p-10">

    <div class="max-w-4xl mx-auto bg-white shadow rounded p-6">

        <h1 class="text-2xl font-bold mb-6">Categorias</h1>

        <form action="{{ route('categories.store') }}" method="POST" class="mb-6">
            @csrf

            <input type="text" name="name"
                placeholder="Nome da categoria"
                class="border p-2 rounded w-full mb-3">

            <select name="type"
                class="border p-2 rounded w-full mb-3">
                <option value="expense">Despesa</option>
                <option value="income">Receita</option>
            </select>

            <button class="bg-blue-600 text-white px-4 py-2 rounded">
                Criar Categoria
            </button>
        </form>

        <div class="space-y-2">
            @foreach ($categories as $category)
                <div class="flex justify-between border-b py-2">
                    <span>{{ $category->name }}</span>
                    <span>{{ $category->type }}</span>
                </div>
            @endforeach
        </div>

    </div>

</body>
</html>
