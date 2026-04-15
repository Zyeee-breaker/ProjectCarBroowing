<?php

namespace App\Services;

use App\Models\MainCategory;

class MainCategoryService
{
    public function all()
    {
        return MainCategory::with('children')->get();
    }

    public function create(array $data): MainCategory
    {
        return MainCategory::create($data);
    }

    public function update(MainCategory $category, array $data): MainCategory
    {
        $category->update($data);
        return $category;
    }

    public function delete(MainCategory $category): bool
    {
        return $category->delete();
    }

    public function find(int $id): MainCategory
    {
        return MainCategory::with('children')->findOrFail($id);
    }
}
