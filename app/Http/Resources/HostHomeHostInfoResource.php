<?php

namespace App\Http\Resources;

use App\Models\Booking;
use App\Models\Review;
use Illuminate\Http\Resources\Json\JsonResource;

class HostHomeHostInfoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $reviews = Review::where('host_id',$this->id)->get();
        $successfulCheckOut = Booking::where('hostId',$this->id)
        ->whereNotNull('checkOutNotification')
        ->get();
        $ratings = $reviews->isEmpty() ? 0 : $reviews->avg('ratings');
        return [
            'id' =>$this->id,
            'profilePicture' =>$this->profilePicture,
            'reviews' => count($reviews),
            // '$successfulCheckOut' => count($reviews),
            'rating' => $ratings,
            'yearsOfHosting' => optional($this->hosthomes->first())->created_at->diffForHumans(),
            'totalHomes' => $this->hosthomes()
                ->where('verified', 1)
                ->where('disapproved', null)
                ->whereNull('banned')
                ->whereNull('suspend')
                ->count()
        ];
    }
}
