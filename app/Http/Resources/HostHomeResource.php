<?php

namespace App\Http\Resources;

use App\Models\Booking;
use App\Models\Review;
use App\Models\Servicecharge;
use App\Models\User;
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
        $serviceCharge = Servicecharge::first();

        // Set global variables to zero if no record is found
        $guestServicesCharge = $serviceCharge ? $serviceCharge->guest_services_charge : 0;
        $hostServicesCharge = $serviceCharge ? $serviceCharge->host_services_charge : 0;
        $tax = $serviceCharge ? $serviceCharge->tax : 0;

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
        
        $cohosts = $this->cohosthomes;
        
        Log::info($cohosts);

        // Map each co-host to the corresponding HostHomeHostInfoResource
        $cohostResources = $cohosts->map(function ($cohost) {
            return new HostHomeHostInfoResource(User::find($cohost->user_id));
        });

        $bookingRequestStatus = null;

        foreach($this->acceptedRequest as $bookrequest){

            if ($bookrequest->user_id == auth()->id() && $bookrequest->approved == "approved" && $bookrequest->host_home_id == $this->id && $bookrequest->bookingstatus == null) {
                $bookingRequestStatus = "approved";    
            }

        }

        return [
            'id' => $this->id,
            'user' => new HostHomeHostInfoResource($this->user),
            'cohosts' => $cohostResources->isNotEmpty() ? $cohostResources : null,
            'property_type' => $this->property_type,
            'guest_choice' => $this->guest_choice,
            'address' => $this->address,
            'guest' => $this->guests,
            'bedroom' => $this->bedroom,
            'reservedPricesForCertainDay' => $this->formatReservedPrices($this->reservedPricesForCertainDay ?? []),
            'hosthomecustomdiscounts' => $this->hosthomecustomdiscounts ?? [],
            'hosthomeblockeddates' => $this->formatDateRange($this->hosthomeblockeddates ?? []),
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
            'bookingCount' => $this->bookingCount,
            'min_nights' => $this->min_nights,
            'max_nights' => $this->max_nights,
            'advance_notice' => $this->advance_notice,
            'preparation_time' => $this->preparation_time,
            'availability_window' => $this->availability_window,
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
            'vat' => $tax,
            'bookingRequestStatus' => $bookingRequestStatus,
            'ratings' => $ratings,
            'guest_fee' => $guestServicesCharge,
            'adminStatus' => "Pending Approval",
            'bookedDates' => $bookingDates != null ? $formattedDates : [],
            'status' => $this->verified == 0 ? "Not published" : "Published",
            'created_on' => $this->created_at->format('Y-m-d'),
            'addedToWishlist' => $user ? $this->isAddedToWishlist($user->id, $this->id) : false,
        
        ];
    }
    protected function formatDateRange($dates)
    {
        $formattedDates = [];
        $currentGroup = [];

        foreach ($dates as $dateRange) {
            if (empty($currentGroup) || $this->isConsecutive($currentGroup, $dateRange)) {
                $currentGroup[] = [
                    'date' => $dateRange['date'],
                    'start_date' => $dateRange['start_date'],
                    'end_date' => $dateRange['end_date'],
                ];
            } else {
                $formattedDates[] = $currentGroup;
                $currentGroup = [
                    [
                        'date' => $dateRange['date'],
                        'start_date' => $dateRange['start_date'],
                        'end_date' => $dateRange['end_date'],
                    ],
                ];
            }
        }

        if (!empty($currentGroup)) {
            $formattedDates[] = $currentGroup;
        }

        return $formattedDates;
    }

    protected function isConsecutive($group, $dateRange)
    {
        $lastDate = end($group);
        return $lastDate['end_date'] === null && $lastDate['date'] === date('Y-m-d', strtotime($dateRange['date'] . ' -1 day'));
    }

    protected function formatReservedPrices($reservedPrices)
    {
        $formattedPrices = [];
        $currentGroup = [];

        foreach ($reservedPrices as $reservedPrice) {
            if (empty($currentGroup) || $this->isConsecutiveReservedPrices($currentGroup, $reservedPrice)) {
                $currentGroup[] = [
                    'id' => $reservedPrice['id'],
                    'date' => $reservedPrice['date'],
                    'price' => $reservedPrice['price'],
                    'start_date' => $reservedPrice['start_date'],
                    'end_date' => $reservedPrice['end_date'],
                    'host_home_id' => $reservedPrice['host_home_id'],
                    'created_at' => $reservedPrice['created_at'],
                    'updated_at' => $reservedPrice['updated_at'],
                ];
            } else {
                $formattedPrices[] = $currentGroup;
                $currentGroup = [
                    [
                        'id' => $reservedPrice['id'],
                        'date' => $reservedPrice['date'],
                        'price' => $reservedPrice['price'],
                        'start_date' => $reservedPrice['start_date'],
                        'end_date' => $reservedPrice['end_date'],
                        'host_home_id' => $reservedPrice['host_home_id'],
                        'created_at' => $reservedPrice['created_at'],
                        'updated_at' => $reservedPrice['updated_at'],
                    ],
                ];
            }
        }

        if (!empty($currentGroup)) {
            $formattedPrices[] = $currentGroup;
        }

        return $formattedPrices;
    }

    protected function isConsecutiveReservedPrices($group, $reservedPrice)
    {
        $lastPrice = end($group);
        return $lastPrice['end_date'] === null && $lastPrice['date'] === date('Y-m-d', strtotime($reservedPrice['date'] . ' -1 day'));
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
