<?php

namespace App\Http\Controllers\Api\Car;

use App\Http\Controllers\Controller;
use App\Http\Requests\CarUnitRequest;
use App\Http\Resources\CarUnitResource;
use App\Services\CarUnitService;

class CarUnitController extends Controller
{
    protected CarUnitService $service;

    public function __construct(CarUnitService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        return CarUnitResource::collection($this->service->all());
    }

    public function store(CarUnitRequest $request)
    {
        return new CarUnitResource($this->service->create($request->validated()));
    }

    public function show($id)
    {
        return new CarUnitResource($this->service->find($id));
    }

    public function update(CarUnitRequest $request, $id)
    {
        return new CarUnitResource($this->service->update($id, $request->validated()));
    }

    public function destroy($id)
    {
        $this->service->delete($id);
        return response()->json(['message' => 'Car unit deleted successfully.']);
    }
}