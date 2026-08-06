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
        Schema::create('payments', function (Blueprint $table) {

            $table->id();

            $table->foreignId('procurement_id')
                ->unique()
                ->constrained()
                ->cascadeOnDelete();

            $table->string('ors_no')->nullable();

            $table->date('ors_date')->nullable();

            $table->date('date_prepared')->nullable();

            $table->date('date_crediting')->nullable();

            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
