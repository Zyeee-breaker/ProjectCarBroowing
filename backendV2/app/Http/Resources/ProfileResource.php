<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'phone' => $this->phone,
            'address' => $this->address,
            'city' => $this->city,
            'country' => $this->country,
            'document_number' => $this->document_number,
            'document_type' => $this->document_type,
            'is_verified' => $this->is_verified,
            'verified_at' => $this->verified_at,
            'status' => $this->status,
            'document_file' => $this->document_file,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'image_user' => ImageResource::collection($this->whenLoaded('profileImg')),
        ];
    }
}