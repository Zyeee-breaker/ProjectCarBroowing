<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        /**
         * BOOKINGS TABLE
         */
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();

            // kode booking (untuk invoice & tracking)
            $table->string('booking_code')->unique();

            // relasi user
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('created_by_user_id')->nullable()->constrained('users')->nullOnDelete();

            // mobil
            $table->foreignId('car_id')->nullable()->constrained('car_units')->nullOnDelete();

            // snapshot data mobil (biar aman kalau data berubah)
            $table->string('car_name');
            $table->decimal('car_price_per_day', 10, 2);

            // customer manual (walk-in)
            $table->string('customer_name')->nullable();
            $table->string('customer_phone')->nullable();
            $table->text('customer_address')->nullable();

            // waktu booking
            $table->timestamp('start_time');
            $table->timestamp('end_time')->nullable();

            // durasi
            $table->unsignedInteger('total_days');

            // harga
            $table->decimal('price_per_day', 10, 2);
            $table->decimal('total_price', 15, 2);

            // denda (disimpan di booking juga biar aman)
            $table->decimal('late_fee', 15, 2)->default(0);
            $table->string('description_late')->nullable();

            // status (pakai string biar fleksibel)
            $table->string('status')->default('pending');

            $table->timestamp('returned_at')->nullable();
            $table->string('qr_code')->unique();

            $table->timestamps();
            $table->softDeletes();

            // index untuk performa
            $table->index(['user_id']);
            $table->index(['car_id']);
            $table->index(['status']);
        });


        /**
         * BOOKING LOGS TABLE
         */
        Schema::create('booking_logs', function (Blueprint $table) {
            $table->id();

            $table->foreignId('booking_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            // type activity
            $table->string('type'); // borrow, return, cancel, update, etc

            // tracking perubahan status
            $table->string('status_before')->nullable();
            $table->string('status_after')->nullable();

            $table->text('description')->nullable();

            $table->timestamps();
        });


        /**
         * PAYMENTS TABLE
         */
        Schema::create('payments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('booking_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->string('reference_number')->nullable();

            // total tagihan
            $table->decimal('amount', 15, 2);

            // tracking pembayaran
            $table->decimal('paid_amount', 15, 2)->default(0);
            $table->decimal('remaining_amount', 15, 2)->default(0);

            // denda
            $table->decimal('late_fee', 15, 2)->default(0);

            // harga harian snapshot
            $table->decimal('daily_rate', 15, 2)->default(0);

            // status & metode
            $table->string('status')->default('pending'); // pending, paid, partial
            $table->string('method')->nullable();
            $table->string('provider')->nullable(); // midtrans, xendit, dll

            // waktu bayar
            $table->timestamp('paid_at')->nullable();

            $table->timestamps();

            $table->index(['booking_id']);
            $table->index(['status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
        Schema::dropIfExists('booking_logs');
        Schema::dropIfExists('bookings');
    }
};
