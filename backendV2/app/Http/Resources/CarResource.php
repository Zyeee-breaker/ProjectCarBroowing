<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CarResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'brand' => $this->brand,
            'model' => $this->model,
            'year' => $this->year,
            'price_per_day' => $this->price_per_day,
            'units' => CarUnitResource::collection($this->whenLoaded('units')),
            'features' => FeatureResource::collection($this->whenLoaded('features')),
            'images' => ImagesCarResource::collection($this->whenLoaded('images')),
            'categories' => $this->categories->pluck('name'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}