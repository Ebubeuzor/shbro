<?php

namespace App\Http\Resources;

use App\Models\Booking;
use App\Models\HostHome;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminDamageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $host = User::find($this->host_id);
        $booking = Booking::where('paymentId' , $this->booking_number)->first();
        $guest = User::find($booking->user_id);
        $hostHome = HostHome::find($booking->host_home_id);
        return [
            'id' => $this->id,
            'damage_description' => $this->damage_description,
            'reportDate' => Carbon::parse($this->created_at)->format('M j, Y'),
            'host' => [
                'id' => $host->id,
                'name' => $host->name,
                'email' => $host->email,
                'phone_number' => $host->phone,
            ],
            'hosthome' => [
                'id' => $hostHome->id,
                'address' => $hostHome->address,
                'description' => $hostHome->title,
                'checkin' => Carbon::parse($booking->check_in)->format('M j, Y'),
                'checkout' => Carbon::parse($booking->check_out)->format('M j, Y'),
            ],
            'guest' => [
                'id' => $guest->id,
                'name' => $guest->name,
                'email' => $guest->email,
                'phone_number' => $guest->phone,
            ],
            'images' => $this->imagesandvideo,
            'video' => $this->damageVideoUrls(),
        ];
    }
    protected function damagePhotosUrls()
    {
        return collect($this->imagesandvideo)->filter()->map(function ($photo) {
            $photoData = json_decode($photo, true);
            return [
                "id" => $photoData['id'],
                "images" => url($photoData['photos']),
            ];
        })->toArray();
    }

    protected function damageVideoUrls()
    {
        return collect($this->imagesandvideo)->filter()->map(function ($photo) {
            $photoData = json_decode($photo, true);
            return [
                "id" => $photoData['id'],
                "video" => url($photoData['video']),
            ];
        })->toArray();
    }
    
}
