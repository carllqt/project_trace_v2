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
        Schema::create('capas', function (Blueprint $table) {

            $table->id();
            $table->date('date')->nullable();
            $table->text('activity')->nullable();
            $table->text('participants')->nullable();
            $table->string('lead_division')->nullable();
            $table->string('venue')->nullable();
            $table->text('remarks')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('capas');
    }
};
