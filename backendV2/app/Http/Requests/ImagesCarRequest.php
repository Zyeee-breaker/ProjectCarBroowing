<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ImagesCarRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'car_id' => 'required|exists:cars,id',
            'path' => 'required|file|image|mimes:jpg,jpeg,png|max:2048',
            'type' => 'required|in:main,detail',
        ];
    }
}
