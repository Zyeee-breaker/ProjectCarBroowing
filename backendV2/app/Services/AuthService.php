<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserProfile;
use App\Models\UserImage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function register(array $data): User
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'] ?? 'customer',
        ]);

        if (!empty($data['profile'])) {
            $profileData = $data['profile'];
            $profileData['user_id'] = $user->id;
            UserProfile::create($profileData);
        }

        if (!empty($data['images'])) {
            foreach ($data['images'] as $img) {
                UserImage::create([
                    'user_id' => $user->id,
                    'type' => $img['type'],
                    'path' => $img['path'],
                ]);
            }
        }

        return $user->load('profile', 'images');
    }

    public function login(array $credentials): User
    {
        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        return $user;
    }
}
