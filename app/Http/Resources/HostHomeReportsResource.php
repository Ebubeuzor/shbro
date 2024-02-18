<?php

namespace App\Http\Resources;

use App\Models\HostHome;
use App\Models\User;
use Illuminate\Http\Resources\Json\JsonResource;

class HostHomeReportsResource extends JsonResource
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
        $hostHome = HostHome::find($this->host_home_id);
        $host = User::find($hostHome->user_id);
        return [
            'id' => $this->id,
            'title' => $this->title,
            'reasonforreporting' => $this->reasonforreporting,
            'extrareasonforreporting' => $this->extrareasonforreporting != null ? $this->extrareasonforreporting : "",
            'guestStatus' => $guest->host == 1 ? "Host" : "Guest",
            'guestName' => $guest->name,
            'guestEmail' => $guest->email,
            'hostName' => $host->name,
            'hostEmail' => $host->email,
            'hostId' => $host->id,
            'homeName' => $hostHome->title,
            'homeId' => $hostHome->id,
        ];
    }
}
