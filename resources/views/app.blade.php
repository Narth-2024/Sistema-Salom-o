<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title inertia>Sistema Salomão</title>
    <meta name="description" content="Salomão — controle financeiro inteligente. Organize transações, categorias, tags e acompanhe seus investimentos com relatórios claros no celular ou no computador.">
    <meta name="robots" content="index, follow">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Salomão">
    <meta property="og:title" content="Salomão — Controle Financeiro Inteligente">
    <meta property="og:description" content="Organize transações, categorias e tags, acompanhe investimentos e tenha relatórios claros da sua vida financeira.">
    <meta property="og:url" content="https://sistema-salom-o.vercel.app/">
    <meta property="og:image" content="https://sistema-salom-o.vercel.app/icon-512.png">
    <meta property="og:image:alt" content="Salomão — Controle Financeiro Inteligente">
    <meta property="og:locale" content="pt_BR">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="Salomão — Controle Financeiro Inteligente">
    <meta name="twitter:description" content="Organize transações, categorias e tags, acompanhe investimentos e tenha relatórios claros da sua vida financeira.">
    <meta name="twitter:image" content="https://sistema-salom-o.vercel.app/icon-512.png">
    <link rel="manifest" href="/manifest.webmanifest">
    <meta name="theme-color" content="#3ecf8e">
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-title" content="Salomão">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <script>
        (function() {
            var theme = localStorage.getItem('salomao-theme');
            if (theme !== 'dark') document.documentElement.classList.add('light');
        })();
    </script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Inter', sans-serif; }
    </style>
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead
</head>
<body>
    @inertia
</body>
</html>
