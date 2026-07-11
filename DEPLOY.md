# 🚀 Guia Completo de Deploy — Salomão no Render

---

## Antes de começar

### 1. Commit e push do código atual

```bash
# Verificar o que será commitado
git status

# Adicionar tudo e commitar
git add -A
git commit -m "Deploy prep"

# Enviar para o GitHub/GitLab
git push origin main
```

> Se não tiver repositório remoto:
> ```bash
> # Criar repositório no GitHub primeiro, depois:
> git remote add origin https://github.com/seu-usuario/salomao.git
> git branch -M main
> git push -u origin main
> ```

---

## 1. Criar o Web Service no Render

### 1.1. Conta no Render

1. Acesse [https://dashboard.render.com](https://dashboard.render.com)
2. Crie conta (Google ou GitHub), ou faça login
3. No plano **Free** (grátis) você consegue fazer tudo

### 1.2. Conectar repositório via Blueprint

> ⚠️ **Importante:** Use **Blueprint** (não Web Service). O Blueprint lê o `render.yaml` e usa Docker (`env: docker`) para rodar o PHP. Se criar como Web Service manual, você precisaria configurar tudo do zero.

1. Clique em **New +** (topo direito) → **Blueprint**
2. Escolha **GitHub** (ou GitLab/Bitbucket)
3. Autorize o Render a acessar seus repositórios
4. Selecione o repositório `salomao`
5. Selecione o branch `main`

### 1.3. Aplicar configuração automática

O Render vai detectar o arquivo `render.yaml` e preencher tudo:

- **Name:** `salomao`
- **Runtime:** `Docker` (o `Dockerfile` na raiz do projeto contém PHP 8.2 + Node + Composer)
- **Build:** acontece dentro da imagem Docker (composer install, npm build, caches)
- **Start:** `php artisan migrate --force && php artisan serve`
- **Plan:** Free

Clique em **Apply** para confirmar.

---

## 2. Preencher as variáveis de ambiente

### 2.1. Acessar a tela de Environment

Depois de aplicar o `render.yaml`, você vai cair na tela de configuração do web service. Role até a seção **Environment Variables**.

### 2.2. Adicionar cada variável

Clique em **Add Environment Variable** para cada uma abaixo. **ATENÇÃO:** para chaves e senhas, marque a opção **Secret** (ícone de cadeado) — o campo fica com valor oculto.

#### APP_KEY (obrigatório — geração única)

```bash
# Rode no seu terminal local OU no servidor após o deploy:
php artisan key:generate --show
# Exemplo de saída: base64:oMtbQ6pLqi270BXEX0Hj+5IA8fGg124F5L+oDF8C4ww=
```

Cole o valor gerado no campo **Value**.

| Variável | Value | Secret? |
|---|---|---|
| `APP_KEY` | `base64:...` (o que gerou agora) | ✅ Sim |

#### APP_URL

| Variável | Value | Secret? |
|---|---|---|
| `APP_URL` | `https://salomao.onrender.com` | ❌ Não |

Troque `salomao` pelo nome que o Render gerou ou que você escolheu.

#### Banco de Dados (Supabase)

> **Onde pegar:** Dashboard Supabase → **Project Settings** → **Database** → **Connection string**

| Variável | Value | Secret? |
|---|---|---|
| `DB_HOST` | `db.seu-projeto.supabase.co` | ❌ Não |
| `DB_PORT` | `5432` | ❌ Não |
| `DB_DATABASE` | `postgres` | ❌ Não |
| `DB_USERNAME` | `postgres` | ❌ Não |
| `DB_PASSWORD` | (a senha do seu banco) | ✅ Sim |

#### Clerk (Autenticação)

> **Onde pegar:** Dashboard do Clerk → **API Keys**

| Variável | Value | Secret? |
|---|---|---|
| `CLERK_PUBLISHABLE_KEY` | `pk_test_...` (começa com `pk_`) | ❌ Não |
| `CLERK_SECRET_KEY` | `sk_test_...` (começa com `sk_`) | ✅ Sim |
| `CLERK_FRONTEND_API_URL` | `https://sua-instancia.clerk.accounts.dev` | ❌ Não |
| `CLERK_WEBHOOK_SECRET` | (opcional, do webhook) | ✅ Sim |
| `VITE_CLERK_PUBLISHABLE_KEY` | mesmo valor do `CLERK_PUBLISHABLE_KEY` | ❌ Não |

> `VITE_CLERK_PUBLISHABLE_KEY` precisa ser **idêntica** ao `CLERK_PUBLISHABLE_KEY`. O Vite usa essa variável em tempo de build no frontend.

#### Supabase Storage

> **Onde pegar:** Dashboard Supabase → **Project Settings** → **API** → **Project URL** e **service_role key**

| Variável | Value | Secret? |
|---|---|---|
| `SUPABASE_URL` | `https://seu-projeto.supabase.co` | ❌ Não |
| `SUPABASE_SERVICE_KEY` | `sb_secret_...` (começa com `sb_secret_`) | ✅ Sim |

#### Configurações

| Variável | Value | Secret? |
|---|---|---|
| `APP_ENV` | `production` | ❌ Não |
| `APP_DEBUG` | `false` | ❌ Não |
| `LOG_CHANNEL` | `stderr` | ❌ Não |
| `LOG_LEVEL` | `error` | ❌ Não |
| `SESSION_DRIVER` | `database` | ❌ Não |
| `CACHE_DRIVER` | `database` | ❌ Não |
| `QUEUE_CONNECTION` | `sync` | ❌ Não |
| `FILESYSTEM_DISK` | `local` | ❌ Não |
| `DB_CONNECTION` | `supabase` | ❌ Não |
| `INERTIA_SSR_ENABLED` | `false` | ❌ Não |
| `INERTIA_USE_SCRIPT_ELEMENT_FOR_INITIAL_PAGE` | `true` | ❌ Não |

### 2.3. Verificar lista completa

Ao final, a tela **Environment Variables** deve ter **~25 variáveis**. Confira se nenhuma está faltando.

---

## 3. Configurar Clerk

### 3.1. Acessar o Clerk Dashboard

1. Vá para [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Faça login e selecione o aplicativo **worthy-louse-58**

### 3.2. Configurar URLs de redirecionamento

1. No menu esquerdo, vá em **Sessions**
2. Em **Redirect URLs**, adicione:
   - `https://salomao.onrender.com` (ou seu domínio)
   - `https://salomao.onrender.com/auth/clerk-callback`

### 3.3. Configurar Webhook (opcional)

1. Vá em **Webhooks** → **Add Endpoint**
2. URL: `https://salomao.onrender.com/api/clerk/webhook`
3. Selecione eventos: `user.created`, `user.updated`, `user.deleted`
4. Copie o **Signing Secret** gerado e atualize a env var `CLERK_WEBHOOK_SECRET` no Render se mudar

### 3.4. (Se quiser) Desativar Bot Protection

1. Vá em **Sessions** → **Bot Protection**
2. Desative o toggle — para de exibir o aviso `_cfuvid` no console

---

## 4. Fazer o primeiro deploy

### 4.1. Iniciar deploy manual

1. No dashboard do Render, dentro do seu web service `salomao`
2. Clique em **Manual Deploy** → **Deploy Latest Commit**
3. Uma nova build vai começar

### 4.2. Acompanhar o log da build

Clique no card do deploy para abrir os logs em tempo real. Você verá:

```
Step 1: Clonando repositório...
Step 2: Executando Build Command...
  > composer install --no-dev --optimize-autoloader
  > npm ci && npm run build
  > php artisan config:cache
  > php artisan route:cache
  > php artisan view:cache
Step 3: Executando Start Command...
  > php artisan migrate --force
  > php artisan serve --host=0.0.0.0 --port=$PORT
```

**Se der erro no build**, verifique:
- Faltou alguma env var? Confira a lista do passo 2.3
- Erro no composer/npm? Veja a mensagem exata no log

### 4.3. Aguardar o "Live"

Após o build e start, o Render mostra o status **Live** (geralmente leva 1-3 min). O primeiro deploy é mais demorado porque baixa as dependências.

### 4.4. Testar

Acesse: `https://salomao.onrender.com`

- ✅ Página inicial (Home) deve carregar
- ✅ Botão de login deve redirecionar ao Clerk
- ✅ `/health` deve retornar JSON com `{"status":"ok"}`

---

## 5. Configurar UptimeRobot (Keep Alive)

O plano Free do Render "hiberna" o serviço após **15 minutos sem atividade**. O UptimeRobot pinga a cada 5 minutos para manter acordado.

### 5.1. Criar conta

1. Acesse [https://uptimerobot.com](https://uptimerobot.com)
2. Crie conta gratuita (até 50 monitores)

### 5.2. Adicionar monitor

1. Clique em **Add New Monitor**
2. Preencha:
   - **Monitor Type:** `HTTP(s)`
   - **Friendly Name:** `Salomão`
   - **URL (or IP):** `https://salomao.onrender.com/health`
   - **Monitoring Interval:** `5 minutes`
3. Clique em **Create Monitor**

### 5.3. Verificar

Após criar, o UptimeRobot começa a pingar. Em alguns minutos o status fica verde **UP**.

---

## 6. Pós-deploy — verificar tudo

### 6.1. Login completo

1. Acesse `https://salomao.onrender.com/login`
2. Faça login com sua conta Clerk
3. Após o login, você deve ser redirecionado ao `/dashboard`
4. Confira se os dados financeiros aparecem

### 6.2. Se o login falhar

Problema comum: Clerk bloqueia redirect para domínios não autorizados.
- Vá no Clerk Dashboard → **Sessions** → **Redirect URLs**
- Adicione `https://salomao.onrender.com/*`

### 6.3. Avatar e upload

Teste em `/settings` — faça upload de uma foto de perfil. O avatar é salvo no Supabase Storage (persiste em redeploys).

---

## 7. (Opcional) Domínio customizado

### 7.1. Comprar domínio

Compre em qualquer registrar (GoDaddy, Cloudflare, etc.).

### 7.2. Configurar no Render

1. Dashboard Render → **salomao** → **Settings** → **Custom Domain**
2. Adicione seu domínio (ex: `app.salomao.com.br`)
3. Render mostra um **CNAME** para adicionar no DNS do seu domínio
4. No seu registrar, crie um registro **CNAME** apontando para o valor que o Render deu
5. Pode levar de minutos a horas para propagar

### 7.3 Atualizar Clerk

1. Clerk Dashboard → **Domains** → **Add Domain**
2. Adicione seu domínio customizado (ex: `app.salomao.com.br`)
3. Clerk fornece um registro **TXT** para verificar a propriedade
4. Adicione no DNS do seu domínio
5. Após verificado, atualize `CLERK_FRONTEND_API_URL` no Render para o novo domínio

### 7.4 Atualizar APP_URL

No Render, altere `APP_URL` para `https://app.salomao.com.br` e faça um novo deploy.

---

## Troubleshooting

| Problema | Causa provável | Solução |
|---|---|---|
| Build falha no `composer install` | Falta memória no plano Free | Tente novamente (às vezes é transitório) |
| Build falha no `npm run build` | `VITE_CLERK_PUBLISHABLE_KEY` vazia no build | Confira se a env var está no Render |
| App carrega mas CSS quebrado | `APP_URL` incorreta | Confira se `APP_URL` tem o domínio correto com `https://` |
| Login não redireciona | Clerk não autorizou o domínio | Adicione a URL em Clerk Dashboard → Sessions |
| Página 404 no login | Faltou configurar `CLERK_FRONTEND_API_URL` | Confira se a env var está correta no Render |
| "Too many redirects" | `APP_URL` com `http` em vez de `https` ou TrustProxies mal configurado | Confira `APP_URL` e `TrustProxies.php` |
| Banco de dados "connection refused" | Supabase pausou o projeto Free | Entre no Supabase Dashboard e reative |
| App lento | Plano Free do Render | Normal — o Free usa CPU compartilhada |

---

Links úteis:
- Dashboard Render: https://dashboard.render.com
- Dashboard Clerk: https://dashboard.clerk.com
- Dashboard Supabase: https://supabase.com
- UptimeRobot: https://uptimerobot.com
