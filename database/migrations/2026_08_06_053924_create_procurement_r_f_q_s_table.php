<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('procurement_rfqs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('procurement_id')
                ->unique()
                ->constrained()
                ->cascadeOnDelete();
            $table->string('tin')->nullable();
            $table->string('winner_bidder')->nullable();
            $table->text('address')->nullable();
            $table->string('contact_no')->nullable();
            $table->decimal('contract_amount',15,2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('procurement_r_f_q_s');
    }
};
