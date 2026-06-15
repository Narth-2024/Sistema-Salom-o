<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema Salomão - Autenticação</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-[#F4FDFF] min-h-screen flex items-center justify-center">

    <!-- NAVBAR -->
    <nav class="fixed top-0 w-full z-50 bg-[#3a5433] shadow-xl">
        <div class="max-w-6xl mx-auto flex items-center justify-between px-8 py-5">
            <h1 class="text-lg font-bold text-white tracking-wide">Sistema Salomão</h1>
            <a href="{{ url('/') }}"
               class="text-white/80 px-4 py-2 text-sm hover:text-white transition">
                Voltar
            </a>
        </div>
    </nav>

    <!-- AUTH CARD -->
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-neutral-900" id="formTitle">
                Criar conta
            </h2>
            <p class="text-sm text-neutral-500 mt-2">
                <span id="formText">Já possui cadastro?</span>
                <button type="button"
                        onclick="toggleAuthMode()"
                        id="toggleLink"
                        class="font-medium text-[#567c4b] hover:text-[#3a5433] hover:underline ml-1">
                    Entrar
                </button>
            </p>
        </div>

        <form id="authForm" action="" method="POST" class="space-y-5">
            @csrf
            <input type="hidden" name="_method" value="">
            <input type="hidden" id="authType" value="register">

            <div id="registerFields" class="space-y-4">
                <div class="space-y-1.5">
                    <label class="text-sm text-neutral-600">Nome</label>
                    <input type="text" name="name" id="name"
                           placeholder="Nome completo"
                           class="w-full px-4 py-3 rounded-lg border border-neutral-200 bg-[#F4FDFF]
                                  focus:outline-none focus:ring-2 focus:ring-[#567c4b] focus:border-[#567c4b] transition">
                </div>
            </div>

            <div class="space-y-1.5">
                <label class="text-sm text-neutral-600">Email</label>
                <input type="email" name="email" id="email"
                       placeholder="exemplo@gmail.com"
                       class="w-full px-4 py-3 rounded-lg border border-neutral-200 bg-[#F4FDFF]
                              focus:outline-none focus:ring-2 focus:ring-[#567c4b] focus:border-[#567c4b] transition">
            </div>

            <div class="space-y-1.5">
                <label class="text-sm text-neutral-600">Senha</label>
                <input type="password" name="password" id="password"
                       placeholder="••••••••"
                       class="w-full px-4 py-3 rounded-lg border border-neutral-200 bg-[#F4FDFF]
                              focus:outline-none focus:ring-2 focus:ring-[#567c4b] focus:border-[#567c4b] transition">
            </div>

            @if (Route::has('password.request'))
                <div class="space-y-1.5">
                    <label class="text-sm text-neutral-600">
                        <input type="checkbox" name="remember">
                        Lembrar-me
                    </label>
                    <p class="text-xs text-neutral-400 text-right">
                        <a href="{{ route('password.request') }}" class="font-medium text-[#567c4b] hover:underline">
                            Esqueceu a senha?
                        </a>
                    </p>
                </div>
            @endif

            <div class="space-y-2">
                <button type="submit"
                        id="submitButton"
                        class="w-full bg-[#567c4b] text-white py-3 rounded-lg font-medium
                               hover:bg-[#3a5433] transition tracking-wide disabled:opacity-50 disabled:cursor-not-allowed">
                    {{ $authType == 'register' ? 'Criar conta' : 'Entrar' }}
                </button>
            </div>
        </form>

        <div class="mt-4 text-xs text-neutral-400 text-center">
            © 2026 Salomão
        </div>
    </div>

    <script>
        let isLogin = false;

        function toggleAuthMode() {
            const title = document.getElementById('formTitle');
            const text = document.getElementById('formText');
            const toggleLink = document.getElementById('toggleLink');
            const registerFields = document.getElementById('registerFields');
            const submitButton = document.getElementById('submitButton');
            const authTypeInput = document.getElementById('authType');
            const form = document.getElementById('authForm');

            isLogin = !isLogin;
            if (isLogin) {
                // Switch to login
                title.innerText = 'Entrar na conta';
                text.innerText = 'Não possui conta?';
                toggleLink.innerText = 'Criar conta';
                submitButton.innerText = 'Entrar';
                authTypeInput.value = 'login';
                registerFields.classList.add('hidden'); // Hide name field
                form.action = "{{ url('/login') }}";
                form.method = "POST";
            } else {
                // Switch to register
                title.innerText = 'Criar conta';
                text.innerText = 'Já possui cadastro?';
                toggleLink.innerText = 'Entrar';
                submitButton.innerText = 'Criar conta';
                authTypeInput.value = 'register';
                registerFields.classList.remove('hidden'); // Show name field
                form.action = "{{ url('/register') }}";
                form.method = "POST";
            }
            // Update hidden _method field (though not needed for POST)
            document.querySelector('input[name="_method"]').value = '';
        }

        // Initialize form action based on default state (register)
        document.getElementById('authForm').action = "{{ url('/register') }}";
        document.getElementById('authForm').method = "POST";
    </script>

</body>
</html>
