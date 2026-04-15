<?php

namespace App\Services;

use App\Models\CarCategory;

class CarCategoryService
{
    public function all()
    {
        return CarCategory::with('category')->get();
    }

    public function find($id)
    {
        return CarCategory::with('category')->findOrFail($id);
    }

    public function create(array $data)
    {
        return CarCategory::create($data);
    }

    public function update($id, array $data)
    {
        $category = CarCategory::findOrFail($id);
        $category->update($data);
        return $category;
    }

    public function delete($id)
    {
        $category = CarCategory::findOrFail($id);
        $category->delete();
    }
}