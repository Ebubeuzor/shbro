<?php

namespace App\Http\Resources;

use App\Models\Booking;
use App\Models\HostHome;
use App\Models\Review;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;

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
        $hostId = $this->id;

        $reviews = Review::where('host_id', $hostId)
            ->join('users', 'reviews.user_id', '=', 'users.id')
            ->select('reviews.*', 'users.name as user_name')
            ->get();
    
        $successfulCheckOut = Booking::where('hostId',$this->id)
        ->where('checkOutNotification','!=',null)
        ->get();
        $successfulCheckOutNumber = $successfulCheckOut->isEmpty() ? 0 : count($successfulCheckOut);
        $ratings = $reviews->isEmpty() ? 0 : $reviews->avg('ratings');
        return [
            'id' =>$this->id,
            'name' =>$this->name,
            'email' =>$this->email,
            'Status' =>$this->host == 0 ? "Guest" : "Host And Guest",
            'profilePicture' => URL::to($this->profilePicture),
            'reviews' => count($reviews) ?? 0,
            'actualReviews' => $reviews ?? [],
            'successfulCheckOut' => $successfulCheckOutNumber ?? [],
            'rating' => $ratings ?? [],
            'hosthomeDetails' => $this->hosthomeDetails() ?? [],
            'bookedhosthomeDetails' => $this->bookedhosthomeDetails() ?? [],
            'yearsOfHosting' => function () {
                $firstHostHome = $this->hosthomes->first();
            
                if ($firstHostHome) {
                    return $firstHostHome->created_at->diffForHumans();
                } else {
                    return null; 
                }
            },
            'totalHomes' => $this->hosthomes()
                ->where('verified', 1)
                ->where('disapproved', null)
                ->whereNull('banned')
                ->whereNull('suspend')
                ->count() ?? 0
        ];

    }

    protected function hosthomeDetails()
    {
        $hosthomes = HostHome::where('user_id', $this->id)
        ->where('verified', 1)
        ->where('disapproved', null)
        ->whereNull('banned')
        ->whereNull('suspend')
        ->get();
        
        return $hosthomes->map(function ($hosthome) {
            $firstPhoto = $hosthome->hosthomephotos->first();
    
            if ($firstPhoto) {
                $photoData = json_decode($firstPhoto, true);
    
                return [
                    "hosthome_id" => $hosthome->id,
                    "hosthome_title" => $hosthome->title,
                    "photo_image" => url($photoData['image'])
                ];
            }
        
            return null;
        })->filter();
    }
    
    protected function bookedhosthomeDetails()
    {
        $bookings = Booking::where('hostId', $this->id)
            ->where('paymentStatus', 'success')
            ->get();

        $hosthomes = HostHome::whereIn('id', $bookings->pluck('host_home_id'))->get();

        return $hosthomes->map(function ($hosthome) {
            $firstPhoto = $hosthome->hosthomephotos->first();

            if ($firstPhoto) {
                $photoData = json_decode($firstPhoto, true);

                return [
                    "hosthome_id" => $hosthome->id,
                    "hosthome_title" => $hosthome->title,
                    "photo_image" => url($photoData['image'])
                ];
            }

            return null;
        })->filter();
    }

    
}
