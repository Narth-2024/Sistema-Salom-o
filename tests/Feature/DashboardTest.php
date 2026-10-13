<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    private function userWithCategories(): User
    {
        $user = User::factory()->create();

        Category::factory()->create(['user_id' => $user->id, 'type' => 'income', 'name' => 'Salário']);
        Category::factory()->create(['user_id' => $user->id, 'type' => 'expense', 'name' => 'Moradia']);

        return $user;
    }

    public function test_guest_is_redirected_to_login(): void
    {
        $this->get('/dashboard')->assertRedirect('/login');
    }

    public function test_dashboard_shows_totals(): void
    {
        $user = $this->userWithCategories();
        [$income, $expense] = $user->categories()->pluck('id', 'type')->values()->all();

        Transaction::factory()->create([
            'user_id' => $user->id,
            'category_id' => $income,
            'type' => 'income',
            'amount' => 5000,
        ]);
        Transaction::factory()->create([
            'user_id' => $user->id,
            'category_id' => $expense,
            'type' => 'expense',
            'amount' => 1200,
        ]);

        $this->actingAs($user)
            ->get('/dashboard')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Dashboard')
                ->where('income', fn ($v) => (float) $v === 5000.0)
                ->where('expense', fn ($v) => (float) $v === 1200.0)
                ->where('balance', fn ($v) => (float) $v === 3800.0)
                ->has('recentTransactions', 2));
    }

    public function test_dashboard_ignores_other_users_transactions(): void
    {
        $user = $this->userWithCategories();
        [$income] = $user->categories()->pluck('id')->values()->all();

        Transaction::factory()->create([
            'user_id' => $user->id,
            'category_id' => $income,
            'type' => 'income',
            'amount' => 100,
        ]);

        // Outro usuário com receita bem maior
        $other = User::factory()->create();
        $otherIncome = Category::factory()->create(['user_id' => $other->id, 'type' => 'income']);
        Transaction::factory()->create([
            'user_id' => $other->id,
            'category_id' => $otherIncome->id,
            'type' => 'income',
            'amount' => 99999,
        ]);

        $this->actingAs($user)
            ->get('/dashboard')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('income', fn ($v) => (float) $v === 100.0)
                ->has('recentTransactions', 1));
    }

    public function test_month_period_filters_out_older_transactions(): void
    {
        $user = $this->userWithCategories();
        [$income] = $user->categories()->pluck('id')->values()->all();

        Transaction::factory()->create([
            'user_id' => $user->id,
            'category_id' => $income,
            'type' => 'income',
            'amount' => 100,
            'transaction_date' => now()->subMonths(3)->toDateString(),
        ]);

        Transaction::factory()->create([
            'user_id' => $user->id,
            'category_id' => $income,
            'type' => 'income',
            'amount' => 250,
            'transaction_date' => now()->startOfMonth()->addDay()->toDateString(),
        ]);

        $this->actingAs($user)
            ->get('/dashboard?period=month')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('income', fn ($v) => (float) $v === 250.0)
                ->where('period', 'month'));

        $this->actingAs($user)
            ->get('/dashboard?period=all')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('income', fn ($v) => (float) $v === 350.0));
    }

    public function test_dashboard_groups_expenses_by_category(): void
    {
        $user = $this->userWithCategories();
        $expenseCategory = $user->categories()->where('type', 'expense')->first();

        Transaction::factory()->count(2)->create([
            'user_id' => $user->id,
            'category_id' => $expenseCategory->id,
            'type' => 'expense',
            'amount' => 300,
        ]);

        $this->actingAs($user)
            ->get('/dashboard')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->has('expensesByCategory', 1)
                ->where('expensesByCategory.0.name', 'Moradia')
                ->where('expensesByCategory.0.total', fn ($v) => (float) $v === 600.0));
    }
}
