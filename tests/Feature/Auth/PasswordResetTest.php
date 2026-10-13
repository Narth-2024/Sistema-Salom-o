<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    private function requestToken(string $email): string
    {
        $response = $this->post('/forgot-password', ['email' => $email]);

        $response->assertOk()->assertInertia(fn (AssertableInertia $page) => $page->component('Auth/Login'));

        $token = $response->viewData('page')['props']['resetToken'] ?? null;

        $this->assertIsString($token);
        $this->assertNotEmpty($token);

        return $token;
    }

    public function test_forgot_password_returns_a_reset_token(): void
    {
        // Regressão: o controller importava Illuminate\Support\Facades\Str
        // (classe inexistente), o que derrubava a rota com HTTP 500.
        $user = User::factory()->create(['email' => 'reset@exemplo.com']);

        $token = $this->requestToken('reset@exemplo.com');

        $this->assertSame(64, strlen($token));
        $this->assertDatabaseHas('password_reset_tokens', ['email' => $user->email]);
    }

    public function test_forgot_password_is_case_insensitive_on_email(): void
    {
        User::factory()->create(['email' => 'case.reset@exemplo.com']);

        $this->post('/forgot-password', ['email' => 'CASE.RESET@EXEMPLO.COM'])
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page->has('resetToken'));
    }

    public function test_forgot_password_rejects_unknown_email(): void
    {
        $this->post('/forgot-password', ['email' => 'ninguem@exemplo.com'])
            ->assertSessionHasErrors('email');

        $this->assertGuest();
    }

    public function test_password_can_be_reset_with_the_token(): void
    {
        $user = User::factory()->create([
            'email' => 'trocar@exemplo.com',
            'password' => Hash::make('senha_antiga_1'),
        ]);

        $token = $this->requestToken('trocar@exemplo.com');

        $this->post('/reset-password', [
            'token' => $token,
            'email' => 'trocar@exemplo.com',
            'password' => 'senha_nova_1',
            'password_confirmation' => 'senha_nova_1',
        ])->assertRedirect('/dashboard');

        $this->assertAuthenticatedAs($user);
        $this->assertTrue(Hash::check('senha_nova_1', $user->fresh()->password));

        $this->post('/logout');

        $this->post('/login', [
            'email' => 'trocar@exemplo.com',
            'password' => 'senha_nova_1',
        ])->assertRedirect('/dashboard');
    }

    public function test_reset_is_case_insensitive_on_email(): void
    {
        User::factory()->create(['email' => 'case.full@exemplo.com']);

        $token = $this->requestToken('case.full@exemplo.com');

        $this->post('/reset-password', [
            'token' => $token,
            'email' => 'CASE.FULL@EXEMPLO.COM',
            'password' => 'senha_nova_2',
            'password_confirmation' => 'senha_nova_2',
        ])->assertRedirect('/dashboard');
    }

    public function test_reset_rejects_invalid_token(): void
    {
        User::factory()->create(['email' => 'invalido@exemplo.com']);

        $this->post('/reset-password', [
            'token' => 'token_que_nao_existe',
            'email' => 'invalido@exemplo.com',
            'password' => 'senha_nova_3',
            'password_confirmation' => 'senha_nova_3',
        ])->assertSessionHasErrors('token');

        $this->assertGuest();
    }

    public function test_token_is_single_use(): void
    {
        User::factory()->create(['email' => 'reuso@exemplo.com']);

        $token = $this->requestToken('reuso@exemplo.com');

        $payload = [
            'token' => $token,
            'email' => 'reuso@exemplo.com',
            'password' => 'senha_nova_4',
            'password_confirmation' => 'senha_nova_4',
        ];

        $this->post('/reset-password', $payload)->assertRedirect('/dashboard');
        $this->post('/logout');

        $this->post('/reset-password', $payload)->assertSessionHasErrors('token');
    }
}
