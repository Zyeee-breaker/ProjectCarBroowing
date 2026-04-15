<?php

namespace App\Services;

use App\Models\ChildCategory;

class ChildCategoryService
{
    public function all()
    {
        return ChildCategory::with('mainCategory')->get();
    }

    public function create(array $data): ChildCategory
    {
        return ChildCategory::create($data);
    }

    public function update(ChildCategory $category, array $data): ChildCategory
    {
        $category->update($data);
        return $category;
    }

    public function delete(ChildCategory $category): bool
    {
        return $category->delete();
    }

    public function find(int $id): ChildCategory
    {
        return ChildCategory::with('mainCategory')->findOrFail($id);
    }
}
