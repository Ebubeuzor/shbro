<?php

namespace App\Http\Resources;

use App\Models\HostHome;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class UserTripResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $host = User::find($this->booking->hostId);
        $hosthome = HostHome::withTrashed()
                    ->where('id',$this->booking->host_home_id)
                    ->where('verified', 1)
                    ->whereNull('disapproved')
                    ->whereNull('banned')
                    ->whereNull('suspend')->first();

        return [
            'id' => $this->id,
            'bookingid' => $this->booking_id,
            'check_in' => $this->booking->check_in,
            'check_out' => $this->booking->check_out,
            'hosthomephotos' => $this->hosthomephotosUrls($hosthome),
            'hosthomeamenities' => $this->hosthomeamenities($hosthome),
            'hosthomedescription' => $this->hosthomedescription($hosthome),
            'hosthometitleandlocation' => $this->hosthometitleandlocation($hosthome),
            'hosthomebedroom' => $this->hosthomebedroom($hosthome),
            'hosthomebathroom' => $this->hosthomebathroom($hosthome),
            'status' => $this->status($hosthome),
            'hosthomecancelationpolicy' => $this->hosthomecancelationpolicy($hosthome),
            'amountPaid' => $this->booking->totalamount,
            'hostid' => $this->booking->hostId,
            'hostName' => $host ? $host->name : null,
        ];
    }

    protected function hosthomephotosUrls($hosthome)
    {
        if (!$hosthome) {
            return [];
        }

        return collect($hosthome->hosthomephotos)->map(function ($photo) {
            $photoData = json_decode($photo, true);
            return url($photoData['image']);
        })->toArray();
    }

    protected function hosthomeamenities($hosthome)
    {
        if (!$hosthome) {
            return [];
        }

        return collect($hosthome->hosthomeoffers)->map(function ($offer) {
            return $offer->offer;
        })->toArray();
    }

    protected function hosthomebedroom($hosthome)
    {
        return $hosthome ? $hosthome->bedroom : null;
    }

    protected function hosthomecancelationpolicy($hosthome)
    {
        return $hosthome ? $hosthome->cancellation_policy : null;
    }

    protected function hosthomebathroom($hosthome)
    {
        return $hosthome ? $hosthome->bathrooms : null;
    }

    protected function hosthometitleandlocation($hosthome)
    {
        return $hosthome ? $hosthome->title . " " . $hosthome->address : null;
    }

    protected function hosthomedescription($hosthome)
    {
        return $hosthome ? $hosthome->description : null;
    }

    protected function status($hosthome)
    {
        if (!$hosthome) {
            return "UNKNOWN";
        }

        $checkInDateTime = Carbon::parse($this->booking->check_in . ' ' . $hosthome->check_in_time);
        $checkOutDateTime = Carbon::parse($this->booking->check_out . ' ' . $this->booking->check_out_time);
        $today = Carbon::now();

        if ($this->booking->paymentStatus === "successButCancelled") {
            return "CANCELLED";
        } elseif ($today->isBefore($checkInDateTime)) {
            return "RESERVED";
        } elseif ($today->isSameDay($checkInDateTime) || $today->isBetween($checkInDateTime, $checkOutDateTime)) {
            return "CHECKED IN";
        } elseif ($today->isSameDay($checkOutDateTime) || $today->isAfter($checkOutDateTime)) {
            return "CHECKED OUT";
        } else {
            return "RESERVED";
        }
    }
}

