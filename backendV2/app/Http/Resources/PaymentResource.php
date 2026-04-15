<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'booking_id' => $this->booking_id,
            'amount' => $this->amount,
            'paid' => $this->paid_amount,
            'remaining' => $this->remaining_amount,
            'status' => $this->status,
        ];
    }
}