<?php

namespace App\Http\Controllers\Api\Booking;

use App\Services\BookingService;
use App\Models\Booking;
use App\Models\BookingLog;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class BookingController extends Controller
{
    protected $bookingService;

    public function __construct(BookingService $bookingService)
    {
        $this->bookingService = $bookingService;
    }

    public function index()
    {
        return Booking::with([
            'carUnit.car.category',
            'logs'
        ])
            ->latest()
            ->paginate(10);
    }

    public function store(Request $request)
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        }

        $booking = $this->bookingService->create($request, $user);

        return response()->json([
            'data' => $booking
        ]);
    }

    public function show($id)
    {
        return Booking::with('logs')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);

        return $this->bookingService->update(
            $booking,
            $request,
            auth()->user()
        );
    }

    public function destroy($id)
    {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $booking = Booking::findOrFail($id);

        return $this->bookingService->delete(
            $booking,
            auth()->user()
        );
    }

    public function myBooking()
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        }

        $bookings = Booking::with('logs')
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        return response()->json([
            'data' => $bookings
        ]);
    }

    public function staffReport()
    {
        $bookings = Booking::with(['logs', 'user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'data' => $bookings
        ]);
    }

    public function exportPdf()
    {
        $bookings = Booking::with('user', 'logs')->get();

        $pdf = Pdf::loadView('pdf.booking-report', [
            'bookings' => $bookings
        ]);

        $filename = 'reports/booking-report-' . now()->format('Y-m-d-H-i-s') . '.pdf';

        Storage::disk('public')->put($filename, $pdf->output());

        return response()->json([
            'message' => 'PDF berhasil disimpan',
            'file' => $filename,
            'url' => asset('storage/' . $filename)
        ]);
    }
}
