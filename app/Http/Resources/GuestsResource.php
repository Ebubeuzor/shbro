<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\URL;

class GuestsResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->email,
            'banned' => $this->banned,
            'suspend' => $this->suspend,
            'verified' => $this->verified,
            'image' => $this->profilePicture != null ? URL::to($this->profilePicture) : null,
            'created_at' => $this->created_at->format('Y-m-d'),
            'last_login_at' => $this->last_login_at ? \Carbon\Carbon::parse($this->last_login_at)->format('Y-m-d') : $this->created_at->format('Y-m-d'),
        ];
    }
}
