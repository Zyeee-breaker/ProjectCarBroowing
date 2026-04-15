<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\CarUnit;

class Booking extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'booking_code',
        'user_id',
        'created_by_user_id',
        'car_id',
        'car_name',
        'car_price_per_day',
        'customer_name',
        'customer_phone',
        'customer_address',
        'start_time',
        'end_time',
        'returned_at',
        'total_days',
        'price_per_day',
        'total_price',
        'late_fee',
        'description_late',
        'status',
        'qr_code',
    ];

    // STATUS CONST
    const STATUS_PENDING = 'pending';
    const STATUS_CONFIRMED = 'confirmed';
    const STATUS_ONGOING = 'ongoing';
    const STATUS_RETURNED = 'returned';
    const STATUS_COMPLETE = 'complete';
    const STATUS_CANCELLED = 'cancelled';

    // RELATION
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    public function carUnit()
    {
        return $this->belongsTo(CarUnit::class, 'car_unit_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function logs()
    {
        return $this->hasMany(BookingLog::class);
    }
}
