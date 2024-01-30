<?php

namespace App\Http\Resources;

use App\Models\HostHome;
use Illuminate\Http\Resources\Json\JsonResource;

class PendingReviewResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $hosthome = HostHome::find($this->host_home_id);

        return [
            'id' => $this->id,
            'bookingid' => $this->booking_id,
            'userid' => $this->user_id,
            'hostid' => $this->host_id,
            'title' => $hosthome->title,
            'hosthomeid' => $hosthome->id,
            'address' => $hosthome->address,
        ];
    }
}
