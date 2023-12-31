<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\URL;

class HostHomeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'user' => $this->user,
            'property_type' => $this->property_type,
            'guest_choice' => $this->guest_choice,
            'address' => $this->address,
            'guest' => $this->guests,
            'bedroom' => $this->bedroom,
            'beds' => $this->beds,
            'bathrooms' => $this->bathrooms,
            'amenities' => $this->hosthomeoffers,
            'hosthomephotos' => URL::to($this->hosthomephotos),
            'hosthomevideo' => URL::to($this->video),
            'title' => $this->title,
            'hosthomedescriptions' => $this->hosthomedescriptions,
            'description' => $this->description,
            'reservation' => $this->reservation,
            'reservations' => $this->hosthomereservations,
            'price' => $this->price,
            'discounts' => $this->hosthomediscounts,
            'rules' => $this->hosthomerules,
            'host_type' => $this->host_type,
            'notices' => $this->hosthomenotices,
            'checkin' => $this->check_in_time,
            'cancelPolicy' => $this->cancellation_policy,
            'securityDeposit' => $this->security_deposit,
            'listing_status' => $this->listing_status,
            'adminStatus' => "Pending Approval",
            'status' => $this->verified == 0 ? "Not published" : "Published",
            'created_on' => $this->created_at->format('Y-m-d'),
        ];
    }
}
