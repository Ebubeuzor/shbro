<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\URL;

class HostHomeReviewResource extends JsonResource
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
            'comment' => $this->comment,
            'title' => $this->title,
            'ratings' => $this->ratings,
            'user_name' => $this->user->name,
            'user_profilePic' => URL::to($this->user->profilePicture),
            'datePosted' => $this->created_at->format('M j, Y'),
        ];
    }
}
