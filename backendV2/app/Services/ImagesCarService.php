<?php

namespace App\Services;

use App\Models\ImagesCar;

class ImagesCarService
{
    public function all()
    {
        return ImagesCar::all();
    }

    public function find($id)
    {
        return ImagesCar::findOrFail($id);
    }

    public function create(array $data)
    {
        return ImagesCar::create($data);
    }

    public function update($id, array $data)
    {
        $image = ImagesCar::findOrFail($id);
        $image->update($data);
        return $image;
    }

    public function delete($id)
    {
        $image = ImagesCar::findOrFail($id);
        $image->delete();
    }
}
