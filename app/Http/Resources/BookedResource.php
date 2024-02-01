<?php

namespace App\Http\Resources;

use App\Models\HostHome;
use App\Models\User;
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
        $user = User::find($this->user_id);
        return [
            'name' => $user->name,
            'profilepic' => $user->profilePicture,
            'check_in_date' => $this->formattedCheckIn,
            'check_out_date' => $this->formattedCheckOut,
            'check_in_time' => HostHome::find($this->host_home_id)->check_in_time,
            'check_out_time' => $this->check_out_time,
        ];
    }
}
