<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Svix\Webhook;

class TestClerkWebhook extends Command
{
    protected $signature = 'app:test-clerk-webhook
                            {event : Event type (user.created, user.updated, user.deleted)}
                            {--clerk-id= : Clerk user ID}
                            {--email= : User email}
                            {--name= : User name}';

    protected $description = 'Simulate a Clerk webhook event locally';

    public function handle()
    {
        $event = $this->argument('event');
        $clerkId = $this->option('clerk-id') ?? 'test_'.uniqid();
        $email = $this->option('email') ?? 'test@example.com';
        $name = $this->option('name') ?? 'Test User';

        $payload = [
            'data' => [
                'id' => $clerkId,
                'email_addresses' => [
                    ['email_address' => $email],
                ],
                'first_name' => explode(' ', $name)[0],
                'last_name' => explode(' ', $name)[1] ?? '',
            ],
            'object' => 'event',
            'type' => $event,
        ];

        $payloadJson = json_encode($payload);

        $svixId = 'msg_'.bin2hex(random_bytes(8));
        $svixTimestamp = (string) time();

        $wh = new Webhook(config('services.clerk.webhook_secret'));
        $signature = $wh->sign($svixId, $svixTimestamp, $payloadJson);

        $response = Http::withHeaders([
            'svix-id' => $svixId,
            'svix-timestamp' => $svixTimestamp,
            'svix-signature' => $signature,
        ])->withBody($payloadJson, 'application/json')
            ->post(env('APP_URL', 'http://localhost:8001').'/api/clerk/webhook');

        $this->info("Event: {$event}");
        $this->info("Clerk ID: {$clerkId}");
        $this->info('Status: '.$response->status());
        $this->info('Response: '.$response->body());

        return $response->successful() ? Command::SUCCESS : Command::FAILURE;
    }
}
