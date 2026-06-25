<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\ClerkCallbackController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AnalyticsController;

// Rotas públicas
Route::get('/', function () {
    return view('home');
})->name('home');

// Clerk callback (após login/registro via Clerk)
Route::get('/auth/clerk-callback', [ClerkCallbackController::class, 'show'])
    ->middleware('guest')
    ->name('clerk.callback');

Route::post('/auth/clerk-exchange', [ClerkCallbackController::class, 'exchange'])
    ->middleware('guest');

// Rotas de autenticação (renderizam Inertia com Clerk)
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::get('/register', [AuthController::class, 'showRegistrationForm'])->name('register');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Rotas protegidas
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics');
    Route::resource('categories', CategoryController::class);
    Route::resource('transactions', TransactionController::class);
});
