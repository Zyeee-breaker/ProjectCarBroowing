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
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->string('phone');
            $table->string('address'); // nullable() jika opsional
            $table->string('city');    // nullable() jika opsional
            $table->string('country'); // nullable() jika opsional
            $table->string('document_number')->unique()->nullable();
            $table->enum('document_type', ['ktp', 'sim', 'dll'])->default('ktp');
            $table->boolean('is_verified')->default(false);
            $table->timestamp('verified_at')->nullable();
            $table->enum('status', ['complete', 'notcomplete'])->default('notcomplete');
            $table->string('document_file')->nullable();
            $table->timestamps();

            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_profiles');
    }
};
