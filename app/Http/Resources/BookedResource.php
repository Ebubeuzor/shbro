<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BookedResource extends JsonResource
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
            'name' => $this->user->name,
            'check_in_date' => $this->formattedCheckIn,
            'check_out_date' => $this->formattedCheckOut,
            'check_out_time' => $this->hosthome->check_in_time,
            'check_out_time' => $this->hosthome->check_out_time,
        ];
    }
}
