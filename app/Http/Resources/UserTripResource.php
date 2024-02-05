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
        return [
            'id' => $this->id,
            'bbokingid' => $this->booking_id,
            'check_in' => $this->booking->check_in,
            'check_out' => $this->booking->check_out,
            'hosthomephotos' => $this->hosthomephotosUrls(),
            'hosthomeamenities' => $this->hosthomeamenities(),
            'hosthomedescription' => $this->hosthomedescription(),
            'hosthometitleandloacation' => $this->hosthometitleandloacation(),
            'hosthomebedroom' => $this->hosthomebedroom(),
            'hosthomebathroom' => $this->hosthomebathroom(),
            'status' => $this->status(),
            'amountPaid' => $this->booking->totalamount,
            'hostid' => $this->booking->hostId,
            'hostName' => $host->name,
        ];
    }

    protected function hosthomephotosUrls()
    {
        $hosthome = HostHome::find($this->booking->host_home_id);
        return collect($hosthome->hosthomephotos)->map(function ($photo) {
            $photoData = json_decode($photo, true);

            // Assuming 'image' is the key for the image URL in each photo data
            return url($photoData['image']);
        })->toArray();
    }

    protected function hosthomeamenities()
    {
        $hosthome = HostHome::find($this->booking->host_home_id);
        return collect($hosthome->hosthomeoffers)->map(function ($offer) {
            return $offer->offer;
        })->toArray();
    }

    protected function hosthomebedroom()
    {

        $hosthome = HostHome::find($this->booking->host_home_id);
        return $hosthome->bedroom;
    }

    protected function hosthomebathroom()
    {
        
        $hosthome = HostHome::find($this->booking->host_home_id);
        return $hosthome->bathrooms;
    }

    protected function hosthometitleandloacation()
    {
        
        $hosthome = HostHome::find($this->booking->host_home_id);
        return $hosthome->title . " " . $hosthome->address;
    }

    protected function hosthomedescription()
    {
        
        $hosthome = HostHome::find($this->booking->host_home_id);
        return $hosthome->description;
    }



    protected function status()
    {
        
        $hosthome = HostHome::find($this->booking->host_home_id);
        $checkInDateTime = Carbon::parse($this->booking->check_in . ' ' . $hosthome->check_in_time);
        $checkOutDateTime = Carbon::parse($this->booking->check_out . ' ' . $hosthome->check_out_time);
        $today = Carbon::now();

        if ($this->booking->paymentStatus === "successButCancelled") {
            return "CANCELLED";
        }
        elseif ($today->isSameDay($checkInDateTime) && $today->isBetween($checkInDateTime, $checkOutDateTime)) {
            return "CHECKED IN";
        } elseif ($today->isAfter($checkOutDateTime)) {
            return "CHECKED OUT";
        } else {
            return "RESERVED";
        }
    }

}
