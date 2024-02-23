<?php

namespace App\Http\Resources;

use App\Models\Booking;
use App\Models\Review;
use App\Models\Wishlistcontainer;
use Carbon\Carbon;
use Illuminate\Console\View\Components\Info;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;

class HostHomeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    
    public function toArray($request)
    {
        $user = $request->user();
        
        Log::info(auth()->user());
        $bookingDates = Booking::select('check_in', 'check_out')
        ->where('paymentStatus', 'success')
        ->where('host_home_id', $this->id)
        ->get();

        $formattedDates = $bookingDates->map(function ($booking) {
            return [
                'check_in' => Carbon::parse($booking->check_in)->format('Y-m-d'),
                'check_out' => Carbon::parse($booking->check_out)->format('Y-m-d'),
            ];
        });

        $reviews = Review::where('host_home_id', $this->id)->get();
    
        $ratings = $reviews->isEmpty() ? 0 : $reviews->avg('ratings');

        return [
            'id' => $this->id,
            'user' => new HostHomeHostInfoResource($this->user),
            'property_type' => $this->property_type,
            'guest_choice' => $this->guest_choice,
            'address' => $this->address,
            'guest' => $this->guests,
            'bedroom' => $this->bedroom,
            'reservedPricesForCertainDay' => $this->reservedPricesForCertainDay ?? [],
            'hosthomecustomdiscounts' => $this->hosthomecustomdiscounts ?? [],
            'hosthomeblockeddates' => $this->hosthomeblockeddates ?? [],
            'beds' => $this->beds,
            'bathrooms' => $this->bathrooms,
            'amenities' => $this->hosthomeoffers,
            'hosthomephotos' => $this->hosthomephotosUrls(),
            'hosthomevideo' => URL::to($this->video),
            'title' => $this->title,
            'hosthomedescriptions' => $this->hosthomedescriptions,
            'description' => $this->description,
            'reservation' => $this->reservation,
            'reservations' => $this->hosthomereservations,
            'dicountprice' => $this->price,
            'price' => $this->actualPrice,
            'weekend' => $this->weekendPrice ?? null,
            'discounts' => $this->hosthomediscounts,
            'rules' => $this->hosthomerules,
            'reviews' => HostHomeReviewResource::collection($this->hosthomereviews),
            'host_type' => $this->host_type,
            'notices' => $this->hosthomenotices,
            'checkin' => $this->check_in_time,
            'checkout' => $this->check_out_time,
            'cancelPolicy' => $this->cancellation_policy,
            'securityDeposit' => $this->security_deposit,
            'listing_status' => $this->listing_status,
            'vat' => $this->tax,
            'ratings' => $ratings,
            'guest_fee' => $this->service_fee,
            'adminStatus' => "Pending Approval",
            'bookedDates' => $bookingDates != null ? $formattedDates : [],
            'status' => $this->verified == 0 ? "Not published" : "Published",
            'created_on' => $this->created_at->format('Y-m-d'),
            'addedToWishlist' => $user ? $this->isAddedToWishlist($user->id, $this->id) : false,
        
        ];
    }

    protected function isAddedToWishlist($userId, $hostHomeId)
    {
        Log::info($userId . " " . $hostHomeId);
        return Wishlistcontainer::whereHas('items', function ($query) use ($hostHomeId) {
            $query->where('host_home_id', $hostHomeId);
        })->where('user_id', $userId)->exists();
    }

    protected function hosthomephotosUrls()
    {
        return collect($this->hosthomephotos)->map(function ($photo) {
            $photoData = json_decode($photo, true);

            // Assuming 'image' is the key for the image URL in each photo data
            return [
                "id"=> $photoData['id'],
                "images"=>url($photoData['image'])
            ];
        })->toArray();
    }
}
