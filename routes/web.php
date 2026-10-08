<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\ClerkCallbackController;
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

// Clerk callback (após login/registro via Clerk)
Route::get('/auth/clerk-callback', [ClerkCallbackController::class, 'show'])
    ->middleware('guest')
    ->name('clerk.callback');

Route::post('/auth/clerk-exchange', [ClerkCallbackController::class, 'exchange'])
    ->middleware('guest');

// Cron do Vercel: cria transações recorrentes do mês
Route::get('/cron/recurring', function () {
    $secret = config('services.cron.secret');

    if (! $secret || request()->query('secret') !== $secret) {
        abort(403);
    }

    Artisan::call('transactions:spawn-recurring');

    return response()->json(['success' => true, 'output' => Artisan::output()]);
});

// Rotas de autenticação (renderizam Inertia com Clerk)
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::get('/register', [AuthController::class, 'showRegistrationForm'])->name('register');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Rotas protegidas
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics');
    Route::get('/investments', [InvestmentForecastController::class, 'index'])->name('investments');
    Route::post('/investments', [InvestmentForecastController::class, 'store'])->name('investments.store');
    Route::delete('/investments/simulations/{simulation}', [InvestmentForecastController::class, 'destroy'])->name('investments.simulations.destroy');
    Route::resource('categories', CategoryController::class);
    Route::resource('tags', TagController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('transactions', TransactionController::class);
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings');
    Route::post('/settings/profile', [ProfileController::class, 'update'])->name('settings.profile.update');
});
