<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TransactionController;

//rotas pública

Route::get('/', function () {
    return view('home');
})->name('home');

//autenticação

Route::get('/auth', [AuthController::class, 'show'])->name('auth.show');

Route::get('/login', [AuthController::class, 'showLogin']);
Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::post('/register', [AuthController::class, 'register'])->name('register');


//rotas protegidas

Route::middleware(['auth'])->group(function () {

Route::resource('categories', CategoryController::class);
Route::resource('transactions', TransactionController::class);

Route::get('/its-working', function () {
    return view('its-working');
});


});
