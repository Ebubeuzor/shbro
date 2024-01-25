<?php

namespace App\Http\Resources;

use App\Models\Wishlistcontainer;
use Illuminate\Http\Resources\Json\JsonResource;
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
        return [
            'id' => $this->id,
            'user' => $this->user,
            'property_type' => $this->property_type,
            'guest_choice' => $this->guest_choice,
            'address' => $this->address,
            'guest' => $this->guests,
            'bedroom' => $this->bedroom,
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
            'price' => $this->price,
            'discounts' => $this->hosthomediscounts,
            'rules' => $this->hosthomerules,
            'host_type' => $this->host_type,
            'notices' => $this->hosthomenotices,
            'checkin' => $this->check_in_time,
            'checkout' => $this->check_out_time,
            'cancelPolicy' => $this->cancellation_policy,
            'securityDeposit' => $this->security_deposit,
            'listing_status' => $this->listing_status,
            'vat' => $this->tax,
            'guest_fee' => $this->service_fee,
            'adminStatus' => "Pending Approval",
            'status' => $this->verified == 0 ? "Not published" : "Published",
            'created_on' => $this->created_at->format('Y-m-d'),
            'addedToWishlist' => $user ? $this->isAddedToWishlist($user->id, $this->id) : false,
        
        ];
    }

    protected function isAddedToWishlist($userId, $hostHomeId)
    {
        return Wishlistcontainer::whereHas('items', function ($query) use ($hostHomeId) {
            $query->where('host_home_id', $hostHomeId);
        })->where('user_id', $userId)->exists();
    }

    protected function hosthomephotosUrls()
    {
        return collect($this->hosthomephotos)->map(function ($photo) {
            $photoData = json_decode($photo, true);

            // Assuming 'image' is the key for the image URL in each photo data
            return url($photoData['image']);
        })->toArray();
    }
}
