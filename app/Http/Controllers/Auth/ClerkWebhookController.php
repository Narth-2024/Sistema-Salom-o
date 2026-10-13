<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\ClerkUserSync;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Svix\Webhook;

/**
 * Recebe os eventos de usuário do Clerk e mantém a tabela local em dia.
 *
 * `user.created` e `user.updated` passam pelo mesmo ClerkUserSync do login,
 * então um cadastro feito no Clerk com e-mail que já existe aqui **vincula**
 * a conta existente em vez de duplicar.
 */
class ClerkWebhookController extends Controller
{
    public function __invoke(Request $request, ClerkUserSync $sync): JsonResponse
    {
        $signingSecret = config('services.clerk.webhook_secret');

        if (! $signingSecret) {
            Log::error('Clerk webhook: CLERK_WEBHOOK_SECRET não configurado');

            return response()->json(['error' => 'Webhook não configurado.'], 500);
        }

        try {
            $headers = array_map(
                fn ($value) => is_array($value) ? $value[0] : $value,
                $request->headers->all()
            );

            $payload = (new Webhook($signingSecret))->verify($request->getContent(), $headers);
        } catch (\Throwable $e) {
            Log::warning('Clerk webhook: assinatura inválida', ['error' => $e->getMessage()]);

            return response()->json(['error' => 'Invalid signature'], 401);
        }

        $type = $payload['type'] ?? '';
        $data = $payload['data'] ?? [];

        try {
            match ($type) {
                'user.created', 'user.updated' => $sync->sync($data),
                'user.deleted' => $this->handleDeleted($data),
                default => Log::info('Clerk webhook: evento ignorado', ['type' => $type]),
            };
        } catch (\Throwable $e) {
            // Responde 200 mesmo assim: reprocessar o mesmo evento não resolve
            // nada, e o Clerk marcaria a entrega como falha repetidamente.
            Log::error('Clerk webhook: falha ao processar', [
                'type' => $type,
                'message' => $e->getMessage(),
            ]);
        }

        return response()->json(['success' => true]);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function handleDeleted(array $data): void
    {
        $clerkId = (string) ($data['id'] ?? '');

        if ($clerkId === '') {
            return;
        }

        $deleted = \App\Models\User::where('clerk_id', $clerkId)->delete();

        Log::info('Clerk webhook: usuário removido', [
            'clerk_id' => $clerkId,
            'registros' => $deleted,
        ]);
    }
}
