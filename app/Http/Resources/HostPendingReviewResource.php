<?php

namespace App\Http\Resources;

use App\Models\Booking;
use App\Models\HostHome;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\URL;

class HostPendingReviewResource extends JsonResource
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
        $booking = Booking::find($this->booking_id);
        return [
            'id' => $this->id,
            'username' => $user->name,
            'userprofilepic' => $user->name,
            'guestProfilePic' => URL::to($user->profilePicture),
            'check_in' => Carbon::parse($booking->check_in)->format('M j, Y')
        ];
    }
}
