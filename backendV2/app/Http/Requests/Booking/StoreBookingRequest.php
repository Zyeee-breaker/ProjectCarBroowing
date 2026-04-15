<?php

namespace App\Http\Requests\Booking;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    public function rules()
    {
        return [
            'car_id' => 'required|exists:car_units,id',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'customer_name' => 'nullable|string',
            'customer_phone' => 'nullable|string',
            'customer_address' => 'nullable|string',
        ];
    }
}