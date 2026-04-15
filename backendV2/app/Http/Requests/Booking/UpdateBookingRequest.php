<?php

namespace App\Http\Requests\Booking;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBookingRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'car_id' => 'required|exists:car_units,id',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
        ];
    }
}