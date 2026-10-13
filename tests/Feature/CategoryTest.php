<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login(): void
    {
        $this->get('/categories')->assertRedirect('/login');
    }

    public function test_user_can_create_a_category(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/categories', [
            'name' => 'Alimentação',
            'type' => 'expense',
            'color' => '#ef4444',
        ]);

        $response->assertRedirect(route('categories.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('categories', [
            'user_id' => $user->id,
            'name' => 'Alimentação',
            'type' => 'expense',
        ]);
    }

    public function test_index_lists_only_own_categories(): void
    {
        $user = User::factory()->create();
        Category::factory()->count(2)->create(['user_id' => $user->id]);
        Category::factory()->create(); // de outro usuário

        $this->actingAs($user)
            ->get('/categories')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Categories/Index')
                ->has('categories.data', 2));
    }

    public function test_store_validates_type_and_name(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post('/categories', [
            'name' => '',
            'type' => 'qualquer',
        ])->assertSessionHasErrors(['name', 'type']);
    }

    public function test_user_can_update_own_category(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user)->put("/categories/{$category->id}", [
            'name' => 'Transporte',
            'type' => 'expense',
            'color' => '#3b82f6',
        ])->assertRedirect(route('categories.index'));

        $this->assertSame('Transporte', $category->fresh()->name);
    }

    public function test_user_cannot_view_edit_update_or_delete_another_users_category(): void
    {
        $foreign = Category::factory()->create();
        $user = User::factory()->create();

        $this->actingAs($user)->get("/categories/{$foreign->id}")->assertForbidden();
        $this->actingAs($user)->get("/categories/{$foreign->id}/edit")->assertForbidden();

        $this->actingAs($user)->put("/categories/{$foreign->id}", [
            'name' => 'Hackeado',
            'type' => 'income',
        ])->assertForbidden();

        $this->actingAs($user)->delete("/categories/{$foreign->id}")->assertForbidden();

        $this->assertSame($foreign->name, $foreign->fresh()->name);
        $this->assertNull($foreign->fresh()->deleted_at);
    }

    public function test_soft_deleting_and_restoring_a_category(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->delete("/categories/{$category->id}");

        $response->assertRedirect(route('categories.index'));
        $response->assertSessionHas('undo');
        $this->assertSoftDeleted('categories', ['id' => $category->id]);

        $this->actingAs($user)
            ->post("/categories/{$category->id}/restore")
            ->assertRedirect(route('categories.index'));

        $this->assertNull($category->fresh()->deleted_at);
    }

    public function test_category_index_shows_transaction_count(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create(['user_id' => $user->id, 'type' => 'expense']);

        Transaction::factory()->count(3)->create([
            'user_id' => $user->id,
            'category_id' => $category->id,
        ]);

        $this->actingAs($user)
            ->get('/categories')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('categories.data.0.transactions_count', 3));
    }
}
