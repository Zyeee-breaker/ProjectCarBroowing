<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'email_verified_at' => $this->email_verified_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            // optional include profile & images
            'profile' => $this->whenLoaded('profile', function () {
                return new \App\Http\Resources\ProfileResource($this->profile);
            }),
            'images' => $this->whenLoaded('images', function () {
                return \App\Http\Resources\ImageResource::collection($this->images);
            }),
        ];
    }
}