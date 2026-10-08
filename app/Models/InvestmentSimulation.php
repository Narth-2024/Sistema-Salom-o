<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InvestmentSimulation extends Model
{
    protected $fillable = [
        'user_id',
        'instrument_key',
        'instrument_name',
        'amount',
        'monthly_contribution',
        'months',
        'ipca_estimate',
        'final_gross',
        'final_net',
        'profit_net',
        'return_pct',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'monthly_contribution' => 'decimal:2',
        'months' => 'integer',
        'ipca_estimate' => 'decimal:2',
        'final_gross' => 'decimal:2',
        'final_net' => 'decimal:2',
        'profit_net' => 'decimal:2',
        'return_pct' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
