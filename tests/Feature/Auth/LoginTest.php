<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login_from_protected_page(): void
    {
        $this->get('/dashboard')->assertRedirect('/login');
    }

    public function test_user_can_login_with_valid_credentials(): void
    {
        $user = User::factory()->create(['password' => Hash::make('senha123')]);

        $this->post('/login', [
            'email' => $user->email,
            'password' => 'senha123',
        ])->assertRedirect('/dashboard');

        $this->assertAuthenticatedAs($user);
    }

    public function test_login_rejects_wrong_password(): void
    {
        $user = User::factory()->create(['password' => Hash::make('senha123')]);

        $this->post('/login', [
            'email' => $user->email,
            'password' => 'senha_errada',
        ])->assertSessionHasErrors('email');

        $this->assertGuest();
    }

    public function test_login_rejects_unknown_email(): void
    {
        User::factory()->create(['email' => 'existe@exemplo.com']);

        $this->post('/login', [
            'email' => 'naoexiste@exemplo.com',
            'password' => 'senha123',
        ])->assertSessionHasErrors('email');

        $this->assertGuest();
    }

    public function test_login_is_case_insensitive_on_email(): void
    {
        $user = User::factory()->create([
            'email' => 'Joao.Silva@Exemplo.com',
            'password' => Hash::make('senha123'),
        ]);

        $this->post('/login', [
            'email' => 'JOAO.SILVA@EXEMPLO.COM',
            'password' => 'senha123',
        ])->assertRedirect('/dashboard');

        $this->assertAuthenticatedAs($user);
    }

    public function test_login_validates_email_format(): void
    {
        $this->post('/login', [
            'email' => 'nao-e-email',
            'password' => 'senha123',
        ])->assertSessionHasErrors('email');

        $this->assertGuest();
    }

    public function test_authenticated_user_is_redirected_away_from_login(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->get('/login')->assertRedirect('/dashboard');
    }
}
