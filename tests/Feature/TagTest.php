<?php

namespace Tests\Feature;

use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class TagTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login(): void
    {
        $this->get('/tags')->assertRedirect('/login');
    }

    public function test_user_can_create_a_tag(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post('/tags', [
            'name' => 'Urgente',
            'color' => '#f97316',
        ])->assertRedirect(route('tags.index'))
            ->assertSessionHas('success');

        $this->assertDatabaseHas('tags', [
            'user_id' => $user->id,
            'name' => 'Urgente',
        ]);
    }

    public function test_index_lists_only_own_tags(): void
    {
        $user = User::factory()->create();
        Tag::factory()->count(2)->create(['user_id' => $user->id]);
        Tag::factory()->create(); // de outro usuário

        $this->actingAs($user)
            ->get('/tags')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Tags/Index')
                ->has('tags.data', 2));
    }

    public function test_duplicate_tag_name_is_rejected_for_the_same_user(): void
    {
        $user = User::factory()->create();
        Tag::factory()->create(['user_id' => $user->id, 'name' => 'Viagem']);

        $this->actingAs($user)->post('/tags', [
            'name' => 'Viagem',
            'color' => '#22c55e',
        ])->assertSessionHasErrors('name');
    }

    public function test_same_tag_name_is_allowed_for_a_different_user(): void
    {
        $user = User::factory()->create();
        Tag::factory()->create(['name' => 'Viagem']); // outro usuário

        $this->actingAs($user)->post('/tags', [
            'name' => 'Viagem',
            'color' => '#22c55e',
        ])->assertRedirect(route('tags.index'));

        $this->assertSame(2, Tag::count());
    }

    public function test_store_validates_color_format(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post('/tags', [
            'name' => 'Cor',
            'color' => 'azul',
        ])->assertSessionHasErrors('color');
    }

    public function test_user_can_update_own_tag(): void
    {
        $user = User::factory()->create();
        $tag = Tag::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user)->put("/tags/{$tag->id}", [
            'name' => 'Prioridade',
            'color' => '#111827',
        ])->assertRedirect(route('tags.index'));

        $this->assertSame('Prioridade', $tag->fresh()->name);
    }

    public function test_updating_a_tag_to_a_name_already_used_is_rejected(): void
    {
        $user = User::factory()->create();
        $tag = Tag::factory()->create(['user_id' => $user->id, 'name' => 'Original']);
        Tag::factory()->create(['user_id' => $user->id, 'name' => 'Duplicada']);

        $this->actingAs($user)->put("/tags/{$tag->id}", [
            'name' => 'Duplicada',
            'color' => '#111827',
        ])->assertSessionHasErrors('name');

        $this->assertSame('Original', $tag->fresh()->name);
    }

    public function test_user_cannot_update_or_delete_another_users_tag(): void
    {
        $foreign = Tag::factory()->create();
        $user = User::factory()->create();

        $this->actingAs($user)->put("/tags/{$foreign->id}", [
            'name' => 'Hackeado',
            'color' => '#000000',
        ])->assertForbidden();

        $this->actingAs($user)->delete("/tags/{$foreign->id}")->assertForbidden();

        $this->assertSame($foreign->name, $foreign->fresh()->name);
        $this->assertNull($foreign->fresh()->deleted_at);
    }

    public function test_soft_deleting_and_restoring_a_tag(): void
    {
        $user = User::factory()->create();
        $tag = Tag::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->delete("/tags/{$tag->id}");

        $response->assertRedirect(route('tags.index'));
        $response->assertSessionHas('undo');
        $this->assertSoftDeleted('tags', ['id' => $tag->id]);

        $this->actingAs($user)
            ->post("/tags/{$tag->id}/restore")
            ->assertRedirect(route('tags.index'));

        $this->assertNull($tag->fresh()->deleted_at);
    }
}
