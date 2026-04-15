<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CarCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'car_id' => 'nullable|exists:cars,id',
            'cat_id' => 'nullable|exists:child_categories,id',
        ];
    }
}