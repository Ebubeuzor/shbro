<?php

namespace App\Http\Resources;

use App\Models\HostHome;
use App\Models\User;
use Illuminate\Http\Resources\Json\JsonResource;

class CancelTripsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $user = User::find($this->booking->user_id);
        $hosthome = HostHome::find($this->booking->host_home_id);
        return [
            'id' => $this->id,
            'reservationID' => $this->booking->paymentId,
            'guestName' => $user->name,
            'apartmentName' => $hosthome->title,
            'cancellationDate' => $this->created_at->format('Y-m-d H:i a'),
            'reason' => $this->reasonforcancel,
        ];
    }
}
