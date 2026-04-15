<?php

namespace App\Http\Controllers\Api\Car;

use App\Http\Controllers\Controller;
use App\Http\Requests\CarCategoryRequest;
use App\Http\Resources\CarCategoryResource;
use App\Services\CarCategoryService;

class CarCategoryController extends Controller
{
    protected CarCategoryService $service;

    public function __construct(CarCategoryService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        return CarCategoryResource::collection($this->service->all());
    }

    public function store(CarCategoryRequest $request)
    {
        return new CarCategoryResource($this->service->create($request->validated()));
    }

    public function show($id)
    {
        return new CarCategoryResource($this->service->find($id));
    }

    public function update(CarCategoryRequest $request, $id)
    {
        return new CarCategoryResource($this->service->update($id, $request->validated()));
    }

    public function destroy($id)
    {
        $this->service->delete($id);
        return response()->json(['message' => 'Car category deleted successfully.']);
    }
}