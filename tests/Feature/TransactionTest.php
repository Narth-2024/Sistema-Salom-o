<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Tag;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class TransactionTest extends TestCase
{
    use RefreshDatabase;

    private function userWithCategory(string $type = 'expense'): array
    {
        $user = User::factory()->create();
        $category = Category::factory()->create(['user_id' => $user->id, 'type' => $type]);

        return [$user, $category];
    }

    public function test_guest_is_redirected_to_login(): void
    {
        $this->get('/transactions')->assertRedirect('/login');
    }

    public function test_index_lists_only_the_authenticated_users_transactions(): void
    {
        [$user] = $this->userWithCategory();

        Transaction::factory()->forUser($user)->count(2)->create();
        Transaction::factory()->create(); // pertence a outro usuário

        $this->actingAs($user)
            ->get('/transactions')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Transactions/Index')
                ->has('transactions.data', 2));
    }

    public function test_index_search_filter_is_case_insensitive(): void
    {
        [$user] = $this->userWithCategory();

        Transaction::factory()->forUser($user)->create(['description' => 'Supermercado Zaffari']);
        Transaction::factory()->forUser($user)->create(['description' => 'Farmácia']);

        $this->actingAs($user)
            ->get('/transactions?search=zaffari')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->has('transactions.data', 1)
                ->where('transactions.data.0.description', 'Supermercado Zaffari'));
    }

    public function test_user_can_create_a_transaction(): void
    {
        [$user, $category] = $this->userWithCategory();

        $response = $this->actingAs($user)->post('/transactions', [
            'category_id' => $category->id,
            'type' => 'expense',
            'amount' => '150,75',
            'description' => 'Mercado',
            'transaction_date' => '2026-10-01',
        ]);

        $response->assertRedirect(route('transactions.index'));
        $response->assertSessionHas('success');

        $transaction = Transaction::first();
        $this->assertSame($user->id, $transaction->user_id);
        $this->assertSame($category->id, $transaction->category_id);
        $this->assertSame('expense', $transaction->type);
        $this->assertEquals(150.75, (float) $transaction->amount);
    }

    public function test_store_rejects_another_users_category(): void
    {
        [$user] = $this->userWithCategory();

        $otherUser = User::factory()->create();
        $foreignCategory = Category::factory()->create(['user_id' => $otherUser->id]);

        $this->actingAs($user)->post('/transactions', [
            'category_id' => $foreignCategory->id,
            'type' => 'expense',
            'amount' => '10',
            'transaction_date' => '2026-10-01',
        ])->assertSessionHasErrors('category_id');

        $this->assertSame(0, Transaction::count());
    }

    public function test_store_rejects_another_users_tag(): void
    {
        [$user, $category] = $this->userWithCategory();

        $foreignTag = Tag::factory()->create(['user_id' => User::factory()->create()->id]);

        $this->actingAs($user)->post('/transactions', [
            'category_id' => $category->id,
            'type' => 'expense',
            'amount' => '10',
            'transaction_date' => '2026-10-01',
            'tag_ids' => [$foreignTag->id],
        ])->assertSessionHasErrors('tag_ids.0');

        $this->assertSame(0, Transaction::count());
    }

    public function test_store_accepts_own_tag(): void
    {
        [$user, $category] = $this->userWithCategory();
        $tag = Tag::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user)->post('/transactions', [
            'category_id' => $category->id,
            'type' => 'expense',
            'amount' => '10',
            'transaction_date' => '2026-10-01',
            'tag_ids' => [$tag->id],
        ])->assertRedirect(route('transactions.index'));

        $this->assertDatabaseHas('transaction_tag', ['tag_id' => $tag->id]);
    }

    public function test_store_validates_required_fields(): void
    {
        [$user] = $this->userWithCategory();

        $this->actingAs($user)->post('/transactions', [])
            ->assertSessionHasErrors([
                'category_id',
                'type',
                'amount',
                'transaction_date',
            ]);

        $this->actingAs($user)->post('/transactions', [
            'category_id' => Category::factory()->create(['user_id' => $user->id])->id,
            'type' => 'outro',
            'amount' => '0',
            'transaction_date' => 'nao-e-data',
        ])->assertSessionHasErrors(['type', 'amount', 'transaction_date']);
    }

    public function test_user_cannot_update_another_users_transaction(): void
    {
        $foreignTransaction = Transaction::factory()->create(['amount' => 100, 'type' => 'expense']);

        $user = User::factory()->create();

        $this->actingAs($user)
            ->put("/transactions/{$foreignTransaction->id}", [
                'category_id' => Category::factory()->create(['user_id' => $user->id])->id,
                'type' => 'income',
                'amount' => '999',
                'transaction_date' => '2026-10-01',
            ])
            ->assertForbidden();

        $this->assertSame('expense', $foreignTransaction->fresh()->type);
        $this->assertEquals(100.0, (float) $foreignTransaction->fresh()->amount);
    }

    public function test_update_rejects_another_users_category(): void
    {
        [$user, $category] = $this->userWithCategory();
        $transaction = Transaction::factory()->create([
            'user_id' => $user->id,
            'category_id' => $category->id,
        ]);

        $foreignCategory = Category::factory()->create(['user_id' => User::factory()->create()->id]);

        $this->actingAs($user)->put("/transactions/{$transaction->id}", [
            'category_id' => $foreignCategory->id,
            'type' => 'expense',
            'amount' => '50',
            'transaction_date' => '2026-10-01',
        ])->assertSessionHasErrors('category_id');

        $this->assertSame($category->id, $transaction->fresh()->category_id);
    }

    public function test_user_can_update_own_transaction(): void
    {
        [$user, $category] = $this->userWithCategory();
        $transaction = Transaction::factory()->create([
            'user_id' => $user->id,
            'category_id' => $category->id,
        ]);

        $this->actingAs($user)->put("/transactions/{$transaction->id}", [
            'category_id' => $category->id,
            'type' => 'income',
            'amount' => '2500',
            'description' => 'Salário',
            'transaction_date' => '2026-10-05',
        ])->assertRedirect(route('transactions.index'));

        $transaction->refresh();
        $this->assertSame('income', $transaction->type);
        $this->assertEquals(2500.0, (float) $transaction->amount);
        $this->assertSame('Salário', $transaction->description);
    }

    public function test_transaction_shows_details_to_its_owner_only(): void
    {
        [$user] = $this->userWithCategory();
        $transaction = Transaction::factory()->forUser($user)->create();

        $this->actingAs($user)
            ->get("/transactions/{$transaction->id}")
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page->component('Transactions/Show'));

        $this->actingAs(User::factory()->create())
            ->get("/transactions/{$transaction->id}")
            ->assertForbidden();
    }

    public function test_soft_deleting_a_transaction_provides_an_undo_link(): void
    {
        [$user] = $this->userWithCategory();
        $transaction = Transaction::factory()->forUser($user)->create();

        $response = $this->actingAs($user)->delete("/transactions/{$transaction->id}");

        $response->assertRedirect(route('transactions.index'));
        $response->assertSessionHas('undo');
        $this->assertSoftDeleted('transactions', ['id' => $transaction->id]);

        $this->actingAs($user)
            ->post("/transactions/{$transaction->id}/restore")
            ->assertRedirect(route('transactions.index'));

        $this->assertDatabaseHas('transactions', ['id' => $transaction->id, 'deleted_at' => null]);
    }

    public function test_user_cannot_delete_or_restore_another_users_transaction(): void
    {
        $foreignTransaction = Transaction::factory()->create();
        $user = User::factory()->create();

        $this->actingAs($user)
            ->delete("/transactions/{$foreignTransaction->id}")
            ->assertForbidden();

        $this->actingAs($user)
            ->post("/transactions/{$foreignTransaction->id}/restore")
            ->assertForbidden();

        $this->assertNull($foreignTransaction->fresh()->deleted_at);
    }

    public function test_export_contains_only_own_transactions(): void
    {
        [$user] = $this->userWithCategory();
        $category = Category::factory()->create(['user_id' => $user->id, 'type' => 'expense']);

        Transaction::factory()->create([
            'user_id' => $user->id,
            'category_id' => $category->id,
            'description' => 'Conta de luz',
            'amount' => 89.9,
        ]);
        Transaction::factory()->create(['description' => 'SEGREDO-DE-OUTRO-USUARIO']);

        $response = $this->actingAs($user)->get('/transactions/export');

        $response->assertOk();
        $response->assertHeader('Content-Type', 'text/csv; charset=UTF-8');

        $content = $response->streamedContent();

        $this->assertStringContainsString('Conta de luz', $content);
        $this->assertStringContainsString('89,90', $content);
        $this->assertStringNotContainsString('SEGREDO-DE-OUTRO-USUARIO', $content);
    }

    public function test_recurring_flag_is_stored(): void
    {
        [$user, $category] = $this->userWithCategory();

        $this->actingAs($user)->post('/transactions', [
            'category_id' => $category->id,
            'type' => 'expense',
            'amount' => '10',
            'transaction_date' => '2026-10-01',
            'is_recurring' => true,
        ])->assertRedirect(route('transactions.index'));

        $this->assertTrue((bool) Transaction::first()->is_recurring);
    }

    public function test_soft_deleted_category_id_still_matches_the_owner(): void
    {
        [$user, $category] = $this->userWithCategory();
        $category->delete();

        $this->actingAs($user)->post('/transactions', [
            'category_id' => $category->id,
            'type' => 'expense',
            'amount' => '10',
            'transaction_date' => '2026-10-01',
        ])->assertSessionHas('success');

        $this->assertSame(1, DB::table('transactions')->count());
    }
}
