<?php

namespace App\Services;

use App\Models\UserProfile;

class ProfileService
{
    public function createOrUpdate(int $userId, array $data): UserProfile
    {
        return UserProfile::updateOrCreate(
            ['user_id' => $userId],
            $data
        );
    }

    public function delete(int $profileId): bool
    {
        $profile = UserProfile::findOrFail($profileId);
        return $profile->delete();
    }

    public function getByUser(int $userId): ?UserProfile
    {
        return UserProfile::where('user_id', $userId)->first();
    }
}