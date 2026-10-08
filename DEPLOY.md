# 🚀 Guia de Deploy — Salomão no Vercel

Arquitetura de produção atual:

| Camada | Serviço |
|---|---|
| App | **Vercel** (runtime `vercel-php`, entry `api/index.php`) |
| Banco | **Supabase Postgres** via session pooler (IPv4) |
| Auth | **Clerk** (login + webhook via Svix) |
| Storage | **Supabase Storage** (bucket `avatars`) |
| Domínio | `https://sistema-salom-o.vercel.app` |

---

## 1. Deploy

O deploy é automático a cada push na `main`:

```bash
git add -A
git commit -m "Descrição"
git push origin main
```

Ou manualmente a partir da working tree:

```bash
vercel deploy --prod --yes
```

Acompanhe em `vercel ls` ou no dashboard (`Inspect`).

---

## 2. Arquivos que nunca entram no deploy

O `.vercelignore` exclui `/vendor`, `/node_modules` e **`/.env`**.

> ⚠️ Se o `.env` local for para o deploy, ele **sobrescreve** as variáveis do
> Vercel (prioridade do Laravel) — foi exatamente isso que escondia o pooler
> e apontava o app para o host IPv6 direto do Supabase.

---

## 3. Variáveis de ambiente (production e development)

Cadastre em `Settings → Environment Variables` (ou via CLI):

| Variável | Valor | Observação |
|---|---|---|
| `APP_NAME` | `Laravel` | |
| `APP_ENV` | `production` | |
| `APP_KEY` | `base64:...` | `php artisan key:generate --show` |
| `APP_DEBUG` | `false` | |
| `APP_URL` | `https://sistema-salom-o.vercel.app` | |
| `LOG_CHANNEL` | `stderr` | Vercel lê o stderr nos logs |
| `LOG_LEVEL` | `error` | |
| `DB_CONNECTION` | `supabase` | driver custom do projeto |
| `DB_HOST` | `aws-1-sa-east-1.pooler.supabase.com` | **session pooler, IPv4** |
| `DB_PORT` | `5432` | |
| `DB_DATABASE` | `postgres` | |
| `DB_USERNAME` | `postgres.nozlarpehjgalsvwtwlj` | usuário do pooler (ref anexada) |
| `DB_PASSWORD` | (senha do banco) | secret |
| `SESSION_DRIVER` | `cookie` | FS do Vercel é efêmero |
| `CACHE_DRIVER` | `array` | idem |
| `QUEUE_CONNECTION` | `sync` | |
| `BROADCAST_DRIVER` | `log` | |
| `FILESYSTEM_DISK` | `local` | uploads vão para o Supabase Storage |
| `CLERK_PUBLISHABLE_KEY` | `pk_test_...` | |
| `CLERK_SECRET_KEY` | `sk_test_...` | secret |
| `CLERK_FRONTEND_API_URL` | `https://worthy-louse-58.clerk.accounts.dev` | |
| `CLERK_WEBHOOK_SECRET` | `whsec_...` | secret — signing secret do Svix |
| `SUPABASE_URL` | `https://nozlarpehjgalsvwtwlj.supabase.co` | |
| `SUPABASE_SERVICE_KEY` | JWT `eyJ...` (**service_role**) | secret |
| `SUPABASE_PUBLISHABLE_KEY` | JWT `eyJ...` (**anon**) | |
| `CPF_API_TOKEN` | token gov.br | secret |
| `VITE_CLERK_PUBLISHABLE_KEY` | igual ao `CLERK_PUBLISHABLE_KEY` | |
| `VITE_APP_NAME` | `${APP_NAME}` | |
| `INERTIA_SSR_ENABLED` | `false` | |
| `INERTIA_USE_SCRIPT_ELEMENT_FOR_INITIAL_PAGE` | `true` | |
| `SESSION_SECURE_COOKIE` / `SESSION_LIFETIME` / caches (`APP_*_CACHE`, `VIEW_COMPILED_PATH`, `/tmp`) | conforme `.env` atual | |

Depois de mudar env vars, faça um **novo deploy** — valores só valem em
deployments criados após a alteração.

Comandos úteis:

```bash
vercel env ls production
echo -n "$VALOR" | vercel env add NOME production --type=secret
vercel env rm NOME production --yes
```

---

## 4. Conectividade com o banco (o erro mais comum)

- O host direto `db.<ref>.supabase.co` resolve para **IPv6**; o runtime da
  Vercel não tem IPv6 → `Cannot assign requested address`.
- O host **com índice** `aws-0-...` pode dar `ENOTFOUND tenant not found`;
  use **`aws-1-sa-east-1.pooler.supabase.com`** (região `sa-east-1`).
- Se estourar conexões no plano free, troque a porta para `6543`
  (transaction mode).
- **Não** cadastre `SUPABASE_DATABASE_URL`: ela tem prioridade sobre
  `DB_HOST` em `config/database.php`.

Validação em produção:

```bash
curl -s -H 'Accept: application/json' https://sistema-salom-o.vercel.app/api/user
# esperado: {"message":"Unauthenticated"}  (rota viva, Laravel responde)
```

---

## 5. Chaves do Supabase (Storage)

O código usa `SUPABASE_SERVICE_KEY` para criar o bucket e enviar objetos.
O projeto aceita **somente as chaves legacy em formato JWT (`eyJ...`)**:

1. Dashboard do Supabase → **Project Settings → API**
2. Revele as **legacy keys** (`anon` e `service_role`)
3. `service_role` → `SUPABASE_SERVICE_KEY`; `anon` → `SUPABASE_PUBLISHABLE_KEY`

Sintomas de chave errada: Storage `403 Invalid Compact JWS`,
PostgREST `PGRST301 Expected 3 parts in JWT`.

---

## 6. Clerk

### 6.1. Redirect URLs

Dashboard → **Sessions → Redirect URLs**:

```
https://sistema-salom-o.vercel.app/*
```

### 6.2. Webhook (Svix)

O endpoint é gerenciado pelo **Svix** (o Clerk não expõe API para criar
endpoints, só `POST /webhooks/svix_url` para gerar o link do dashboard):

1. Dashboard Clerk → **Webhooks** → abra o link do Svix
2. Crie o endpoint:
   - **Endpoint URL**: `https://sistema-salom-o.vercel.app/api/clerk/webhook`
   - **Eventos**: `user.created`, `user.updated`, `user.deleted`
3. Copie o **signing secret** (`whsec_...`) → `CLERK_WEBHOOK_SECRET` no Vercel
4. Redeploy

A rota valida a assinatura Svix (`svix-id`/`svix-timestamp`/`svix-signature`);
assinatura inválida → `401 {"error":"Invalid signature"}`.

---

## 7. Checklist de verificação

- ✅ `GET /health` → `200` JSON
- ✅ `/`, `/login`, `/register` → `200`
- ✅ Login pelo Clerk → `/dashboard` com dados reais
- ✅ `/settings` → upload de avatar (bucket `avatars` criado, URL pública `200`)
- ✅ `POST /api/clerk/webhook` → assinatura válida `200 {"success":true}`
- ✅ `vercel logs <deploy> --since 10m` mostra as requisições

---

## Troubleshooting

| Problema | Causa | Solução |
|---|---|---|
| Todo `/api/*` dá `404` | `SCRIPT_NAME=/api/index.php` faz o Symfony montar baseUrl `/api` | Normalização em `api/index.php` (commit `fcbfda7`) |
| `403` com `x-vercel-mitigated: challenge` | Security Checkpoint da Vercel por volume de requests | Espaçar requests / usar User-Agent de navegador |
| `Cannot assign requested address` | Host direto do Supabase é IPv6 | Usar o pooler `aws-1-...` |
| `tenant/user not found` | Pooler com índice errado (`aws-0`) | Usar `aws-1-sa-east-1.pooler.supabase.com` |
| Storage `Invalid Compact JWS` / `Expected 3 parts in JWT` | Chave `sb_secret_*` não aceita | Usar JWT legacy `service_role` |
| Avatar: `Bucket not found` | Bucket nunca foi criado / upload falhou em silêncio | `ensureBucket()` envia `name` e falhas agora viram erro (commit `8db4495`) |
| Webhook `401 Invalid signature` | `CLERK_WEBHOOK_SECRET` ausente/diferente | Copiar o `whsec_` do Svix e redeployar |
| Sessão/perda de dados após deploy novo | FS efêmero da Vercel | `SESSION_DRIVER=cookie`, `CACHE_DRIVER=array` |
