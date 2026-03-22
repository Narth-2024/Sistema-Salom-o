<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>It's Working</title>
<script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="min-h-screen flex items-center justify-center bg-black text-white">

    <div class="text-center">
        <h1 class="text-5xl font-bold mb-6">✅ It's Working</h1>
        <p class="text-white/70 mb-8">
            O sistema autenticou corretamente.
        </p>

        <a href="{{ route('home') }}"
           class="bg-[#567c4b] px-8 py-4 rounded-lg hover:opacity-90 transition">
            Voltar para Home
        </a>
    </div>

</body>
</html>
