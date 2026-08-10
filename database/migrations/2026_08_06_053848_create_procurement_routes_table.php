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
        Schema::create('procurement_routes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('procurement_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignId('from_department_id')
                ->nullable()
                ->constrained('departments')
                ->nullOnDelete();
            $table->foreignId('to_department_id')
                ->constrained('departments');
            $table->foreignId('forwarded_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->foreignId('received_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->string('stage');
            $table->enum('action',[
                'Forwarded',
                'Received',
                'Approved',
                'Returned',
                'Rejected',
                'Completed',
                'Retrieved'
            ]);
            $table->text('remarks')->nullable();
            $table->timestamp('forwarded_at')->nullable();
            $table->timestamp('received_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('procurement_routes');
    }
};
