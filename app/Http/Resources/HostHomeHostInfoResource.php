<?php

namespace App\Http\Resources;

use App\Models\Booking;
use App\Models\HostHome;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;
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
        $firstHome = $this->hosthomes->first();
        Log::info($firstHome);
        $createdAt = $firstHome ? $firstHome->created_at->diffForHumans() : null;

        Log::info($createdAt);

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
            'yearsOfHosting' => $createdAt ?? null,
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

    // protected function cohosthomeDetails()
    // {
    //     $user = User::find($this->id);
    //     $hosthomes = $user->cohosthomes()->with('hosthome')->get()
    //     ->map(function ($cohost) {
    //         $cohostUser = HostHome::where('id', $cohost->host_home_id)
    //         ->where('verified', 1)
    //         ->where('disapproved', null)
    //         ->whereNull('banned')
    //         ->whereNull('suspend')->first();
    //         return $cohostUser; // Return an empty collection if user not found
    //     })
    //     ->flatten();

    //     return $hosthomes->map(function ($hosthome) {
    //         $firstPhoto = $hosthome->hosthomephotos->first() != null ? $hosthome->hosthomephotos->first() : null;
    
    //         if ($firstPhoto != null) {
    //             $photoData = json_decode($firstPhoto, true);
    
    //             return [
    //                 "hosthome_id" => $hosthome->id,
    //                 "hosthome_title" => $hosthome->title,
    //                 "photo_image" => url($photoData['image'])
    //             ];
    //         }
        
    //         return [];
    //     })->filter();
    // }
    
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
