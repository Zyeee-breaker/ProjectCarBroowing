<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FeatureRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'car_id' => 'nullable|exists:cars,id',
            'feature' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
        ];
    }
}