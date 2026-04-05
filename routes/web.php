<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TransactionController;

// Rotas públicas
Route::get('/', function () {
    return view('home');
})->name('home');

Route::get('/auth', [AuthController::class, 'show'])->name('auth.show');
Route::get('/login', [AuthController::class, 'showLogin']);
Route::post('/auth/verify-session', [AuthController::class, 'verifySession'])->name('auth.verify-session');
Route::get('/logout', [AuthController::class, 'logout'])->name('logout');

// Tela placeholder "funciona"
Route::get('/work', function () {
    return view('work');
})->middleware('auth')->name('work');

// Rotas protegidas
Route::middleware(['auth'])->group(function () {

    Route::resource('categories', CategoryController::class);
    Route::resource('transactions', TransactionController::class);

});
