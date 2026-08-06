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
        Schema::create('procurement_prs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('procurement_id')
                ->unique()
                ->constrained()
                ->cascadeOnDelete();
            $table->date('prepared_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('procurement_p_r_s');
    }
};
