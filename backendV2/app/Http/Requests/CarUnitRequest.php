<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CarUnitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'car_id' => 'required|exists:cars,id',
            'plate_number' => 'required|string|unique:car_units,plate_number,' . $this->route('car_unit'),
            'status' => 'required|in:available,maintenance',
        ];
    }
}