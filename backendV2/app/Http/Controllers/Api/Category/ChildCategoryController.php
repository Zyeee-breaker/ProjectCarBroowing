<?php

namespace App\Http\Controllers\Api\Category;

use App\Http\Controllers\Controller;
use App\Http\Requests\ChildCategoryRequest;
use App\Http\Resources\ChildCategoryResource;
use App\Models\ChildCategory;
use App\Services\ChildCategoryService;
use Illuminate\Http\JsonResponse;

class ChildCategoryController extends Controller
{
    protected ChildCategoryService $service;

    public function __construct(ChildCategoryService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        return ChildCategoryResource::collection($this->service->all());
    }

    public function store(ChildCategoryRequest $request): JsonResponse
    {
        $category = $this->service->create($request->validated());
        return response()->json(new ChildCategoryResource($category), 201);
    }

    public function show(int $id)
    {
        return new ChildCategoryResource($this->service->find($id));
    }

    public function update(ChildCategoryRequest $request, int $id)
    {
        $category = $this->service->update($this->service->find($id), $request->validated());
        return new ChildCategoryResource($category);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->delete($this->service->find($id));
        return response()->json(['message' => 'Child category deleted successfully.']);
    }
}