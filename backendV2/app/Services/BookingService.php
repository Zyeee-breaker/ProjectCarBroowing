<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\BookingLog;
use App\Models\CarUnit;
use App\Helpers\QrHelper;

class BookingService
{
    public function create($request, $user)
    {
        if (!$user) {
            throw new \Exception("User tidak login / token invalid");
        }

        // ✅ FIX UTAMA DI SINI
        $car = CarUnit::findOrFail($request->car_unit_id);

        $carName = $car->name ?? $car->car_name ?? $car->model ?? 'Unknown Car';
        $carPrice = $car->price_per_day
            ?? $car->daily_price
            ?? ($car->car->price_per_day ?? null);
        if (!$carPrice) {
            throw new \Exception("Harga mobil tidak valid di database");
        }

        $start = new \DateTime($request->start_time);
        $end = new \DateTime($request->end_time);

        $totalDays = $start->diff($end)->days;
        $totalDays = max($totalDays, 1);

        $totalPrice = $totalDays * $carPrice;

        $booking = Booking::create([
            'booking_code' => 'BOOK-' . strtoupper(uniqid()),

            'user_id' => $user->id,
            'created_by_user_id' => $user->id,

            // 🔥 PENTING: HARUS car_unit_id (bukan car_id)
            'car_unit_id' => $car->id,

            'car_name' => $carName,
            'car_price_per_day' => $carPrice,

            'customer_name' => $request->customer_name ?? $user->name,
            'customer_phone' => $request->customer_phone,
            'customer_address' => $request->customer_address,

            'start_time' => $request->start_time,
            'end_time' => $request->end_time,

            'total_days' => $totalDays,
            'price_per_day' => $carPrice,
            'total_price' => $totalPrice,

            'qr_code' => QrHelper::generate($user, $car),

            'status' => 'pending',
        ]);

        BookingLog::create([
            'booking_id' => $booking->id,
            'user_id' => $user->id,
            'type' => 'create',
            'status_after' => 'pending',
            'description' => 'Booking dibuat'
        ]);

        return $booking;
    }
    public function update($booking, $request, $user)
    {
        $before = $booking->status;

        $booking->update($request->all());

        BookingLog::create([
            'booking_id' => $booking->id,
            'user_id' => $user->id,
            'type' => 'update',
            'status_before' => $before,
            'status_after' => $booking->status,
            'description' => 'Booking diupdate'
        ]);

        return $booking;
    }

    public function delete($booking, $user)
    {
        $before = $booking->status;

        $booking->delete();

        BookingLog::create([
            'booking_id' => $booking->id,
            'user_id' => $user->id,
            'type' => 'delete',
            'status_before' => $before,
            'description' => 'Booking dihapus'
        ]);
    }
}
