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
        // Cars
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('brand');
            $table->string('model');
            $table->string('year');
            $table->decimal('price_per_day', 10, 2);
            $table->timestamps();
        });

        // Car units
        Schema::create('car_units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('car_id')->constrained('cars')->cascadeOnDelete();
            $table->string('plate_number')->unique();
            $table->enum('status', ['available', 'maintenance', 'outgarage']);
            $table->timestamps();
        });

        // Features
        Schema::create('features', function (Blueprint $table) {
            $table->id();
            $table->foreignId('car_id')->nullable()->constrained('cars')->nullOnDelete();
            $table->string('feature')->nullable();
            $table->string('description')->nullable();
            $table->timestamps();
        });

        // Images car
        Schema::create('images_car', function (Blueprint $table) {
            $table->id();
            $table->foreignId('car_id')->nullable()->constrained('cars')->nullOnDelete();
            $table->string('path')->nullable(); // ganti dari "string"
            $table->enum('type', ['main', 'detail'])->nullable();
            $table->timestamps();
        });

        // Car categories
        Schema::create('car_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('car_id')->nullable()->constrained('cars')->nullOnDelete();
            $table->foreignId('cat_id')->nullable()->constrained('child_categories')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('car_categories');
        Schema::dropIfExists('images_car');
        Schema::dropIfExists('features');
        Schema::dropIfExists('car_units');
        Schema::dropIfExists('cars');
    }
};
