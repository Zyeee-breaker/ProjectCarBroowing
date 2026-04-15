<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'code' => $this->booking_code,
            'car' => $this->car_name,
            'total_price' => $this->total_price,
            'status' => $this->status,
            'start' => $this->start_time,
            'end' => $this->end_time,
        ];
    }
}