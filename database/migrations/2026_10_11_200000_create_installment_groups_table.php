<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('installment_groups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['income', 'expense']);
            $table->decimal('total_amount', 10, 2);
            $table->integer('installments');
            $table->decimal('installment_amount', 10, 2);
            $table->date('first_date');
            $table->string('description')->nullable();
            $table->timestamps();
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->foreignId('installment_group_id')->nullable()->after('category_id')->constrained()->nullOnDelete();
            $table->integer('installment_no')->nullable()->after('installment_group_id');
            $table->integer('installment_total')->nullable()->after('installment_no');
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropConstrainedForeignId('installment_group_id');
            $table->dropColumn(['installment_no', 'installment_total']);
        });

        Schema::dropIfExists('installment_groups');
    }
};
