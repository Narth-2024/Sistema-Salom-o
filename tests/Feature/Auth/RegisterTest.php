<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class RegisterTest extends TestCase
{
    use RefreshDatabase;

    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Maria Teste',
            'email' => 'maria@exemplo.com',
            'password' => 'senha123',
            'password_confirmation' => 'senha123',
        ], $overrides);
    }

    public function test_user_can_register_and_is_logged_in(): void
    {
        $this->post('/register', $this->validPayload())
            ->assertRedirect('/recovery-codes');

        $this->assertAuthenticated();
        $this->assertDatabaseHas('users', ['email' => 'maria@exemplo.com']);
        $this->assertSame(1, User::count());
    }

    public function test_register_generates_eight_recovery_codes_shown_once(): void
    {
        $response = $this->post('/register', $this->validPayload());

        $codes = $response->getSession()->get('recoveryCodes');

        $this->assertCount(8, $codes);
        $this->assertSame($codes, array_unique($codes));

        foreach ($codes as $code) {
            $this->assertMatchesRegularExpression('/^[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/', $code);
        }

        $this->assertSame(8, DB::table('recovery_codes')->count());

        // No banco fica apenas o hash: o valor em texto puro não é persistido.
        foreach (DB::table('recovery_codes')->pluck('code_hash') as $hash) {
            $this->assertNotContains($hash, $codes);
            $this->assertSame(64, strlen($hash));
        }
    }

    public function test_email_is_stored_lowercase(): void
    {
        $this->post('/register', $this->validPayload([
            'email' => 'Maria.Silva@Exemplo.COM',
        ]))->assertRedirect('/recovery-codes');

        $this->assertDatabaseHas('users', ['email' => 'maria.silva@exemplo.com']);
    }

    public function test_duplicate_email_is_rejected_regardless_of_case(): void
    {
        User::factory()->create(['email' => 'joao@exemplo.com']);

        $this->post('/register', $this->validPayload([
            'email' => 'JOAO@EXEMPLO.COM',
        ]))->assertSessionHasErrors('email');

        $this->assertSame(1, User::count());
        $this->assertGuest();
    }

    public function test_password_confirmation_must_match(): void
    {
        $this->post('/register', $this->validPayload([
            'password_confirmation' => 'outra_senha',
        ]))->assertSessionHasErrors('password');

        $this->assertGuest();
    }

    public function test_password_must_have_at_least_eight_characters(): void
    {
        $this->post('/register', $this->validPayload([
            'password' => 'curta',
            'password_confirmation' => 'curta',
        ]))->assertSessionHasErrors('password');

        $this->assertGuest();
    }

    public function test_email_is_required_and_must_be_valid(): void
    {
        $this->post('/register', $this->validPayload(['email' => '']))
            ->assertSessionHasErrors('email');

        $this->post('/register', $this->validPayload(['email' => 'invalido']))
            ->assertSessionHasErrors('email');
    }
}
