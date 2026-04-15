<?php

namespace App\Http\Controllers\Api\Booking;

use App\Models\Booking;
use App\Models\BookingLog;
use App\Models\Payment;
use App\Http\Controllers\Controller;

class PaymentController extends Controller
{
    public function pay($bookingId)
    {
        $booking = Booking::findOrFail($bookingId);

        // 🔥 FIX AUTH
        $user = auth('sanctum')->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        }

        $payment = Payment::create([
            'booking_id' => $booking->id,
            'user_id' => $user->id,
            'amount' => $booking->total_price,
            'paid_amount' => $booking->total_price,
            'remaining_amount' => 0,
            'status' => 'paid',
            'paid_at' => now()
        ]);

        $booking->update([
            'status' => 'paid'
        ]);

        BookingLog::create([
            'booking_id' => $booking->id,
            'user_id' => $user->id, // 🔥 FIX INI JUGA
            'type' => 'payment',
            'status_after' => 'paid'
        ]);

        return response()->json($payment);
    }
}
