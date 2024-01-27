<?php

namespace App\Http\Resources;

use App\Models\HostHome;
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
        return [
            'id' => $this->id,
            'check_in' => $this->booking->check_in,
            'check_out' => $this->booking->check_out,
            'hosthomephotos' => $this->hosthomephotosUrls(),
            'hosthometitleandloacation' => $this->hosthometitleandloacation(),
            'hosthomebedroom' => $this->hosthomebedroom(),
            'hosthomebathroom' => $this->hosthomebathroom(),
            'status' => $this->status(),
            'amountPaid' => $this->booking->totalamount,
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

    protected function status()
    {
        
        $hosthome = HostHome::find($this->booking->host_home_id);
        $checkInDateTime = Carbon::parse($this->booking->check_in . ' ' . $hosthome->check_in_time);
        $checkOutDateTime = Carbon::parse($this->booking->check_out . ' ' . $hosthome->check_out_time);
        $today = Carbon::now();

        if ($today->isSameDay($checkInDateTime) && $today->isBetween($checkInDateTime, $checkOutDateTime)) {
            return "CHECKED IN";
        } elseif ($today->isAfter($checkOutDateTime)) {
            return "CHECKED OUT";
        } else {
            return "RESERVED";
        }
    }

}
