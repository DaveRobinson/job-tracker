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
        Schema::create('positions', function (Blueprint $table) {
            $table->id();
            $table->string('company')->nullable();
            $table->string('recruiter_company')->nullable();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('status')->default('saved');
            $table->string('location')->nullable();
            $table->string('salary')->nullable();
            $table->string('url')->nullable();
            $table->text('notes')->nullable();
            $table->date('applied_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('positions');
    }
};
