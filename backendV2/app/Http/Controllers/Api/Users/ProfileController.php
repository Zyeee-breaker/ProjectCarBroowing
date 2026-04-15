<?php

namespace App\Http\Controllers\Api\Users;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProfileStoreRequest;
use App\Http\Resources\ProfileResource;
use App\Models\UserProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    /**
     * Tampilkan profile user yang sedang login
     */
    public function index(): JsonResponse
    {
        $profile = UserProfile::where('user_id', Auth::id())->first();

        return response()->json([
            'profile' => $profile ? new ProfileResource($profile) : null,
        ]);
    }

    /**
     * Tampilkan profile user berdasarkan ID
     */
    public function show(int $id): JsonResponse
    {
        $profile = UserProfile::where('user_id', $id)->first();

        if (!$profile) {
            return response()->json(['message' => 'Profile tidak ditemukan'], 404);
        }

        return response()->json(['profile' => new ProfileResource($profile)]);
    }

    /**
     * Buat atau update profile user
     */
    public function store(ProfileStoreRequest $request): JsonResponse
    {
        $data = $request->validated();
        $profile = UserProfile::updateOrCreate(
            ['user_id' => Auth::id()],
            $data
        );

        return response()->json(['profile' => new ProfileResource($profile)], 201);
    }

    /**
     * Update profile user
     */
    public function update(ProfileStoreRequest $request, int $id): JsonResponse
    {
        $profile = UserProfile::where('user_id', $id)->first();

        if (!$profile) {
            return response()->json(['message' => 'Profile tidak ditemukan'], 404);
        }

        $profile->update($request->validated());

        return response()->json(['profile' => new ProfileResource($profile)]);
    }

    /**
     * Hapus profile user
     */
    public function destroy(int $id): JsonResponse
    {
        $profile = UserProfile::where('user_id', $id)->first();

        if (!$profile) {
            return response()->json(['message' => 'Profile tidak ditemukan'], 404);
        }

        $profile->delete();

        return response()->json(['message' => 'Profile berhasil dihapus']);
    }
}
