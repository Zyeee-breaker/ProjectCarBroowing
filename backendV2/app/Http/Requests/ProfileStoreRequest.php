<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProfileStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // middleware auth di controller
    }

    public function rules(): array
    {
        $profileId = $this->route('profile')?->id ?? null;

        return [
            'phone' => 'nullable|string|unique:user_profiles,phone,' . $profileId,
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'document_number' => 'nullable|string|unique:user_profiles,document_number,' . $profileId,
            'document_type' => 'nullable|in:ktp,sim,dll',
            'is_verified' => 'nullable|boolean',
            'status' => 'nullable|in:complete,incomplete',
            'document_file' => 'nullable|string',
        ];
    }
}
