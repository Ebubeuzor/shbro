<?php

namespace App\Http\Resources;

use App\Models\Booking;
use App\Models\HostHome;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class HostPendingReviewForGuestResource extends JsonResource
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
        $host = User::find($this->user_id);
        $guest = User::find($this->guest_id);
        $booking = Booking::find($this->booking_id);
        
        $checkInDate = Carbon::createFromFormat('Y-m-d', $booking->check_in)->format('F j, Y');
        $checkOutDate = Carbon::createFromFormat('Y-m-d', $booking->check_out)->format('F j, Y');

        return [
            'id' => $this->id,
            'bookingid' => $this->booking_id,
            'guestName' => $guest->name,
            'guestid' => $guest->id,
            'hostid' => $host->id,
            'title' => $hosthome->title,
            'hosthomeid' => $hosthome->id,
            'name' => $hosthome->title,
            'checkInDate' => $checkInDate,
            'checkOutDate' => $checkOutDate,
            'check_in_time' => HostHome::find($this->host_home_id)->check_in_time,
            'check_out_time' => $booking->check_out_time,
            'address' => $hosthome->address,
        ];
    }
}
