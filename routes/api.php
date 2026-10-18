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
// Não existe nenhuma rota de API autenticada por token: a aplicação é uma SPA
// com sessão do Laravel. Por isso o Sanctum — e a tabela personal_access_tokens
// dele — foi removido do projeto.
Route::post('/clerk/webhook', ClerkWebhookController::class);
