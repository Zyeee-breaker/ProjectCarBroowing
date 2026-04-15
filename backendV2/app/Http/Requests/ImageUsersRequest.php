<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ImageUsersRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // middleware auth di controller
    }

    public function rules(): array
    {
        return [
            'user_id' => 'required|exists:users,id',
            'type' => 'required|in:profile,data',
            'path' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ];
    }
}
