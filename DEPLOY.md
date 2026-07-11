# 🚀 Guia de Deploy — Salomão no Railway

---

## Antes de começar

```bash
# Se ainda não fez commit das últimas alterações:
git add -A
git commit -m "Deploy prep"
git push origin main
```

---

## 1. Criar conta no Railway

1. Acesse [https://railway.app](https://railway.app)
2. Faça login com GitHub
3. Plano **Free** — dá $5 de crédito/mês (mais que suficiente para o app + banco)

---

## 2. Criar o banco PostgreSQL

1. No dashboard, clique em **New Project** → **Provision PostgreSQL**
2. Railway cria um banco PostgreSQL automaticamente
3. Clique no card do PostgreSQL → vá em **Connect**
4. Copie a **Connection URL** (`postgresql://...`) — vamos usar ela

---

## 3. Deploy do app

### 3.1. Criar o serviço

1. No mesmo projeto, clique em **New** → **GitHub Repo**
2. Selecione o repositório `Sistema-Salom-o`
3. Railway detecta que é PHP e configura automaticamente

### 3.2. Configurar Build e Start

No card do serviço, vá em **Settings** → **Deploy**:

- **Build Command:**
  ```bash
  composer install --no-dev --optimize-autoloader && npm ci && npm run build && php artisan config:cache && php artisan route:cache && php artisan view:cache
  ```

- **Start Command:**
  ```bash
  php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT
  ```

### 3.3. Adicionar variáveis de ambiente

Vá em **Variables** (no card do serviço) e adicione:

| Variável | Valor | Como obter |
|---|---|---|
| `APP_KEY` | `base64:...` | `php artisan key:generate --show` no terminal |
| `APP_ENV` | `production` | |
| `APP_DEBUG` | `false` | |
| `APP_URL` | `https://salomao.up.railway.app` | Railway gera esse domínio |
| `LOG_CHANNEL` | `stderr` | |
| `LOG_LEVEL` | `error` | |
| `DB_CONNECTION` | `supabase` | |
| `DB_HOST` | `db.nozlarpehjgalsvwtwlj.supabase.co` | Do seu .env local |
| `DB_PORT` | `5432` | |
| `DB_DATABASE` | `postgres` | |
| `DB_USERNAME` | `postgres` | |
| `DB_PASSWORD` | (a senha) | Do seu .env local |
| `SESSION_DRIVER` | `database` | |
| `CACHE_DRIVER` | `database` | |
| `QUEUE_CONNECTION` | `sync` | |
| `FILESYSTEM_DISK` | `local` | |
| `CLERK_PUBLISHABLE_KEY` | `pk_test_...` | Dashboard Clerk → API Keys |
| `CLERK_SECRET_KEY` | `sk_test_...` | Dashboard Clerk → API Keys |
| `CLERK_FRONTEND_API_URL` | `https://...clerk.accounts.dev` | Dashboard Clerk → API Keys |
| `CLERK_WEBHOOK_SECRET` | `whsec_...` | (opcional) |
| `SUPABASE_URL` | `https://...supabase.co` | Do seu .env local |
| `SUPABASE_SERVICE_KEY` | `sb_secret_...` | Do seu .env local |
| `VITE_CLERK_PUBLISHABLE_KEY` | mesmo do `CLERK_PUBLISHABLE_KEY` | |
| `INERTIA_SSR_ENABLED` | `false` | |
| `INERTIA_USE_SCRIPT_ELEMENT_FOR_INITIAL_PAGE` | `true` | |

### 3.4. Fazer deploy

1. Vá em **Settings** → clique em **Trigger Deploy** (ícone de seta circular)
2. Acompanhe os logs em tempo real
3. Quando terminar, clique no domínio gerado (ex: `salomao.up.railway.app`)

---

## Alternativa: usar Docker (se o PHP nativo não funcionar)

Se o Railway não reconhecer o PHP automaticamente, o `Dockerfile` já está no projeto:

1. Em **Settings** → **Deploy** → mude **Runtime** para **Docker**
2. O Railway vai usar o `Dockerfile` da raiz do projeto
3. Clique em **Trigger Deploy**

---

## 4. Configurar Clerk

1. Acesse [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Selecione o app **worthy-louse-58**
3. Vá em **Sessions** → **Redirect URLs** → adicione:
   - `https://salomao.up.railway.app/*`
4. (Opcional) Vá em **Sessions** → **Bot Protection** → desative se quiser

---

## 5. UptimeRobot (keep alive)

O Railway também hiberna em plano free. Para manter acordado:

1. Acesse [https://uptimerobot.com](https://uptimerobot.com)
2. **Add New Monitor**
3. Tipo: **HTTP(s)**
4. URL: `https://salomao.up.railway.app/health`
5. Intervalo: **5 minutos**

---

## 6. Verificar

- ✅ Home: `https://salomao.up.railway.app`
- ✅ Health: `https://salomao.up.railway.app/health`
- ✅ Login: redireciona ao Clerk e volta ao dashboard
- ✅ `/settings` — upload de avatar, troca de tema
- ✅ Transações, categorias, tags, analytics

---

## Troubleshooting

| Problema | Causa | Solução |
|---|---|---|
| Build falha no `composer install` | Falta memória | Tente novamente |
| Build falha no `npm run build` | `VITE_CLERK_PUBLISHABLE_KEY` vazia | Adicione a env var |
| "Connection refused" no banco | URL de conexão errada | Use a connection string do Supabase ou Railway Postgres |
| App lento | Plano free | Normal, CPU compartilhada |
| Login não redireciona | Clerk sem permissão | Adicione URL em Clerk → Sessions |
