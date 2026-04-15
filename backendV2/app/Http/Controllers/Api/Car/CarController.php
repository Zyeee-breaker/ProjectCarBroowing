<?php

namespace App\Http\Controllers\Api\Car;

use App\Http\Controllers\Controller;
use App\Http\Requests\CarRequest;
use App\Http\Resources\CarResource;
use App\Services\CarService;
use Illuminate\Http\Request;

class CarController extends Controller
{
    protected CarService $service;

    public function __construct(CarService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $cars = $this->service->all();
        return CarResource::collection($cars);
    }

    public function store(CarRequest $request)
    {
        $car = $this->service->create($request->validated());
        return new CarResource($car);
    }

    public function show($id)
    {
        $car = $this->service->find($id);
        return new CarResource($car);
    }

    public function update(CarRequest $request, $id)
    {
        $car = $this->service->update($id, $request->validated());
        return new CarResource($car);
    }

    public function destroy($id)
    {
        $this->service->delete($id);
        return response()->json(['message' => 'Car deleted successfully.']);
    }
}