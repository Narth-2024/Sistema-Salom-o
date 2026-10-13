<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Services\ClerkTokenValidator;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\Concerns\FakesClerkJwt;
use Tests\TestCase;

class ClerkExchangeTest extends TestCase
{
    use FakesClerkJwt, RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->setUpClerkJwt();
        $this->configureClerk();

        // Troca a validação real pela chave de teste, sem rede.
        $this->app->instance(ClerkTokenValidator::class, $this->clerkValidator());
    }

    public function test_rejects_a_request_without_a_token(): void
    {
        $this->postJson('/auth/clerk-exchange')
            ->assertStatus(401)
            ->assertJson(['error' => 'Sessão do Clerk ausente.']);
    }

    public function test_rejects_an_invalid_token(): void
    {
        $this->postJson('/auth/clerk-exchange', [], [
            'Authorization' => 'Bearer token-falso',
        ])->assertStatus(401);
    }

    public function test_rejects_a_token_issued_for_another_application(): void
    {
        $token = $this->clerkJwt(['azp' => 'https://outra-app.com']);

        $this->postJson('/auth/clerk-exchange', [], [
            'Authorization' => "Bearer {$token}",
        ])->assertStatus(401);
    }

    public function test_creates_the_local_user_and_starts_a_laravel_session(): void
    {
        Http::fake([
            'api.clerk.com/v1/users/*' => Http::response($this->clerkUserPayload(), 200),
        ]);

        $response = $this->postJson('/auth/clerk-exchange', [], [
            'Authorization' => 'Bearer ' . $this->clerkJwt(),
        ]);

        $response->assertOk()->assertJson(['redirect' => '/dashboard']);

        $this->assertAuthenticatedAs(
            User::where('clerk_id', 'user_test123')->firstOrFail()
        );

        $this->assertDatabaseHas('users', [
            'clerk_id' => 'user_test123',
            'email' => 'nathanbdsilvars@gmail.com',
        ]);
    }

    public function test_links_an_existing_local_account_instead_of_duplicating_it(): void
    {
        // É o caso da migração: a conta já existe no banco, ainda sem clerk_id.
        $existing = User::factory()->create([
            'email' => 'NathanBdSilvars@Gmail.com',
            'name' => 'Nathan Silva',
        ]);

        Http::fake([
            'api.clerk.com/v1/users/*' => Http::response($this->clerkUserPayload(), 200),
        ]);

        $this->postJson('/auth/clerk-exchange', [], [
            'Authorization' => 'Bearer ' . $this->clerkJwt(),
        ])->assertOk();

        $this->assertDatabaseCount('users', 1);
        $this->assertAuthenticatedAs($existing->fresh());

        $this->assertSame('user_test123', $existing->fresh()->clerk_id);
    }

    public function test_does_not_take_identity_from_the_request_body(): void
    {
        // O corpo da requisição não tem peso nenhum: a identidade vem do `sub`
        // do token. Um atacante mandando outro clerk_id no JSON não muda nada.
        Http::fake([
            'api.clerk.com/v1/users/*' => Http::response($this->clerkUserPayload(), 200),
        ]);

        $this->postJson('/auth/clerk-exchange', ['clerk_id' => 'user_de_muita_gente'], [
            'Authorization' => 'Bearer ' . $this->clerkJwt(),
        ])->assertOk();

        $this->assertDatabaseMissing('users', ['clerk_id' => 'user_de_muita_gente']);
        $this->assertDatabaseHas('users', ['clerk_id' => 'user_test123']);
    }

    public function test_logs_in_with_a_compact_session_token_without_email_claims(): void
    {
        // Regressão: o session token padrão do Clerk é enxuto (só sub/sid/sts,
        // sem `email`). A identidade vem da Backend API — o token não pode
        // derrubar o exchange com TypeError.
        Http::fake([
            'api.clerk.com/v1/users/*' => Http::response($this->clerkUserPayload(), 200),
        ]);

        $this->postJson('/auth/clerk-exchange', [], [
            'Authorization' => 'Bearer ' . $this->clerkCompactJwt(),
        ])->assertOk()->assertJson(['redirect' => '/dashboard']);

        $this->assertAuthenticatedAs(
            User::where('clerk_id', 'user_test123')->firstOrFail()
        );

        $this->assertDatabaseHas('users', [
            'clerk_id' => 'user_test123',
            'email' => 'nathanbdsilvars@gmail.com',
        ]);
    }

    public function test_reports_a_failure_when_the_clerk_api_is_unreachable(): void
    {
        Http::fake([
            'api.clerk.com/v1/users/*' => Http::response('boom', 500),
        ]);

        $this->postJson('/auth/clerk-exchange', [], [
            'Authorization' => 'Bearer ' . $this->clerkJwt(),
        ])->assertStatus(502);

        $this->assertGuest();
    }

    public function test_regenerates_the_session_id_on_login(): void
    {
        Http::fake([
            'api.clerk.com/v1/users/*' => Http::response($this->clerkUserPayload(), 200),
        ]);

        $before = session()->getId();

        $this->postJson('/auth/clerk-exchange', [], [
            'Authorization' => 'Bearer ' . $this->clerkJwt(),
        ])->assertOk();

        $this->assertNotSame($before, session()->getId());
    }

    public function test_the_callback_page_renders_for_guests(): void
    {
        $this->get('/auth/clerk-callback')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Auth/ClerkCallback'));
    }

    public function test_authenticated_users_are_sent_away_from_the_callback(): void
    {
        $this->actingAs(User::factory()->create())
            ->get('/auth/clerk-callback')
            ->assertRedirect('/dashboard');
    }

    /**
     * @return array<string, mixed>
     */
    private function clerkUserPayload(): array
    {
        return [
            'id' => 'user_test123',
            'first_name' => 'Nathan',
            'last_name' => 'Silva',
            'primary_email_address_id' => 'idn_1',
            'email_addresses' => [
                ['id' => 'idn_1', 'email_address' => 'nathanbdsilvars@gmail.com'],
            ],
        ];
    }
}
