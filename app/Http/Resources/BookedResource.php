<?php

namespace App\Http\Resources;

use App\Models\Booking;
use App\Models\HostHome;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\URL;

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

        $hosthome = HostHome::find($this->host_home_id);

        $totalAmount = Booking::where('hostId', auth()->id())
        ->where('paymentStatus', '=', 'success')->sum('totalamount');

        $review = Review::where('user_id',$this->user_id)->where('host_home_id',$this->host_home_id)
        ->where('booking_id',$this->id)->first();

        return [
            'name' => $user->name,
            'aboutGuest' => new GuestReviewsResource($user),
            'profilepic' => URL::to($user->profilePicture),
            'check_in_date' => $this->formattedCheckIn,
            'check_out_date' => $this->formattedCheckOut,
            'check_in_time' => $this->check_in_time,
            'bookedDate' => $this->created_at->format('Y-m-d'),
            'title' => $hosthome->title,
            'cancelationPolicy' => $hosthome->cancellation_policy,
            'userReviews' => $review,
            'guest_service_fee' => $this->guest_service_charge,
            'host_service_fee' => $this->host_service_charge,
            'guests' => intval($this->adults) + intval($this->children) + intval($this->infants),
            'datePosted' => $hosthome->created_at->format('Y-m-d'),
            'amount' => $this->hostBalance,
            'hostTotalAmount' => $totalAmount,
            'paidToHostStatus' => $this->paidHostStatus != null ? "Paid out" : "Expected",
            'check_out_time' => $this->check_out_time,
        ];
    }
}
