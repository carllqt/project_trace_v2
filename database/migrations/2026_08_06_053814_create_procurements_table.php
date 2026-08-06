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
        Schema::create('procurements', function (Blueprint $table) {
            $table->id();
            $table->string('pr_no')->unique();
            $table->string('project_title');
            $table->text('purpose')->nullable();
            $table->string('end_user')->nullable();
            $table->decimal('abc',15,2)->nullable();
            $table->string('mode_of_procurement')->nullable();
            $table->enum('status',[
                'Preparation of PR',
                'Preparation of RFQ',
                'Preparation of PO',
                'Delivery',
                'Implementation',
                'Payment',
                'Completed'
            ])->default('Preparation of PR');
            $table->foreignId('current_department_id')
                ->nullable()
                ->constrained('departments')
                ->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('procurements');
    }
};
