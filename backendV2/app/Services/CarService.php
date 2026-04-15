<?php

namespace App\Services;

use App\Models\Car;

class CarService
{
    public function all()
    {
        return Car::with(['units', 'features', 'images', 'categories'])->get();
    }

    public function find($id)
    {
        return Car::with(['units', 'features', 'images', 'categories'])->findOrFail($id);
    }

    public function create(array $data)
    {
        return Car::create($data);
    }

    public function update($id, array $data)
    {
        $car = Car::findOrFail($id);
        $car->update($data);
        return $car;
    }

    public function delete($id)
    {
        $car = Car::findOrFail($id);
        $car->delete();
    }
}