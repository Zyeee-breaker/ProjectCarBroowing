<?php

namespace App\Http\Controllers\Api\Users;

use App\Http\Controllers\Controller;
use App\Http\Requests\ImageUsersRequest;
use App\Http\Resources\ImageResource;
use App\Services\ImageUsersService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ImageUsersController extends Controller
{
    protected ImageUsersService $service;

    public function __construct(ImageUsersService $service)
    {
        $this->service = $service;
    }

    public function index(): JsonResponse
    {
        $images = $this->service->getByUser(Auth::id());

        return response()->json([
            'images' => ImageResource::collection($images),
        ]);
    }

    public function store(ImageUsersRequest $request)
    {
        $file = $request->file('path');

        // upload via service
        $path = $this->service->uploadFile($file);

        $image = $this->service->create($request->user_id, [
            'path' => $path,
            'type' => $request->type,
        ]);

        return response()->json([
            'image' => new ImageResource($image),
        ], 201);
    }
    public function update(ImageUsersRequest $request, int $id): JsonResponse
    {
        $image = $this->service->update($id, $request->validated());

        return response()->json([
            'image' => new ImageResource($image),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $deleted = $this->service->delete($id);

        return response()->json([
            'message' => $deleted ? 'Image berhasil dihapus.' : 'Image tidak ditemukan.'
        ]);
    }
}
