<?php

namespace App\Http\Controllers\Api\Booking;

use App\Http\Controllers\Controller;
use App\Models\BookingLog;

class BookingLogController extends Controller
{
    public function index()
    {
        if (!in_array(auth()->user()->role, ['admin', 'staff'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return BookingLog::with('booking')->latest()->get();
    }

    public function print()
    {
        $logs = BookingLog::with('booking')->get();

        return response()->json([
            'data' => $logs,
            'total' => $logs->count()
        ]);
    }
}
