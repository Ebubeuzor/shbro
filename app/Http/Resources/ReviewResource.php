<?php

namespace App\Http\Resources;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\URL;

class ReviewResource extends JsonResource
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
            'id' => $this->id,
            'title' => $this->title,
            'ratings' => $this->ratings,
            'comment' => $this->comment,
            'guestName' => $user->name,
            'guestProfilePic' => $user->profilePicture != null ? URL::to($user->profilePicture) : null,
            'created_at' => Carbon::parse($this->created_at)->format('M j, Y')
        ];
    }
}
