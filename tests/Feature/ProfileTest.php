<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login(): void
    {
        $this->get('/settings')->assertRedirect('/login');
    }

    public function test_settings_page_renders(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->get('/settings')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page->component('Settings'));
    }

    public function test_user_can_update_their_name(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post('/settings/profile', [
            'name' => 'Nome Atualizado',
        ])->assertSessionHas('success');

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Nome Atualizado',
        ]);
    }

    public function test_user_can_delete_their_account_by_confirming_their_email(): void
    {
        $user = User::factory()->create();
        Category::factory()->create(['user_id' => $user->id]);
        Category::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user)->delete('/settings/profile', [
            'confirmation' => $user->email,
        ])->assertRedirect(route('home'))
            ->assertSessionHas('success');

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
        $this->assertDatabaseMissing('categories', ['user_id' => $user->id]);
    }

    /**
     * Regressão: Auth::logout() gira o remember token com $user->save(). Se a
     * sessão fosse encerrada depois do delete(), esse save faria um INSERT e a
     * conta voltaria a existir — o logout precisa vir antes.
     */
    public function test_account_stays_deleted_even_when_the_user_has_a_remember_token(): void
    {
        $user = User::factory()->create(['remember_token' => 'abc123def456']);

        $this->actingAs($user)->delete('/settings/profile', [
            'confirmation' => $user->email,
        ]);

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    public function test_deleting_an_account_also_removes_its_soft_deleted_transactions(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create(['user_id' => $user->id]);
        Transaction::factory()->count(2)->create([
            'user_id' => $user->id,
            'category_id' => $category->id,
        ]);

        $this->actingAs($user)->delete('/settings/profile', [
            'confirmation' => $user->email,
        ]);

        $this->assertSame(0, Transaction::withTrashed()->where('user_id', $user->id)->count());
    }

    public function test_deleting_an_account_leaves_other_users_intact(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $otherCategory = Category::factory()->create(['user_id' => $other->id]);

        $this->actingAs($user)->delete('/settings/profile', [
            'confirmation' => $user->email,
        ]);

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
        $this->assertDatabaseHas('users', ['id' => $other->id]);
        $this->assertDatabaseHas('categories', ['id' => $otherCategory->id]);
    }

    public function test_account_deletion_is_rejected_when_the_email_does_not_match(): void
    {
        $user = User::factory()->create(['email' => 'nathan@example.com']);

        $this->actingAs($user)->delete('/settings/profile', [
            'confirmation' => 'outra.pessoa@example.com',
        ])->assertSessionHasErrors('confirmation');

        $this->assertDatabaseHas('users', ['id' => $user->id]);
    }

    public function test_account_deletion_requires_a_confirmation(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->delete('/settings/profile', [])
            ->assertSessionHasErrors('confirmation');

        $this->assertDatabaseHas('users', ['id' => $user->id]);
    }

    /**
     * A senha local é um valor aleatório gerado no ClerkUserSync e que ninguém
     * conhece, então qualquer fluxo de troca aqui estaria condenado a falhar.
     * Por isso a rota não existe mais: a senha é do Clerk.
     */
    public function test_there_is_no_local_password_change_route(): void
    {
        $this->post('/settings/password', [
            'current_password' => 'password',
            'password' => 'novasenha123',
            'password_confirmation' => 'novasenha123',
        ])->assertNotFound();
    }
}
