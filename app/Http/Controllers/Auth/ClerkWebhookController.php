<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Svix\Webhook;

class ClerkWebhookController extends Controller
{
    public function __invoke(Request $request)
    {
        $signingSecret = config('services.clerk.webhook_secret');

        try {
            $wh = new Webhook($signingSecret);
            $headers = array_map(fn($v) => is_array($v) ? $v[0] : $v, $request->headers->all());
            $payload = $wh->verify($request->getContent(), $headers);
        } catch (\Exception $e) {
            Log::warning('Clerk webhook: invalid signature', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Invalid signature'], 401);
        }

        $eventType = $payload['type'] ?? '';

        match ($eventType) {
            'user.created' => $this->handleUserCreated($payload['data'] ?? []),
            'user.updated' => $this->handleUserUpdated($payload['data'] ?? []),
            'user.deleted' => $this->handleUserDeleted($payload['data'] ?? []),
            default => Log::info('Clerk webhook: unhandled event', ['type' => $eventType]),
        };

        return response()->json(['success' => true]);
    }

    private function handleUserCreated(array $data): void
    {
        $clerkId = $data['id'] ?? null;
        if (!$clerkId) return;

        if (User::where('clerk_id', $clerkId)->exists()) return;

        $email = $data['email_addresses'][0]['email_address'] ?? '';
        $firstName = $data['first_name'] ?? '';
        $lastName = $data['last_name'] ?? '';
        $name = trim("{$firstName} {$lastName}") ?: $email;

        User::create([
            'clerk_id' => $clerkId,
            'name' => $name,
            'email' => $email,
            'password' => bcrypt(Str::random(40)),
        ]);

        Log::info('Clerk webhook: user created', ['clerk_id' => $clerkId, 'email' => $email]);
    }

    private function handleUserUpdated(array $data): void
    {
        $clerkId = $data['id'] ?? null;
        if (!$clerkId) return;

        $user = User::where('clerk_id', $clerkId)->first();
        if (!$user) return;

        $email = $data['email_addresses'][0]['email_address'] ?? $user->email;
        $firstName = $data['first_name'] ?? '';
        $lastName = $data['last_name'] ?? '';
        $name = trim("{$firstName} {$lastName}") ?: $user->name;

        $user->update([
            'name' => $name,
            'email' => $email,
        ]);

        Log::info('Clerk webhook: user updated', ['clerk_id' => $clerkId]);
    }

    private function handleUserDeleted(array $data): void
    {
        $clerkId = $data['id'] ?? null;
        if (!$clerkId) return;

        User::where('clerk_id', $clerkId)->delete();

        Log::info('Clerk webhook: user deleted', ['clerk_id' => $clerkId]);
    }
}
