<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ImagesCar;
use App\Models\CarUnit;
use App\Models\Feature;
use App\Models\ChildCategory;

class Car extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'brand',
        'model',
        'year',
        'price_per_day'
    ];

    public function units()
    {
        return $this->hasMany(CarUnit::class);
    }

    public function features()
    {
        return $this->hasMany(Feature::class);
    }

    public function images()
    {
        return $this->hasMany(ImagesCar::class);
    }

    public function categories()
    {
        return $this->belongsToMany(
            ChildCategory::class,
            'car_categories',
            'car_id',
            'cat_id'
        );
    }
}
