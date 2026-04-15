<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImagesCar extends Model
{
    use HasFactory;

    protected $table = 'images_car';


    protected $fillable = [
        'car_id',
        'path',
        'type'
    ];

    public function car()
    {
        return $this->belongsTo(Car::class);
    }
}
