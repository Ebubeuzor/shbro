<?php

namespace App\Http\Resources;

use App\Models\HostHome;
use Illuminate\Http\Resources\Json\JsonResource;

class WishlistContainerItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $hostHome = HostHome::where('id',$this->host_home_id)
                    ->where('verified', 1)
                    ->whereNull('disapproved')
                    ->whereNull('banned')
                    ->whereNull('suspend')->first();

        // Check if $hostHome is not null before creating the resource
        if ($hostHome) {
            return [
                'id' => $this->id,
                'name' => $this->name,
                'hosthomes' => new HostHomeResource($hostHome),
            ];
        }

        // If $hostHome is null, return an empty array
        return [];
    }
}
