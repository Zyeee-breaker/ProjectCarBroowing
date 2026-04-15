<?php

namespace App\Services;

use App\Models\CarUnit;

class CarUnitService
{
    public function all()
    {
        return CarUnit::all();
    }

    public function find($id, $request)
    {
        $unit = CarUnit::find($request->car_unit_id);

        if (!$unit) {
            return response()->json([
                'message' => 'Car unit not found'
            ], 404);
        }
    }

    public function create(array $data)
    {
        return CarUnit::create($data);
    }

    public function update($id, array $data)
    {
        $unit = CarUnit::findOrFail($id);
        $unit->update($data);
        return $unit;
    }

    public function delete($id)
    {
        $unit = CarUnit::findOrFail($id);
        $unit->delete();
    }
}
