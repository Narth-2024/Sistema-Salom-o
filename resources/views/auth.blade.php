<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>1️⃣ Cadastro</title>
<script src="https://cdn.tailwindcss.com"></script>

<style>
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    input[type=number] { -moz-appearance: textfield; }
</style>
</head>

<body class="min-h-screen bg-[#567c4b] flex items-center justify-center px-6 py-10">

<div class="w-full max-w-6xl bg-[#F4FDFF] rounded-3xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] grid grid-cols-2 overflow-hidden">

    <!-- ESQUERDA -->
    <div class="bg-black text-white p-16 flex flex-col justify-between">
        <div class="space-y-6">
            <h1 class="text-2xl font-semibold tracking-wide">Sistema Salomão</h1>
            <div class="w-12 h-[2px] bg-[#F4FDFF]/60"></div>
            <p class="text-white/70 leading-relaxed text-lg font-light max-w-sm">
                texto genérico pra não ficar vazio 😃👍.<br>isso é sobre dinheiro, não sobre administrar mais de 500 mulheres ao msm tempo
            </p>
        </div>

        <div class="space-y-3 text-sm text-white/50">
            <p>Bora guardar dinheiro meu nobre</p>
            <p>Tá bonito, só é os guris demais</p>
            <p>Kct o Sol nasceu</p>
        </div>

        <p class="text-xs text-white/30">
            © 2026 Salomão. Todos os direitos reservados para os guris.
        </p>
    </div>

    <!-- DIREITA -->
    <div class="px-20 py-16 flex flex-col justify-center">

        <div class="mb-12 transition-all duration-500 ease-in-out">
            <h2 id="formTitle" class="text-4xl font-semibold text-neutral-900 transition-all duration-500">
                Criar conta
            </h2>

            <p class="text-sm text-neutral-500 mt-3">
                <span id="formText">Já possui cadastro?</span>
                <button type="button"
                        onclick="toggleAuthMode()"
                        id="toggleLink"
                        class="font-medium text-black hover:underline ml-1 hover:text-[#567c4b]">
                    Entrar
                </button>
            </p>
        </div>
        <form id="authForm" method="POST" action="{{ route('register') }}" class="space-y-6 transition-all duration-500 ease-in-out">
            @csrf

            <!-- REGISTRO -->
            <div id="registerFields"
                 class="space-y-6 transition-all duration-500 ease-in-out opacity-100 translate-y-0 max-h-96 overflow-hidden">

                <div class="grid grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label class="text-sm text-neutral-600">Nome</label>
                        <input type="text"
                            placeholder="Nome"
                            name="first_name"
                            value="{{ old('name') }}"
                            class="w-full px-4 py-3 rounded-lg border bg-[#F4FDFF]
                            focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition
                            border-neutral-300">
                    </div>

                    <div class="space-y-2">
                        <label class="text-sm text-neutral-600">CPF</label>
                        <input type="text"
                            placeholder="xxx.xxx.xxx-xx"
                            id="cpf"
                            name="cpf"
                            maxlength="14"
                            value="{{ old('cpf') }}"
                            class="w-full px-4 py-3 rounded-lg border bg-[#F4FDFF]
                            focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition
                            border-neutral-300">
                    </div>
                </div>
            </div>

            <!-- email -->
            <div class="space-y-2">
                <label class="text-sm text-neutral-600">Email</label>
                <input type="email"
                    placeholder="exemplo@gmail.com"
                    name="email"
                    value="{{ old('email') }}"
                    class="w-full px-4 py-3 rounded-lg border bg-[#F4FDFF]
                    focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition
                    border-neutral-300">
            </div>

            <!-- senha -->
            <div class="space-y-2">
                <label class="text-sm text-neutral-600">Senha</label>
                <input type="password"
                    placeholder="exemplo123"
                    name="password"
                    class="w-full px-4 py-3 rounded-lg border bg-[#F4FDFF]
                    focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition
                    border-neutral-300">
            </div>

            <button id="submitButton" type="submit"
                class="w-full bg-black text-white py-3 rounded-lg font-medium
                hover:bg-neutral-800 transition tracking-wide">
                Criar conta
            </button>

            <!-- login -->
            <div id="socialSection" class="transition-all duration-500 ease-in-out opacity-100 translate-y-0">

                <div class="flex items-center gap-4 pt-6">
                    <div class="flex-1 h-px bg-neutral-300"></div>
                    <span class="text-xs text-neutral-500 uppercase tracking-wider">
                        ou continuar com
                    </span>
                    <div class="flex-1 h-px bg-neutral-300"></div>
                </div>

                <div class="grid grid-cols-2 gap-4 mt-6">
                    <button type="button"
                        class="py-3 bg-black text-white border border-neutral-300 rounded-lg
                        hover:bg-neutral-800 transition text-sm font-medium">
                        Google
                    </button>

                    <button type="button"
                        class="py-3 bg-black text-white border border-neutral-300 rounded-lg
                        hover:bg-neutral-800 transition text-sm font-medium">
                        Outro
                    </button>
                </div>

            </div>

        </form>

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
    const form = document.getElementById('authForm');
    const socialSection = document.getElementById('socialSection');

    isLogin = !isLogin;

    if (isLogin) {

        title.classList.add("opacity-0","-translate-y-2");

        setTimeout(() => {

            document.title = "1️⃣ Login";

            title.innerText = "Entrar na conta";
            text.innerText = "Não possui conta?";
            toggleLink.innerText = "Criar conta";
            submitButton.innerText = "Logar conta";
            form.action = "{{ route('login') }}";

            registerFields.classList.remove("opacity-100","translate-y-0","max-h-96");
            registerFields.classList.add("opacity-0","-translate-y-4","max-h-0");

            title.classList.remove("opacity-0","-translate-y-2");

        }, 200);

    } else {

        title.classList.add("opacity-0","-translate-y-2");

        setTimeout(() => {

            document.title = "1️⃣ Cadastro";

            title.innerText = "Criar conta";
            text.innerText = "Já possui cadastro?";
            toggleLink.innerText = "Entrar";
            submitButton.innerText = "Criar conta";
            form.action = "{{ route('register') }}";

            registerFields.classList.remove("opacity-0","-translate-y-4","max-h-0");
            registerFields.classList.add("opacity-100","translate-y-0","max-h-96");

            title.classList.remove("opacity-0","-translate-y-2");

        }, 200);
    }
}


document.addEventListener("DOMContentLoaded", function() {
    const cpfInput = document.getElementById('cpf');
    if (!cpfInput) return;

    cpfInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = value;
    });
});

</script>

</body>
</html>
