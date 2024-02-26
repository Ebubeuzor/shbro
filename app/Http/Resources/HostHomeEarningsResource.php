<?php

namespace App\Http\Resources;

use App\Models\HostHome;
use Illuminate\Http\Resources\Json\JsonResource;

class HostHomeEarningsResource extends JsonResource
{
    public function toArray($request)
    {
        $hosthome = HostHome::find($this->resource['host_home_id']);

        return [
            'title' => $hosthome->title,
            'creationDate' => $hosthome->created_at->format('M j, Y'),
            'images' => $this->hosthomephotosUrls($this->resource['host_home_id']),
            'earnings' => $this->resource['summed_balance'],
        ];
    }

    protected function hosthomephotosUrls($host_home_id)
    {
        $hosthome = HostHome::find($host_home_id);

        return collect($hosthome->hosthomephotos)->map(function ($photo) {
            $photoData = json_decode($photo, true);

            return [
                "id" => $photoData['id'],
                "images" => url($photoData['image'])
            ];
        })->toArray();
    }
}
