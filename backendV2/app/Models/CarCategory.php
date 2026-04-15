<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CarCategory extends Model
{
    use HasFactory;

    protected $table = 'car_categories';

    protected $fillable = [
        'car_id', 'cat_id'
    ];

    public function car()
    {
        return $this->belongsTo(Car::class);
    }

    public function category()
    {
        return $this->belongsTo(\App\Models\ChildCategory::class, 'cat_id');
    }
}