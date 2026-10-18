<?php

use App\Http\Controllers\Auth\ClerkWebhookController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application.
| These routes are loaded by the RouteServiceProvider and all of them
| will be assigned to the "api" middleware group. Make something great!
|
*/

// Eventos do Clerk (cadastro/atualização/exclusão de usuário).
// A assinatura Svix é conferida dentro do controller.
//
// Observação: antes havia aqui um GET /api/user protegido por auth:sanctum.
// Ele nunca era consumido pelo front (a sessão é do Laravel, não um token de
// API), então foi removido — o que torna o Sanctum de fato sem uso no projeto.
Route::post('/clerk/webhook', ClerkWebhookController::class);
