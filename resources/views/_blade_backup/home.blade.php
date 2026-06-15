<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema Salomão - Controle Financeiro</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Inter', sans-serif; }

        @keyframes fadeUp {
            from { opacity: 0; transform: translateY(30px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeUp {
            animation: fadeUp 0.8s ease forwards;
            opacity: 0;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50%      { transform: translateY(-20px); }
        }
        .animate-float {
            animation: float 6s ease-in-out infinite;
        }
    </style>
    @viteReactRefresh
    @vite(['resources/js/app.js'])
</head>
<body class="bg-[#F4FDFF] text-neutral-800 overflow-x-hidden">
    <div id="app"></div>
</body>
</html>
