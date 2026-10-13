<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class AnalyticsTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login(): void
    {
        $this->get('/analytics')->assertRedirect('/login');
    }

    public function test_analytics_page_renders_with_transaction_data(): void
    {
        // O controlador usa TO_CHAR (Postgres) e precisa cair em strftime no sqlite.
        $user = User::factory()->create();
        $income = Category::factory()->create(['user_id' => $user->id, 'type' => 'income']);
        $expense = Category::factory()->create(['user_id' => $user->id, 'type' => 'expense']);

        Transaction::factory()->create([
            'user_id' => $user->id,
            'category_id' => $income->id,
            'type' => 'income',
            'amount' => 4000,
            'transaction_date' => now()->subMonth()->startOfMonth()->addDays(5)->toDateString(),
        ]);

        Transaction::factory()->create([
            'user_id' => $user->id,
            'category_id' => $expense->id,
            'type' => 'expense',
            'amount' => 1500,
            'transaction_date' => now()->subMonth()->startOfMonth()->addDays(10)->toDateString(),
        ]);

        $this->actingAs($user)
            ->get('/analytics')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Analytics')
                ->where('hasData', true)
                ->where('incomeTotal', fn ($v) => (float) $v === 4000.0)
                ->where('expenseTotal', fn ($v) => (float) $v === 1500.0)
                ->has('barChart')
                ->has('categoryChart'));
    }

    public function test_visiting_analytics_marks_it_as_seen(): void
    {
        $user = User::factory()->create(['viewed_analytics_at' => null]);

        $this->assertNull($user->fresh()->viewed_analytics_at);

        $this->actingAs($user)->get('/analytics')->assertOk();

        $this->assertNotNull($user->fresh()->viewed_analytics_at);
    }

    public function test_analytics_ignores_other_users_transactions(): void
    {
        $user = User::factory()->create();
        $income = Category::factory()->create(['user_id' => $user->id, 'type' => 'income']);

        Transaction::factory()->create([
            'user_id' => $user->id,
            'category_id' => $income->id,
            'type' => 'income',
            'amount' => 100,
            'transaction_date' => now()->toDateString(),
        ]);

        $other = User::factory()->create();
        $otherIncome = Category::factory()->create(['user_id' => $other->id, 'type' => 'income']);
        Transaction::factory()->create([
            'user_id' => $other->id,
            'category_id' => $otherIncome->id,
            'type' => 'income',
            'amount' => 50000,
            'transaction_date' => now()->toDateString(),
        ]);

        $this->actingAs($user)
            ->get('/analytics')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('incomeTotal', fn ($v) => (float) $v === 100.0));
    }

    public function test_unknown_period_falls_back_to_the_default(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/analytics?period=periodo_invalido')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page->where('period', '12_months'));
    }

    public function test_analytics_reports_empty_state_for_a_new_user(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/analytics')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('hasData', false)
                ->where('incomeTotal', fn ($v) => (float) $v === 0.0)
                ->where('economyRate', null));
    }
}
