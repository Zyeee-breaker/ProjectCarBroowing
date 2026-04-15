<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AuthRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // bisa diatur middleware auth jika perlu
    }

    public function rules(): array
    {
        if ($this->is('api/v1/users/auth/register')) {
            // rules untuk register
            return [
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:6|confirmed',
                'profile.phone' => 'nullable|string|unique:user_profiles,phone',
                'profile.address' => 'nullable|string|max:255',
                'profile.city' => 'nullable|string|max:255',
                'profile.country' => 'nullable|string|max:255',
                'profile.document_number' => 'nullable|string|unique:user_profiles,document_number',
                'profile.document_type' => 'nullable|in:ktp,sim,dll',
                'images' => 'nullable|array',
                'images.*.type' => 'required_with:images|in:profile,data',
                'images.*.path' => 'required_with:images|string',
            ];
        }

        if ($this->is('api/v1/users/auth/login')) {
            // rules untuk login
            return [
                'email' => 'required|email',
                'password' => 'required|string|min:6',
            ];
        }

        return [];
    }
}
