<?php

namespace App\Services;

use App\Models\UserImage;

namespace App\Services;

use App\Models\UserImage;
use Illuminate\Support\Facades\Storage;

class ImageUsersService
{
    public function create(int $userId, array $data): UserImage
    {
        $data['user_id'] = $userId;
        return UserImage::create($data);
    }

    public function uploadFile($file): string
    {
        $path = $file->store('images/users', 'public');
        return $path; // images/users/xxx.jpg
    }

    public function update(int $imageId, array $data): UserImage
    {
        $image = UserImage::findOrFail($imageId);
        $image->update($data);
        return $image;
    }

    public function delete(int $imageId): bool
    {
        $image = UserImage::findOrFail($imageId);

        // optional delete file
        Storage::disk('public')->delete($image->path);

        return $image->delete();
    }

    public function getByUser(int $userId)
    {
        return UserImage::where('user_id', $userId)->get();
    }
}
