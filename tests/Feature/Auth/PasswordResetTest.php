<?php

namespace Tests\Feature\Auth;

use App\Mail\PasswordResetLink;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Mail::fake();
    }

    private function lastResetUrl(): string
    {
        $url = null;

        Mail::assertSent(PasswordResetLink::class, function (PasswordResetLink $mail) use (&$url) {
            $url = $mail->resetUrl;

            return true;
        });

        $this->assertIsString($url);

        return $url;
    }

    private function tokenFromUrl(string $url): string
    {
        // O token vai no path da rota (/reset-password/{token}); o email vai na query.
        $token = basename((string) parse_url($url, PHP_URL_PATH));

        $this->assertNotEmpty($token);

        return $token;
    }

    public function test_forgot_password_sends_a_reset_link_by_email(): void
    {
        // Regressão: o controller importava Illuminate\Support\Facades\Str
        // (classe inexistente), o que derrubava a rota com HTTP 500.
        $user = User::factory()->create(['email' => 'reset@exemplo.com']);

        $this->post('/forgot-password', ['email' => 'reset@exemplo.com'])
            ->assertRedirect()
            ->assertSessionHas('success');

        $url = $this->lastResetUrl();

        $this->assertStringContainsString('http://localhost/reset-password/', $url);
        $this->assertStringContainsString('email=reset%40exemplo.com', $url);
        $this->assertDatabaseHas('password_reset_tokens', ['email' => $user->email]);

        $this->assertSame(64, strlen($this->tokenFromUrl($url)));
    }

    public function test_forgot_password_does_not_leak_the_token_in_the_response(): void
    {
        User::factory()->create(['email' => 'seguro@exemplo.com']);

        $response = $this->post('/forgot-password', ['email' => 'seguro@exemplo.com']);

        $response->assertRedirect()->assertSessionHas('success');

        $token = $this->tokenFromUrl($this->lastResetUrl());

        $this->assertStringNotContainsString($token, $response->getContent());
        $this->assertStringNotContainsString('resetToken', $response->getContent());
    }

    public function test_forgot_password_answers_the_same_way_for_unknown_emails(): void
    {
        $expected = 'Se existir uma conta com esse email, enviaremos um link de redefinição. Confira sua caixa de entrada.';

        User::factory()->create(['email' => 'existe@exemplo.com']);

        $known = $this->post('/forgot-password', ['email' => 'existe@exemplo.com']);
        Mail::fake();
        $unknown = $this->post('/forgot-password', ['email' => 'naoexiste@exemplo.com']);

        $known->assertRedirect()->assertSessionHas('success', $expected);
        $unknown->assertRedirect()->assertSessionHas('success', $expected);
        $unknown->assertSessionDoesntHaveErrors();
        $this->assertGuest();

        Mail::assertNothingSent();
    }

    public function test_forgot_password_is_case_insensitive_on_email(): void
    {
        User::factory()->create(['email' => 'case.reset@exemplo.com']);

        $this->post('/forgot-password', ['email' => 'CASE.RESET@EXEMPLO.COM'])
            ->assertRedirect()
            ->assertSessionHas('success');

        $this->assertStringContainsString('email=case.reset%40exemplo.com', $this->lastResetUrl());
    }

    public function test_forgot_password_validates_the_email(): void
    {
        $this->post('/forgot-password', ['email' => 'nao-e-email'])
            ->assertSessionHasErrors('email');
    }

    public function test_mail_failure_does_not_break_the_flow(): void
    {
        User::factory()->create(['email' => 'smtp@exemplo.com']);

        Mail::shouldReceive('to')->andThrow(new \RuntimeException('SMTP indisponível'));

        $this->post('/forgot-password', ['email' => 'smtp@exemplo.com'])
            ->assertRedirect()
            ->assertSessionHas('success');
    }

    public function test_reset_link_opens_the_reset_form(): void
    {
        User::factory()->create(['email' => 'abrir@exemplo.com']);

        $this->post('/forgot-password', ['email' => 'abrir@exemplo.com']);
        $url = $this->lastResetUrl();

        $this->get($url)
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Auth/Login')
                ->where('resetEmail', 'abrir@exemplo.com')
                ->has('resetToken'));
    }

    public function test_password_can_be_reset_with_the_link(): void
    {
        $user = User::factory()->create([
            'email' => 'trocar@exemplo.com',
            'password' => Hash::make('senha_antiga_1'),
        ]);

        $this->post('/forgot-password', ['email' => 'trocar@exemplo.com']);
        $token = $this->tokenFromUrl($this->lastResetUrl());

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

        $this->post('/forgot-password', ['email' => 'case.full@exemplo.com']);
        $token = $this->tokenFromUrl($this->lastResetUrl());

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

    public function test_reset_rejects_an_expired_token(): void
    {
        $user = User::factory()->create(['email' => 'expirado@exemplo.com']);

        $this->post('/forgot-password', ['email' => 'expirado@exemplo.com']);
        $token = $this->tokenFromUrl($this->lastResetUrl());

        DB::table('password_reset_tokens')
            ->where('email', $user->email)
            ->update(['created_at' => now()->subHours(2)]);

        $this->post('/reset-password', [
            'token' => $token,
            'email' => 'expirado@exemplo.com',
            'password' => 'senha_nova_5',
            'password_confirmation' => 'senha_nova_5',
        ])->assertSessionHasErrors('token');
    }

    public function test_token_is_single_use(): void
    {
        User::factory()->create(['email' => 'reuso@exemplo.com']);

        $this->post('/forgot-password', ['email' => 'reuso@exemplo.com']);
        $token = $this->tokenFromUrl($this->lastResetUrl());

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
