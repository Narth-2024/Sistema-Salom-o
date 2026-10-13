<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\InvestmentSimulation>
 */
class InvestmentSimulationFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'instrument_key' => 'cdb_di',
            'instrument_name' => 'CDB Diário',
            'amount' => 1000,
            'monthly_contribution' => 0,
            'months' => 12,
            'ipca_estimate' => null,
            'final_gross' => 1100,
            'final_net' => 1080,
            'profit_net' => 80,
            'return_pct' => 8,
        ];
    }
}
