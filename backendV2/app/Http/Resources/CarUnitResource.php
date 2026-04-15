<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CarUnitResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'car_id' => $this->car_id,
            'plate_number' => $this->plate_number,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}