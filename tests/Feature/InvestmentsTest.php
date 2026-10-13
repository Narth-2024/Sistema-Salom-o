<?php

namespace Tests\Feature;

use App\Models\InvestmentSimulation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class InvestmentsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Evita chamadas reais à API do Banco Central durante os testes.
        Http::fake([
            'api.bcb.gov.br/*' => Http::response([
                ['valor' => '0.0425'],
            ]),
        ]);
    }

    public function test_guest_is_redirected_to_login(): void
    {
        $this->get('/investments')->assertRedirect('/login');
    }

    public function test_index_renders_with_instruments_and_own_history(): void
    {
        $user = User::factory()->create();
        InvestmentSimulation::factory()->for($user)->create();
        InvestmentSimulation::factory()->create(); // de outro usuário

        $this->actingAs($user)
            ->get('/investments')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Investments')
                ->has('instruments')
                ->has('history', 1)
                ->where('inputs.amount', fn ($v) => (float) $v === 1000.0));
    }

    public function test_user_can_save_a_simulation(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post('/investments', [
            'instrumentKey' => 'cdb',
            'amount' => 5000,
            'months' => 24,
            'monthly' => 200,
            'ipca' => 4,
        ])->assertSessionHas('success');

        $this->assertDatabaseHas('investment_simulations', [
            'user_id' => $user->id,
            'instrument_key' => 'cdb',
            'months' => 24,
        ]);
    }

    public function test_store_rejects_unknown_instrument(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post('/investments', [
            'instrumentKey' => 'bitcoin',
            'amount' => 1000,
            'months' => 12,
        ])->assertSessionHasErrors('instrumentKey');

        $this->assertSame(0, InvestmentSimulation::count());
    }

    public function test_store_rejects_period_below_instrument_minimum(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post('/investments', [
            'instrumentKey' => 'lci', // min_months = 3
            'amount' => 1000,
            'months' => 1,
        ])->assertSessionHasErrors('months');

        $this->assertSame(0, InvestmentSimulation::count());
    }

    public function test_store_validates_amount_and_months(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post('/investments', [
            'instrumentKey' => 'cdb',
            'amount' => 0,
            'months' => 0,
        ])->assertSessionHasErrors(['amount', 'months']);
    }

    public function test_user_can_delete_own_simulation(): void
    {
        $user = User::factory()->create();
        $simulation = InvestmentSimulation::factory()->for($user)->create();

        $this->actingAs($user)
            ->delete("/investments/simulations/{$simulation->id}")
            ->assertSessionHas('success');

        $this->assertDatabaseMissing('investment_simulations', ['id' => $simulation->id]);
    }

    public function test_user_cannot_delete_another_users_simulation(): void
    {
        $simulation = InvestmentSimulation::factory()->create();
        $user = User::factory()->create();

        $this->actingAs($user)
            ->delete("/investments/simulations/{$simulation->id}")
            ->assertForbidden();

        $this->assertDatabaseHas('investment_simulations', ['id' => $simulation->id]);
    }
}
