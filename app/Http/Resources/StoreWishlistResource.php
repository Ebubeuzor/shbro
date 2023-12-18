<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class StoreWishlistResource extends JsonResource
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
            "containername" => 'string',
            'wishcontainerid' => 'exists:App\Models\Wishlistcontainer,id',
            'hosthomeid' => 'exists:App\Models\Hosthome,id',
        ];
    }
}
