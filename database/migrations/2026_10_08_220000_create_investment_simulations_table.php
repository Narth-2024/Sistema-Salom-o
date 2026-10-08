<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('investment_simulations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('instrument_key', 40);
            $table->string('instrument_name', 80);
            $table->decimal('amount', 12, 2);
            $table->decimal('monthly_contribution', 12, 2)->default(0);
            $table->unsignedSmallInteger('months');
            $table->decimal('ipca_estimate', 5, 2)->nullable();
            $table->decimal('final_gross', 14, 2);
            $table->decimal('final_net', 14, 2);
            $table->decimal('profit_net', 14, 2);
            $table->decimal('return_pct', 8, 2);
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('investment_simulations');
    }
};
