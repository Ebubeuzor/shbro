<?php

namespace App\Http\Resources;

use App\Models\HostHome;
use App\Models\Review;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\URL;

class AllReservationsResource extends JsonResource
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

        $review = Review::where('user_id',$this->user_id)->where('host_home_id',$this->host_home_id)
        ->where('booking_id',$this->id)->first();

        return [
            'name' => $user->name,
            'dateUserJoined' => $user->created_at->format('M j, Y'),
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
            'status' => $this->status(),
            'check_out_time' => $this->check_out_time,
        ];

    }

    protected function status()
    {
        $hosthome = HostHome::find($this->host_home_id);
        $checkInDateTime = Carbon::parse($this->check_in . ' ' . $hosthome->check_in_time);
        $checkOutDateTime = Carbon::parse($this->check_out . ' ' . $this->check_out_time);
        $today = Carbon::now();

        if ($this->paymentStatus === "successButCancelled") {
            return "cancelled";
        } elseif ($today->isBefore($checkInDateTime)) {
            return "upcoming";
        } elseif ($today->isSameDay($checkInDateTime) || $today->isBetween($checkInDateTime, $checkOutDateTime)) {
            return "ongoing";
        } elseif ($today->isSameDay($checkOutDateTime) || $today->isAfter($checkOutDateTime)) {
            return "completed";
        } else {
            return "pending";
        }
    }
}
