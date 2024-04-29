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
        $hosthome = HostHome::find($booking->host_home_id);
        return [
            'id' => $this->id,
            'userid' => $user->id,
            'hosthomeid' => $hosthome->id,
            'hosthomename' => $hosthome->title,
            'username' => $user->name,
            'guestProfilePic' => $user->profilePicture != null ? URL::to($user->profilePicture) : null,
            'check_in' => Carbon::parse($booking->check_in)->format('M j, Y')
        ];
    }
}
