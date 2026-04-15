<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\Booking;
use Carbon\Carbon;

class PaymentService
{
    public function pay(Booking $booking, array $data, $user): Payment
    {
        $remaining = $booking->total_price;

        $payment = Payment::create([
            'booking_id' => $booking->id,
            'user_id' => $user->id,
            'amount' => $booking->total_price,
            'paid_amount' => $data['amount'],
            'remaining_amount' => $remaining - $data['amount'],
            'status' => $data['amount'] >= $booking->total_price
                ? Payment::STATUS_PAID
                : Payment::STATUS_PARTIAL,
            'method' => $data['method'] ?? null,
            'provider' => $data['provider'] ?? null,
            'paid_at' => Carbon::now(),
        ]);

        return $payment;
    }
}