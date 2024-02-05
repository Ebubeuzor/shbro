<?php

namespace App\Http\Resources;

use App\Models\HostHome;
use App\Models\User;
use Illuminate\Http\Resources\Json\JsonResource;

class AllBookingsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $guest = User::find($this->user_id);
        $host = User::find($this->hostId);
        $hostHome = HostHome::find($this->host_home_id);

        return [
            'id' => $this->id,
            'totalamount' => $this->totalamount,
            'paymentType' => $this->paymentType,
            'tax' => $this->vat_charge,
            'guest_service_charge' => $this->guest_service_charge,
            'check-In' => $this->check_in,
            'check-out' => $this->check_out,
            'guestName' => $guest->name,
            'guestEmail' => $guest->email,
            'hostName' => $host->name,
            'hostEmail' => $host->email,
            'hostId' => $host->id,
            'homeName' => $hostHome->title,
            'homeType' => $hostHome->property_type,
            'bedroom' => $hostHome->bedroom,
            'beds' => $hostHome->beds,
            'amanities' => $hostHome->hosthomeoffers,
            'paymentId' => $this->paymentId,
        ];
    }
}
