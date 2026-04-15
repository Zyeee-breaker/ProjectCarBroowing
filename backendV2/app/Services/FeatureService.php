<?php

namespace App\Services;

use App\Models\Feature;

class FeatureService
{
    public function all()
    {
        return Feature::all();
    }

    public function find($id)
    {
        return Feature::findOrFail($id);
    }

    public function create(array $data)
    {
        return Feature::create($data);
    }

    public function update($id, array $data)
    {
        $feature = Feature::findOrFail($id);
        $feature->update($data);
        return $feature;
    }

    public function delete($id)
    {
        $feature = Feature::findOrFail($id);
        $feature->delete();
    }
}