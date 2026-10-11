<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title inertia>Sistema Salomão</title>
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
