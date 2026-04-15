<?php

namespace App\Http\Controllers\Api\Category;

use App\Http\Controllers\Controller;
use App\Http\Requests\MainCategoryRequest;
use App\Http\Resources\MainCategoryResource;
use App\Models\MainCategory;
use App\Services\MainCategoryService;
use Illuminate\Http\JsonResponse;

class MainCategoryController extends Controller
{
    protected MainCategoryService $service;

    public function __construct(MainCategoryService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        try {
            return MainCategoryResource::collection(
                $this->service->all()
            );
        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
            ], 500);
        }
    }

    public function store(MainCategoryRequest $request): JsonResponse
    {
        $category = $this->service->create($request->validated());
        return response()->json(new MainCategoryResource($category), 201);
    }

    public function show(int $id)
    {
        return new MainCategoryResource($this->service->find($id));
    }

    public function update(MainCategoryRequest $request, int $id)
    {
        $category = $this->service->update($this->service->find($id), $request->validated());
        return new MainCategoryResource($category);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->delete($this->service->find($id));
        return response()->json(['message' => 'Main category deleted successfully.']);
    }
}
