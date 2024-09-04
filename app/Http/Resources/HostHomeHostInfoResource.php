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
            ->with(['hosthome' => function($query) {
                $query->withTrashed();  // Include soft-deleted HostHome records
            }])
            ->get();

        // Map the reviews data and include photo URLs
        $mappedReviews = $reviews->map(function ($review) {
            
            $hosthome = HostHome::withTrashed()->find($review->host_home_id);
            $user = User::find($review->user_id);

            $photoUrl = $hosthome->hosthomephotos->isNotEmpty()
                ? url($hosthome->hosthomephotos->first()->image)
                : null;

            return [
                'hosthome_id' => $hosthome->id,
                'user_id' => $user->id,
                'user_name' => $user->name,
                'review_id' => $review->id,
                'ratings' => $review->ratings,
                'title' => $review->title,
                'comment' => $review->comment,
                'photo_url' => $photoUrl,
                'created_at' => $review->created_at,
            ];
        });
    
        $successfulCheckOut = Booking::where('hostId',$this->id)
        ->where('checkOutNotification','!=',null)
        ->get();
        $successfulCheckOutNumber = $successfulCheckOut->isEmpty() ? 0 : count($successfulCheckOut);
        $ratings = $reviews->isEmpty() ? 0 : $reviews->avg('ratings');
        $firstHome = HostHome::withTrashed()->where('user_id', $this->id);
        $createdAt = $firstHome ? $firstHome->created_at->diffForHumans() : null;

        return [
            'id' =>$this->id,
            'name' =>$this->name,
            'email' =>$this->email,
            'Status' =>$this->host == 0 ? "Guest" : "Host And Guest",
            'aboutUser' => $this->aboutUser ?? null,
            'profilePicture' => $this->profilePicture != null ? URL::to($this->profilePicture) : null,
            'reviews' => count($reviews) ?? 0,
            'actualReviews' => $mappedReviews ?? [],
            'successfulCheckOut' => $successfulCheckOutNumber ?? [],
            'rating' => $ratings ?? [],
            'hosthomeDetails' => $this->hosthomeDetails() ?? [],
            'bookedhosthomeDetails' => $this->bookedhosthomeDetails() ?? [],
            'yearsOfHosting' => $createdAt ?? null,
            'totalHomes' => HostHome::withTrashed()  // Start with the HostHome model
                ->where('user_id', $this->id)  // Filter by the user ID
                ->where('verified', 1)
                ->whereNull('disapproved')
                ->whereNull('banned')
                ->whereNull('suspend')
                ->count() ?? 0
        ];

    }

    protected function hosthomeDetails()
    {
        $hosthomes = HostHome::withTrashed()->where('user_id', $this->id)
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

        $hosthomes = HostHome::withTrashed()->whereIn('id', $bookings->pluck('host_home_id'))->get();

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
