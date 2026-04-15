<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ImagesCarResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'car_id' => $this->car_id,
            'path' => $this->path
                ? asset('storage/' . $this->path)
                : null,
            'type' => $this->type,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
