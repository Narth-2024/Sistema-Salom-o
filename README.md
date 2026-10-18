<div align="center">

# Sistema Salomão

**Aplicação web de controle financeiro pessoal**

[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow?style=for-the-badge)](https://github.com/Narth-2024/Sistema-Salom-o)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)
[![CI](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)](.github/workflows/ci.yml)
[![Laravel](https://img.shields.io/badge/Laravel-10.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![PHP](https://img.shields.io/badge/PHP-8.1+-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://php.net)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
[![PWA](https://img.shields.io/badge/PWA-instalável-5E3EC8?style=for-the-badge&logo=pwa&logoColor=white)](https://sistema-salom-o.vercel.app)

**Demo:** [sistema-salom-o.vercel.app](https://sistema-salom-o.vercel.app)

</div>

---

## Sumário

- [Sobre](#sobre)
- [Funcionalidades](#funcionalidades)
- [Stack](#stack)
- [Começando](#começando)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação](#instalação)
  - [Configuração de ambiente](#configuração-de-ambiente)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Segurança e privacidade](#segurança-e-privacidade)
- [Status do projeto](#status-do-projeto)
- [Contribuindo](#contribuindo)
- [Autor](#autor)

---

## Sobre

**Sistema Salomão** é uma aplicação web de **controle financeiro pessoal**. O usuário registra entradas e saídas, organiza por categorias e tags, acompanha o saldo e a evolução do patrimônio por meio de um painel com gráficos, além de simular o rendimento de investimentos.

Construída com **Laravel 10 + Inertia.js** (arquitetura SPA), **React 19** no frontend e **Tailwind CSS v4**. A autenticação é feita pelo **Clerk** (widgets de login/cadastro) com troca de sessão para o **Laravel**, e os dados ficam no **PostgreSQL do Supabase**. É um projeto acadêmico (TCC) e roda em produção na **Vercel**.

---

## Funcionalidades

- **Autenticação via Clerk** — login e cadastro pelos widgets do Clerk, com tema do sistema; a sessão é trocada por uma do Laravel em `/auth/clerk-callback`
- **Recuperação de senha sem SMTP** — "esqueci a senha" é resolvido pela infraestrutura de e-mail do próprio Clerk
- **Painel (Dashboard)** — cards de receita, despesa e saldo, com filtro por período e quebra de despesas por categoria
- **Analytics** — gráficos de barras mensais, linha de saldo acumulado e comparação entre períodos (Chart.js)
- **Investimentos** — simulador que compara aplicações (Poupança, CDB, Tesouro etc.) com taxas oficiais de CDI/IPCA
- **Transações** — CRUD completo com categoria, tags, tipo, valor e data
- **Transações recorrentes** — lançamentos que se repetem todo mês, replicados por cron
- **Categorias** — CRUD com tipo (receita/despesa) e rótulo de cor
- **Tags** — camada extra de categorização, com cor própria
- **Filtros e busca** — por tipo, categoria, tag, intervalo de datas e descrição
- **Exportação CSV** — baixa o histórico com os filtros aplicados
- **Exclusão reversível (soft delete)** — transações, categorias e tags vão para a lixeira e podem ser restauradas
- **Exclusão de conta (LGPD)** — o usuário apaga definitivamente sua conta e dados
- **Perfil** — edição de nome e upload de avatar no Supabase Storage
- **PWA instalável** — instala no celular como aplicativo e tem modo offline de leitura (manifest, ícones, service worker e banner de instalação)
- **Tema claro/escuro** — alternância persistida no navegador
- **Tour guiado e checklist de onboarding** — visita guiada às telas (driver.js)
- **Acessibilidade** — skip link, navegação por teclado com focus trap, `aria-live` em avisos e contraste ajustado
- **Design responsivo** — sidebar no desktop, navegação inferior no mobile

### PWA e modo offline

O app é instalável pelo navegador — **Chrome/Edge** no Android (a barra de endereço oferece "Instalar aplicativo") e **Safari** no iOS, pelo menu *Compartilhar → Adicionar à Tela de Início*. Depois de instalado, abre em tela cheia, sem barra de endereço, e o banner de instalação também aparece na Dashboard.

O **service worker** (`public/sw.js`) define o comportamento sem conexão:

| Situação | O que acontece offline |
|---|---|
| Shell da aplicação (JS/CSS) | Pré-cacheado na instalação |
| Páginas já visitadas | Servidas do cache — os dados exibidos são os da última visita |
| Página nunca visitada | Tela `offline.html` |
| Barra no topo | "Sem conexão — exibindo dados salvos" |
| Criar, editar ou excluir | **Exige conexão** — não há fila de envio |

O modo offline é, portanto, de **leitura**: serve para consultar o que já foi carregado. Inserir ou alterar dados continua precisando de internet.

---

## Stack

| Camada | Tecnologia |
|---|---|
| **Backend** | Laravel 10.x, PHP 8.1+ |
| **Frontend** | React 19, Inertia.js 3, Tailwind CSS v4 |
| **Banco de dados** | PostgreSQL 14+ (via Supabase) |
| **Autenticação** | Clerk (widgets) + sessão do Laravel |
| **Storage** | Supabase Storage (avatars) |
| **Build** | Vite 7, plugin Laravel Vite |
| **Gráficos** | Chart.js 4 |
| **Ícones** | Lucide React |
| **Tour guiado** | driver.js |
| **Deploy** | Vercel (runtime `vercel-php`), com cron mensal |

---

## Começando

### Pré-requisitos

- PHP 8.1+
- Composer 2.x
- Node.js 18+ e npm
- PostgreSQL 14+ (ou conta no Supabase)
- Conta na [Vercel](https://vercel.com) para deploy (opcional, apenas para publicar)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/Narth-2024/Sistema-Salom-o.git
cd Sistema-Salom-o

# Instale as dependências PHP
composer install

# Instale as dependências JavaScript
npm install

# Copie o arquivo de ambiente (nunca commite o .env)
cp .env.example .env

# Gere a chave da aplicação
php artisan key:generate

# Rode as migrações do banco
php artisan migrate

# Compile os assets do frontend (desenvolvimento)
npm run dev

# Em outro terminal, suba o servidor Laravel
php artisan serve
```

Acesse `http://localhost:8000` no navegador.

### Configuração de ambiente

Configure o `.env` com as variáveis obrigatórias:

```env
# Aplicação
APP_NAME="Sistema Salomao"
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost:8000

# Banco de dados (PostgreSQL do Supabase)
# Local: host direto db.xxxxx.supabase.co (IPv6)
# Produção (Vercel): session pooler IPv4 -> aws-1-sa-east-1.pooler.supabase.com
#                    DB_USERNAME=postgres.xxxxx (ref anexada)
DB_CONNECTION=pgsql
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=sua-senha

# Supabase (chaves em formato JWT, Dashboard -> Settings -> API)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...     # service_role
SUPABASE_PUBLISHABLE_KEY=eyJ... # anon

# Sessão
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_SECURE_COOKIE=true

# E-mail (não é usado para autenticação — o Clerk cuida do "esqueci a senha")
MAIL_MAILER=smtp
MAIL_HOST=smtp-relay.brevo.com  # ou smtp.resend.com / smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=...
MAIL_PASSWORD=...
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="nao-responda@seu-dominio.com"
MAIL_FROM_NAME="Sistema Salomão"

# Segredo do cron de transações recorrentes (Vercel cron -> /cron/recurring?secret=...)
CRON_SECRET=uma-string-longa-e-aleatoria
```

> **Nunca commite o arquivo `.env`.** Ele contém credenciais sensíveis e já está listado no `.gitignore`.

---

## Estrutura do projeto

```
app-salomao/
├── app/
│   ├── Console/Commands/            # transactions:spawn-recurring (transações recorrentes)
│   ├── Exceptions/                  # Handler de erros
│   ├── Facades/                     # Facade do Supabase
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Auth/AuthController.php   # Telas de login/cadastro e logout
│   │   │   ├── Auth/ClerkCallbackController.php  # Troca a sessão do Clerk por uma do Laravel
│   │   │   ├── AnalyticsController.php
│   │   │   ├── CategoryController.php
│   │   │   ├── DashboardController.php
│   │   │   ├── InvestmentForecastController.php
│   │   │   ├── ProfileController.php
│   │   │   ├── SettingsController.php
│   │   │   ├── TagController.php
│   │   │   └── TransactionController.php
│   │   └── Middleware/
│   ├── Models/                      # User, Category, Transaction, Tag, InvestmentSimulation
│   ├── Policies/                    # Category, Transaction, Tag (escopadas por dono)
│   ├── Providers/
│   └── Services/                    # AnalyticsService, InvestmentForecastService,
│                                    # SupabaseStorageService, ClerkTokenValidator,
│                                    # ClerkUserSync
├── config/                          # Configuração da aplicação
├── database/
│   ├── factories/
│   ├── migrations/
│   └── seeders/
├── public/
│   ├── manifest.webmanifest         # Manifest do PWA
│   ├── sw.js                        # Service worker (offline)
│   └── icon-*.png                   # Ícones do PWA
├── resources/
│   ├── css/
│   ├── js/
│   │   ├── Components/              # UI reutilizável (Modal, Input, FlashMessage...)
│   │   ├── Layouts/                 # AppLayout, GuestLayout
│   │   ├── Pages/                   # Páginas Inertia
│   │   ├── hooks/                   # Hooks React (useSubmitLock etc.)
│   │   ├── lib/                     # Utilitários (decimal, contrast, pwa...)
│   │   └── tour/                    # AppTour (driver.js)
│   └── views/                       # Templates Blade
├── routes/                          # web, api, console, channels
├── tests/                           # Testes (Unit e Feature)
│   ├── Unit/
│   └── Feature/
├── .github/workflows/ci.yml         # CI: Pint + testes a cada push/PR
├── vercel.json                      # Deploy + cron na Vercel
├── pint.json                        # Padronização de código PHP
├── LICENSE                          # MIT
├── .env.example
├── composer.json
├── package.json
└── vite.config.js
```

---

## Segurança e privacidade

### Medidas de segurança

- **`.env` no gitignore** — credenciais fora do controle de versão
- **Proteção CSRF** — habilitada no middleware `VerifyCsrfToken` de todas as rotas web
- **CORS restrito** — apenas `APP_URL` como origem permitida
- **Sessão segura** — cookies `http_only`, `SameSite=Lax` e flag `secure` configurável
- **HTTPS forçado em produção** — via `AppServiceProvider::boot()`
- **Proteção contra mass assignment** — todos os models usam `$fillable`
- **Políticas de autorização** — categorias, transações e tags escopadas pelo dono
- **Autenticação obrigatória** — todas as rotas de dados protegidas pelo middleware `auth`
- **Validação de entrada** — todo input validado antes do processamento
- **Recuperação de senha sem SMTP** — o "esqueci a senha" é resolvido pela infraestrutura de e-mail do próprio Clerk; o projeto não precisa de provedor
- **Identidade provada por token** — a troca de sessão lê o `sub` de um JWT cuja assinatura é conferida contra o JWKS do Clerk, junto com `iss` e `azp`; o corpo da requisição não tem peso
- **Exclusão de conta com confirmação de e-mail** — endpoint LGPD exige o e-mail da própria conta; a senha é do Clerk e o Laravel não a conhece
- **Cron protegido por segredo** — `/cron/recurring` valida `CRON_SECRET` antes de rodar
- **Proteção XSS** — escaping server-side do Inertia + proteção nativa do React
- **`APP_DEBUG=false` em produção** — mensagens de erro detalhadas nunca expostas ao usuário
- **`APP_KEY` obrigatória** — usada para criptografia (rode `php artisan key:generate`)

### Checklist antes de produção

1. [ ] Defina `APP_ENV=production` e `APP_DEBUG=false`
2. [ ] Aponte `APP_URL` para o domínio de produção
3. [ ] Habilite HTTPS no proxy reverso ou load balancer
4. [ ] Defina `SESSION_SECURE_COOKIE=true`
5. [ ] Rode todas as migrações (`php artisan migrate --force`)
6. [ ] Use uma `APP_KEY` forte e única
7. [ ] Configure `DB_PASSWORD` forte e única
8. [ ] Defina um `CRON_SECRET` longo e aleatório
9. [ ] Revise as políticas de RLS do Supabase para suas tabelas
10. [ ] Rotacione as credenciais caso o `.env` tenha sido exposto

### Reportando uma vulnerabilidade

Se você encontrar uma falha de segurança, **não abra uma issue pública**. Em vez disso, envie um e-mail para [nathanbs.trabalho@gmail.com](mailto:nathanbs.trabalho@gmail.com). Por favor, não reporte problemas de segurança via GitHub Issues.

---

## Status do projeto

| Módulo | Status |
|---|---|
| Autenticação (Clerk + sessão do Laravel) | Feito |
| Painel (Dashboard) | Feito |
| CRUD de Categorias | Feito |
| CRUD de Transações | Feito |
| CRUD de Tags | Feito |
| Analytics / Gráficos | Feito |
| Simulador de Investimentos | Feito |
| Transações Recorrentes | Feito |
| Filtros e Busca | Feito |
| Exportação CSV | Feito |
| Exclusão Reversível (soft delete) | Feito |
| Exclusão de Conta (LGPD) | Feito |
| Tema Claro/Escuro | Feito |
| Edição de Perfil (avatar) | Feito |
| PWA (instalável + offline) | Feito |
| Tour Guiado / Onboarding | Feito |
| Acessibilidade | Feito |
| Layout Responsivo | Feito |
| Campo CPF (coluna no banco) | Coluna pronta, UI pendente |
| Subcategorias | Não iniciado |
| Testes automatizados | Feito — 92 testes (feature + unit) |

---

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch de feature (`git checkout -b feature/amazing-feature`)
3. Committe suas mudanças (`git commit -m 'Add amazing-feature'`)
4. Envie para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

O **CI (GitHub Actions)** roda automaticamente a cada push e PR: valida o estilo de código com **Laravel Pint** (`vendor/bin/pint --test`) e executa os **testes** (`php artisan test`). Se estiver verde no CI, está pronto para revisão.

Para checar localmente antes de enviar:

```bash
vendor/bin/pint      # formata o código
php artisan test     # roda os testes
```

Os testes de **feature** rodam em SQLite (`:memory:`) e cobrem: autorização entre
usuários (um usuário não vê/edita registros de outro), transações (criação, edição,
soft delete, restauração, exportação CSV e busca), categorias, tags, dashboard,
analytics e investimentos.

A autenticação tem testes próprios: um de **unit** valida o `ClerkTokenValidator`
contra um par de chaves RS256 gerado em memória (assinatura, issuer, `azp`,
expiração, token sem `sub`), e dois de **feature** cobrem a troca de sessão
(`/auth/clerk-exchange`, incluindo o vínculo com conta local já existente) e o
webhook (`/api/clerk/webhook`, com assinatura Svix calculada no próprio teste).

### Comandos do administrador

```bash
php artisan clerk:import-users --dry-run   # mostra quem seria migrado para o Clerk
php artisan clerk:import-users             # cria no Clerk e grava o clerk_id de volta
php artisan transactions:spawn-recurring   # gera as recorrentes do mês (roda no cron)
```

A migração cria as contas no Clerk com o e-mail **já verificado** (padrão do
endpoint de criação deles), então cada pessoa entra em `/login` → "Esqueci a
senha" e define a própria senha — o e-mail sai pela infraestrutura do Clerk.

---

## Autor

**Nathan Bortolini**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/nathan-bortolini/)
[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:nathanbs.trabalho@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Narth-2024)

---

<div align="center">

*"Mais preciosa do que o ouro é a sabedoria." — Provérbios 3:14*

</div>
