<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Svix\Webhook;
use Tests\Concerns\FakesClerkJwt;
use Tests\TestCase;

class ClerkWebhookTest extends TestCase
{
    use FakesClerkJwt, RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->setUpClerkJwt();
        $this->configureClerk();
    }

    public function test_rejects_a_request_without_a_signature(): void
    {
        $this->postJson('/api/clerk/webhook', ['type' => 'user.created'])
            ->assertStatus(401);
    }

    public function test_rejects_a_request_with_a_wrong_signature(): void
    {
        $payload = json_encode($this->event('user.created'));
        $headers = $this->sign($payload);

        $headers['svix-signature'] = 'v1,' . base64_encode('assinatura-errada');

        $this->call('POST', '/api/clerk/webhook', [], [], [], $this->serverHeaders($headers), $payload)
            ->assertStatus(401);
    }

    public function test_rejects_a_request_with_a_stale_timestamp(): void
    {
        $payload = json_encode($this->event('user.created'));
        $headers = $this->sign($payload, timestamp: time() - 3600);

        $this->call('POST', '/api/clerk/webhook', [], [], [], $this->serverHeaders($headers), $payload)
            ->assertStatus(401);
    }

    public function test_user_created_makes_a_new_local_account(): void
    {
        $payload = json_encode($this->event('user.created'));

        $this->deliver($payload)
            ->assertOk();

        $this->assertDatabaseHas('users', [
            'clerk_id' => 'user_novo',
            'email' => 'novo@exemplo.com',
        ]);
    }

    public function test_user_created_links_an_account_that_already_exists_by_email(): void
    {
        // Conta local pré-existente (o caso da migração dos 9 usuários).
        $existing = User::factory()->create(['email' => 'novo@exemplo.com']);

        $payload = json_encode($this->event('user.created'));

        $this->deliver($payload)->assertOk();

        $this->assertDatabaseCount('users', 1);
        $this->assertSame('user_novo', $existing->fresh()->clerk_id);
    }

    public function test_user_updated_keeps_name_and_email_in_sync(): void
    {
        User::factory()->create([
            'clerk_id' => 'user_novo',
            'email' => 'novo@exemplo.com',
            'name' => 'Nome Antigo',
        ]);

        $event = $this->event('user.updated');
        $event['data']['first_name'] = 'Nome';
        $event['data']['last_name'] = 'Novo';
        $event['data']['email_addresses'][0]['email_address'] = 'novo@exemplo.com';

        $this->deliver(json_encode($event))->assertOk();

        $this->assertDatabaseHas('users', [
            'clerk_id' => 'user_novo',
            'name' => 'Nome Novo',
        ]);
    }

    public function test_user_deleted_removes_the_local_account(): void
    {
        User::factory()->create(['clerk_id' => 'user_novo', 'email' => 'novo@exemplo.com']);

        $payload = json_encode($this->event('user.deleted'));

        $this->deliver($payload)->assertOk();

        $this->assertDatabaseMissing('users', ['clerk_id' => 'user_novo']);
    }

    public function test_an_unrelated_event_is_acknowledged(): void
    {
        $payload = json_encode($this->event('session.created'));

        $this->deliver($payload)->assertOk();
    }

    private function deliver(string $payload, ?array $headers = null)
    {
        $headers ??= $this->sign($payload);

        return $this->call(
            'POST',
            '/api/clerk/webhook',
            [],
            [],
            [],
            $this->serverHeaders($headers),
            $payload
        );
    }

    /**
     * @return array<string, string>
     */
    private function sign(string $payload, ?string $id = null, ?int $timestamp = null): array
    {
        $id ??= 'msg_' . Str::random(12);
        $timestamp ??= time();

        return [
            'svix-id' => $id,
            'svix-timestamp' => (string) $timestamp,
            'svix-signature' => (new Webhook(config('services.clerk.webhook_secret')))
                ->sign($id, $timestamp, $payload),
        ];
    }

    /**
     * O parâmetro `$server` do request do Symfony espera o formato `HTTP_*`;
     * passar `svix-id` cru simplesmente não vira header.
     *
     * @param  array<string, string>  $headers
     * @return array<string, string>
     */
    private function serverHeaders(array $headers): array
    {
        return [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_ACCEPT' => 'application/json',
            'HTTP_SVIX_ID' => $headers['svix-id'],
            'HTTP_SVIX_TIMESTAMP' => $headers['svix-timestamp'],
            'HTTP_SVIX_SIGNATURE' => $headers['svix-signature'],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function event(string $type): array
    {
        return [
            'type' => $type,
            'data' => [
                'id' => 'user_novo',
                'first_name' => 'Novo',
                'last_name' => 'Usuário',
                'primary_email_address_id' => 'idn_1',
                'email_addresses' => [
                    ['id' => 'idn_1', 'email_address' => 'novo@exemplo.com'],
                ],
            ],
        ];
    }
}
