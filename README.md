<div align="center">

# Sistema Salomão

**Personal financial control web application**

[![Status](https://img.shields.io/badge/status-in%20development-yellow?style=for-the-badge)](https://github.com/Narth-2024/sistema-salomao)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)
[![Laravel](https://img.shields.io/badge/Laravel-10.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![PHP](https://img.shields.io/badge/PHP-8.1+-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://php.net)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)

</div>

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
- [Project Structure](#project-structure)
- [Security](#security)
  - [Security Measures](#security-measures)
  - [Reporting a Vulnerability](#reporting-a-vulnerability)
- [Project Status](#project-status)
- [Contributing](#contributing)
- [Author](#author)

---

## About

**Sistema Salomão** is a web application focused on personal financial control. Users can register, organize, and track their expenses and income through an intuitive dashboard with reports, categories, and data visualizations.

Built with **Laravel 10 + Inertia.js** SPA architecture, featuring a **React 19** frontend with **Tailwind CSS v4**. Authentication is handled by **Clerk**, and data is stored in **Supabase PostgreSQL**.

---

## Features

- **User authentication** via Clerk (Google OAuth, email/password, magic links)
- **Dashboard** with income/expense/balance cards and expense breakdown by category
- **Analytics page** with monthly bar charts, cumulative balance timeline, and period comparisons
- **Categories CRUD** — organize expenses and income by type with color labels
- **Transactions CRUD** — full register with category, tags, type, amount, and date
- **Filters & search** — filter transactions by type, category, tag, date range, and description
- **Pagination** — on transactions, categories, and tags index
- **Dark/Light theme** — persistent theme toggle via local storage
- **Tags** — additional categorization layer for transactions
- **Clerk webhook sync** — automatic user creation/update/deletion
- **Profile editing** — avatar upload to Supabase Storage
- **Responsive design** — mobile sidebar, bottom navigation, and adaptive layout

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Laravel 10.x, PHP 8.1+ |
| **Frontend** | React 19, Inertia.js 3, Tailwind CSS v4 |
| **Database** | PostgreSQL 14+ (via Supabase) |
| **Auth** | Clerk (OAuth, email/password, magic links) |
| **Storage** | Supabase Storage (avatars) |
| **Build** | Vite 7, Laravel Vite plugin |
| **Charts** | Chart.js 4 |
| **Icons** | Lucide React |
| **HTTP** | Axios, Guzzle |

---

## Getting Started

### Prerequisites

- PHP 8.1+
- Composer 2.x
- Node.js 18+ and npm
- PostgreSQL 14+ (or Supabase account)
- Clerk account ([clerk.com](https://clerk.com))

### Installation

```bash
# Clone the repository
git clone https://github.com/Narth-2024/sistema-salomao.git
cd app-salomao

# Install PHP dependencies
composer install

# Install JavaScript dependencies
npm install

# Copy environment file (never commit .env)
cp .env.example .env

# Generate application key
php artisan key:generate

# Run database migrations
php artisan migrate

# Compile frontend assets (development)
npm run dev

# In another terminal, start the Laravel server
php artisan serve
```

Visit `http://localhost:8000` in your browser.

### Environment Setup

Configure your `.env` file with the following required variables:

```env
# Database (Supabase PostgreSQL)
DB_CONNECTION=supabase
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=your-password

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=sb_secret_your-service-key

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_test_your-publishable-key
CLERK_SECRET_KEY=sk_test_your-secret-key
CLERK_FRONTEND_API_URL=https://your-instance.clerk.accounts.dev
CLERK_WEBHOOK_SECRET=whsec_your-webhook-secret

# CPF Validation API (optional)
CPF_API_TOKEN=your-token
```

> **Never commit your `.env` file.** It contains sensitive credentials. The `.env` is already listed in `.gitignore`.

---

## Project Structure

```
app-salomao/
├── app/
│   ├── Console/Commands/         # Artisan commands
│   ├── Exceptions/               # Error handler
│   ├── Facades/                  # Supabase facade
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Auth/             # Auth, Clerk callback, webhook
│   │   │   ├── AnalyticsController.php
│   │   │   ├── CategoryController.php
│   │   │   ├── DashboardController.php
│   │   │   ├── ProfileController.php
│   │   │   ├── SettingsController.php
│   │   │   ├── TagController.php
│   │   │   └── TransactionController.php
│   │   └── Middleware/
│   ├── Models/                   # User, Category, Transaction, Tag
│   ├── Policies/                 # Authorization policies
│   ├── Providers/                # Service providers
│   └── Services/                 # AnalyticsService, SupabaseService, SupabaseStorageService
├── config/                       # Application configuration
├── database/
│   ├── factories/
│   ├── migrations/
│   └── seeders/
├── resources/
│   ├── css/
│   ├── js/
│   │   ├── Components/          # Reusable UI components
│   │   ├── Layouts/             # AppLayout, GuestLayout
│   │   ├── Pages/              # Inertia page components
│   │   └── hooks/              # Custom React hooks
│   └── views/                   # Blade templates
├── routes/                       # Web, API, console, channels
├── supabase/                     # Supabase config
├── tests/
├── .env.example
├── composer.json
├── package.json
└── vite.config.js
```

---

## Security

### Security Measures

This project follows security best practices:

- **`.env` is gitignored** — credentials never enter version control
- **CSRF protection** — enabled via Laravel's VerifyCsrfToken middleware for all web routes
- **CORS restricted** — only `APP_URL` is allowed as origin
- **Session security** — `http_only` cookies, `SameSite=Lax`, configurable `secure` flag
- **HTTPS enforced** in production via `AppServiceProvider::boot()`
- **Mass-assignment protection** — all models use `$fillable` whitelists
- **Authorization policies** — Category, Transaction, and Tag resources are owner-scoped via Policies
- **Rate limiting** — API routes throttled at 60 requests/minute
- **Authentication required** — all data routes protected by `auth` middleware
- **Input validation** — all user inputs validated before processing
- **Clerk webhook signature verification** — incoming webhooks verified via Svix
- **XSS protection** — Inertia's server-side escaping + React's default XSS protection
- **APP_DEBUG=false** in production — detailed error messages never exposed to users
- **APP_KEY** must be set — used for encryption (run `php artisan key:generate`)

### Recommended Production Checklist

Before deploying:

1. [ ] Set `APP_ENV=production` and `APP_DEBUG=false`
2. [ ] Set `APP_URL` to your production domain
3. [ ] Enable HTTPS termination at your reverse proxy or load balancer
4. [ ] Set `SESSION_SECURE_COOKIE=true` (already in `.env.example`)
5. [ ] Rotate all credentials if `.env` was ever exposed
6. [ ] Run `php artisan key:generate` if `.env` was shared
7. [ ] Use a strong, random `APP_KEY`
8. [ ] Configure database `DB_PASSWORD` with a strong, unique password
9. [ ] Enable database encryption at rest (via Supabase)
10. [ ] Review Supabase RLS policies for your tables

### Reporting a Vulnerability

If you discover a security vulnerability, please **do not open a public issue**. Instead, send an email to [nathanbs.trabalho@gmail.com](mailto:nathanbs.trabalho@gmail.com). Please do not report security issues via GitHub Issues.

---

## Project Status

| Module | Status |
|---|---|
| Authentication (Clerk) | Done |
| Dashboard | Done |
| Categories CRUD | Done |
| Transactions CRUD | Done |
| Tags CRUD | Done |
| Analytics / Charts | Done |
| Filters & Search | Done |
| Pagination | Done |
| Dark/Light Theme | Done |
| Profile Editing (Avatar) | Done |
| Clerk Webhook Sync | Done |
| Responsive Layout | Done |
| CPF Field / Validation | Database column ready, UI pending |
| Subcategories | Not started |
| Recurring Transactions | Not started |
| Installments | Not started |
| Reports & Advanced Charts | Not started |
| Tests | Not started |

---

## Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code passes Laravel Pint (`./vendor/bin/pint`) before submitting.

---

## Author

**Nathan Bortolini**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/nathan-bortolini/)
[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:nathanbs.trabalho@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Narth-2024)

---

<div align="center">

*"Wisdom is more valuable than gold." — Proverbs 3:14*

</div>
