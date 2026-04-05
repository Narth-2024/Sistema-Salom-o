<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>1✕ Cadastro</title>
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

    <div class="px-20 py-16 flex flex-col justify-center">
        <div class="mb-12 transition-all duration-500 ease-in-out">
            <h2 id="formTitle" class="text-4xl font-semibold text-neutral-900 transition-all duration-500">
                Criar conta
            </h2>
            <p class="text-sm text-neutral-500 mt-3">
                <span id="formText">Já possui cadastro?</span>
                <button type="button" onclick="toggleAuthMode()" id="toggleLink"
                        class="font-medium text-black hover:underline ml-1 hover:text-[#567c4b]">
                    Entrar
                </button>
            </p>
        </div>

        <form id="authForm" class="space-y-6 transition-all duration-500 ease-in-out">
            <div id="registerFields"
                 class="space-y-6 transition-all duration-500 ease-in-out opacity-100 translate-y-0 max-h-96 overflow-hidden">
                <div class="grid grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label class="text-sm text-neutral-600">Nome</label>
                        <input type="text" id="firstName" placeholder="Nome"
                            class="w-full px-4 py-3 rounded-lg border bg-[#F4FDFF]
                            focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition
                            border-neutral-300">
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm text-neutral-600">CPF</label>
                        <input type="text" id="cpf" placeholder="xxx.xxx.xxx-xx" maxlength="14"
                            class="w-full px-4 py-3 rounded-lg border bg-[#F4FDFF]
                            focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition
                            border-neutral-300">
                    </div>
                </div>
            </div>

            <div class="space-y-2">
                <label class="text-sm text-neutral-600">Email</label>
                <input type="email" id="emailAddress" placeholder="exemplo@gmail.com"
                    class="w-full px-4 py-3 rounded-lg border bg-[#F4FDFF]
                    focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition
                    border-neutral-300">
            </div>

            <div class="space-y-2">
                <label class="text-sm text-neutral-600">Senha</label>
                <input type="password" id="password" placeholder="exemplo123"
                    class="w-full px-4 py-3 rounded-lg border bg-[#F4FDFF]
                    focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition
                    border-neutral-300">
            </div>

            <button type="button" id="submitButton"
                class="w-full bg-black text-white py-3 rounded-lg font-medium
                hover:bg-neutral-800 transition tracking-wide disabled:opacity-50 disabled:cursor-not-allowed">
                Criar conta
            </button>

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

<script type="text/javascript">
window.CSRF_TOKEN = "{{ csrf_token() }}";
window.VERIFY_SESSION_URL = "{{ route('auth.verify-session') }}";
window.WORK_URL = "{{ route('work') }}";
let isLogin = false;
let clerk = null;

function toggleAuthMode() {
    const title = document.getElementById('formTitle');
    const text = document.getElementById('formText');
    const toggleLink = document.getElementById('toggleLink');
    const registerFields = document.getElementById('registerFields');
    const submitButton = document.getElementById('submitButton');
    isLogin = !isLogin;
    if (isLogin) {
        title.classList.add("opacity-0","-translate-y-2");
        setTimeout(() => {
            document.title = "1✕ Login";
            title.innerText = "Entrar na conta";
            text.innerText = "Não possui conta?";
            toggleLink.innerText = "Criar conta";
            submitButton.innerText = "Logar";
            registerFields.classList.remove("opacity-100","translate-y-0","max-h-96");
            registerFields.classList.add("opacity-0","-translate-y-4","max-h-0");
            title.classList.remove("opacity-0","-translate-y-2");
        }, 200);
    } else {
        title.classList.add("opacity-0","-translate-y-2");
        setTimeout(() => {
            document.title = "1✕ Cadastro";
            title.innerText = "Criar conta";
            text.innerText = "Já possui cadastro?";
            toggleLink.innerText = "Entrar";
            submitButton.innerText = "Criar conta";
            registerFields.classList.remove("opacity-0","-translate-y-4","max-h-0");
            registerFields.classList.add("opacity-100","translate-y-0","max-h-96");
            title.classList.remove("opacity-0","-translate-y-2");
        }, 200);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function (e) {
            let v = e.target.value.replace(/\D/g, '');
            if (v.length > 11) v = v.slice(0, 11);
            v = v.replace(/(\d{3})(\d)/, '$1.$2');
            v = v.replace(/(\d{3})(\d)/, '$1.$2');
            v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = v;
        });
    }
});

async function sendSessionToBackend(sessionId, cpf) {
    const body = new URLSearchParams();
    body.append('_token', window.CSRF_TOKEN);
    body.append('session_id', sessionId);
    if (cpf) body.append('cpf', cpf);

    const resp = await fetch(window.VERIFY_SESSION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
    });

    const data = await resp.json();
    if (data.success && data.redirect) {
        window.location.href = data.redirect;
    } else {
        throw new Error(data.message || 'Erro ao validar sessão.');
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    // Load Clerk JS dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@clerk/clerk-js@6/dist/clerk.browser.js';
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    // Wait for Clerk to load
    try {
        await new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error('Clerk SDK não carregou.')), 15000);
            const check = setInterval(() => {
                if (window.Clerk) { clearInterval(check); clearTimeout(timer); resolve(); }
            }, 50);
        });

        clerk = window.Clerk;

        // Initialize Clerk with publishable key
        await clerk.load({
            publishableKey: @js(config('services.clerk.publishable_key', ''))
        });

        console.log('Clerk initialized, session:', clerk.session);
    } catch (err) {
        console.error('Clerk init error:', err);
        return;
    }

    // Handle submit
    const submitBtn = document.getElementById('submitButton');
    submitBtn.addEventListener('click', async function () {
        console.log('[auth] Submit clicked, isLogin:', isLogin);
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Processando...';

        const email = document.getElementById('emailAddress').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
            alert('Preencha email e senha.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = isLogin ? 'Logar' : 'Criar conta';
            return;
        }

        try {
            if (isLogin) {
                // LOGIN
                console.log('[auth] Attempting sign in...');
                const signIn = await clerk.client.signIn.create({
                    identifier: email,
                    password: password,
                });
                console.log('[auth] signIn status:', signIn.status);

                if (signIn.status === 'complete') {
                    await clerk.setActive({ session: signIn.createdSessionId || clerk.client.activeSessions[0]?.id });
                    console.log('[auth] session after login:', clerk.session?.id);
                }

                const activeSession = clerk.session ?? clerk.client.activeSessions[0];
                if (!activeSession?.id) {
                    throw new Error('Nenhuma sessão ativa encontrada. Verifique as configurações do Clerk (Sessions).');
                }

                console.log('[auth] Active session:', activeSession.id);
                await sendSessionToBackend(activeSession.id, null);
            } else {
                // SIGN UP
                const cpf = document.getElementById('cpf')?.value?.replace(/\D/g, '') || '';
                const firstName = document.getElementById('firstName')?.value || '';
                console.log('[auth] Attempting sign up...', { email, cpf, firstName });

                const signUp = await clerk.client.signUp.create({
                    emailAddress: email,
                    password: password,
                    firstName: firstName,
                    unsafeMetadata: cpf ? { cpf } : {},
                });

                console.log('[auth] signUp status:', signUp.status);
                console.log('[auth] activeSessions:', clerk.client.activeSessions);

                if (signUp.status === 'complete') {
                    await clerk.setActive({ session: signUp.createdSessionId || clerk.client.activeSessions[0]?.id });
                    console.log('[auth] session after signup:', clerk.session?.id);

                    const activeSession = clerk.session ?? clerk.client.activeSessions[0];
                    if (!activeSession?.id) {
                        throw new Error('Nenhuma sessão ativa encontrada.');
                    }
                    console.log('[auth] Sending session to backend:', activeSession.id);
                    await sendSessionToBackend(activeSession.id, cpf);
                } else {
                    console.warn('[auth] Sign up incomplete, status:', signUp.status, signUp);
                    throw new Error('Cadastro incompleto. Verifique seu email para continuar.');
                }
            }
        } catch (err) {
            console.error('Clerk auth error:', err);
            console.error('Clerk auth detail:', JSON.stringify(err.errors || err.response?.data || err, null, 2));
            alert(err.errors?.[0]?.longMessage || err.message || 'Erro ao autenticar.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = isLogin ? 'Logar' : 'Criar conta';
        }
    });
});
</script>
</body>
</html>
