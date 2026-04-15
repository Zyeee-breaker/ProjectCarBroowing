<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingLog extends Model
{
    protected $fillable = [
        'booking_id',
        'user_id',
        'type',
        'status_before',
        'status_after',
        'description',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}