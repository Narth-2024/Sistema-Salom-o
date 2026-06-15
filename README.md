<div align="center">

# 💰 Sistema Salomão

**Personal financial control web application**

![Status](https://img.shields.io/badge/status-in%20development-yellow?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![Laravel](https://img.shields.io/badge/Laravel-10.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

---

## 📋 About the project

**Sistema Salomão** is a web application focused on personal financial control, allowing users to register, organize and track their expenses, helping with financial planning through reports, categories and data visualizations.

Built with **Laravel 10** + **Inertia.js** SPA architecture, featuring a **React 19** frontend and **Tailwind CSS v4** for styling. Authentication is handled by **Clerk**, and data is stored in **Supabase PostgreSQL**.

---

## ✨ Features

- 🔐 **User authentication** via Clerk (Google OAuth, email/password, magic links)
- 📊 **Dashboard** with income/expense/balance cards, recent transactions, and doughnut chart
- 📁 **Categories CRUD** — organize expenses and income by type
- 💳 **Transactions CRUD** — full register with category, type, amount, and date
- 🔄 **Clerk webhook sync** — automatic user creation/update/deletion
- 🧾 **CPF field** (ready for gov.br validation)

---

## 🛠️ Tech stack

![Laravel](https://img.shields.io/badge/Laravel-10.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-8.1+-777BB4?style=for-the-badge&logo=php&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Inertia](https://img.shields.io/badge/Inertia.js-2.0-9553E9?style=for-the-badge&logo=inertia&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-4.x-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)

---

## 📁 Project structure

```
app-salomao/
├── app/
│   ├── Console/
│   │   └── Commands/
│   │       └── TestClerkWebhook.php
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Auth/
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── ClerkCallbackController.php
│   │   │   │   └── ClerkWebhookController.php
│   │   │   ├── CategoryController.php
│   │   │   ├── DashboardController.php
│   │   │   └── TransactionController.php
│   │   └── Middleware/
│   │       └── HandleInertiaRequests.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Category.php
│   │   └── Transaction.php
│   └── Providers/
│       ├── AppServiceProvider.php
│       ├── AuthServiceProvider.php
│       ├── EventServiceProvider.php
│       ├── RouteServiceProvider.php
│       └── SupabaseServiceProvider.php
├── config/
├── database/
│   ├── factories/
│   ├── migrations/
│   └── seeders/
├── resources/
│   ├── css/
│   │   └── app.css
│   ├── js/
│   │   ├── Components/
│   │   ├── Layouts/
│   │   │   ├── AppLayout.jsx
│   │   │   └── GuestLayout.jsx
│   │   ├── Pages/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   └── ClerkCallback.jsx
│   │   │   ├── Categories/
│   │   │   │   ├── Index.jsx
│   │   │   │   ├── Create.jsx
│   │   │   │   ├── Edit.jsx
│   │   │   │   └── Show.jsx
│   │   │   ├── Transactions/
│   │   │   │   ├── Index.jsx
│   │   │   │   ├── Create.jsx
│   │   │   │   ├── Edit.jsx
│   │   │   │   └── Show.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Home.jsx
│   │   ├── app.jsx
│   │   └── bootstrap.js
│   └── views/
│       ├── app.blade.php
│       └── home.blade.php
├── routes/
│   ├── web.php
│   ├── api.php
│   ├── console.php
│   └── channels.php
├── supabase/
│   └── config.toml
├── .env.example
├── composer.json
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Getting started

### Prerequisites

- PHP 8.1 or higher
- Composer 2.x
- Node.js 18+ and npm
- PostgreSQL 14+ (or Supabase account)
- Clerk account (for authentication)

### Installation

```bash
# Clone the repository
git clone https://github.com/Narth-2024/sistema-salomao.git

# Navigate to the project folder
cd app-salomao

# Install PHP dependencies
composer install

# Install JavaScript dependencies
npm install

# Copy environment file and configure
cp .env.example .env
php artisan key:generate
```

### Environment setup

Configure your `.env` file with the following:

```env
# Database (Supabase PostgreSQL)
DB_CONNECTION=supabase
DB_HOST=your-supabase-host
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=your-user
DB_PASSWORD=your-password

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
CLERK_FRONTEND_API_URL=https://your-clerk-domain.clerk.accounts.dev
CLERK_WEBHOOK_SECRET=whsec_...

# CPF Validation API (gov.br)
CPF_API_TOKEN=your-token
```

### Run the application

```bash
# Run database migrations
php artisan migrate

# Start the development server
php artisan serve

# In another terminal, compile assets with Vite
npm run dev
```

Visit `http://localhost:8000` in your browser.

---

## 📌 Project status

| Module | Status |
|---|---|
| Authentication (Clerk) | ✅ Complete |
| Dashboard | ✅ Complete |
| Categories CRUD | ✅ Complete |
| Transactions CRUD | ✅ Complete |
| Clerk webhook sync | ✅ Complete |
| CPF field / validation | 🟡 Column ready, UI pending |
| Filters & search | 🔴 Not started |
| Pagination | 🔴 Not started |
| Subcategories | 🔴 Not started |
| Recurring transactions | 🔴 Not started |
| Installments | 🔴 Not started |
| Profile editing | 🔴 Not started |
| Reports / charts | 🔴 Not started |
| Dark mode | 🔴 Not started |
| Design system | 🔴 Not started |
| Tests | 🔴 Not started |

---

## 👨‍💻 Author

**Nathan Bortolini**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/feed/)
[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:nathanbs.trabalho@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Narth-2024)

---

<div align="center">

*"Wisdom is more valuable than gold." — Proverbs 3:14*

</div>
