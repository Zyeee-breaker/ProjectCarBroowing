<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MainCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    /**
     * Relasi ke child categories
     */
    public function children()
    {
        return $this->hasMany(ChildCategory::class, 'main_category_id');
    }
}
