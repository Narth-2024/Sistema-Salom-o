<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InvestmentForecastController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\TransactionController;
use App\Models\User;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Rotas públicas
Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'timestamp' => now()->toIso8601String()]);
});

// Rotas de autenticação
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.attempt');
Route::get('/register', [AuthController::class, 'showRegistrationForm'])->name('register');
Route::post('/register', [AuthController::class, 'register'])->name('register.attempt');
Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->name('password.email');
Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('password.update');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Cron do Vercel: cria transações recorrentes do mês
Route::get('/cron/recurring', function () {
    $secret = config('services.cron.secret');

    if (! $secret || request()->query('secret') !== $secret) {
        abort(403);
    }

    Artisan::call('transactions:spawn-recurring');

    return response()->json(['success' => true, 'output' => Artisan::output()]);
});

// Rotas protegidas
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics');
    Route::get('/investments', [InvestmentForecastController::class, 'index'])->name('investments');
    Route::post('/investments', [InvestmentForecastController::class, 'store'])->name('investments.store');
    Route::delete('/investments/simulations/{simulation}', [InvestmentForecastController::class, 'destroy'])->name('investments.simulations.destroy');
    Route::resource('categories', CategoryController::class);
    Route::resource('tags', TagController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::get('/transactions/export', [TransactionController::class, 'export'])->name('transactions.export');
    Route::resource('transactions', TransactionController::class);
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings');
    Route::post('/settings/profile', [ProfileController::class, 'update'])->name('settings.profile.update');
    Route::post('/settings/password', [ProfileController::class, 'updatePassword'])->name('settings.password.update');
});
