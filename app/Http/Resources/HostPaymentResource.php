<?php

namespace App\Http\Resources;

use App\Models\HostHome;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class HostPaymentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    
     public function toArray($request)
     {
         $host = User::find($this->hostId);
         $guest = User::find($this->user_id);
         $hostHome = HostHome::find($this->host_home_id);
 
         return [
             "id" => $this->id,
             "transactionID" => $this->paymentId,
             "hostname" => $host->name,
             "guestname" => $guest->name,
             "hosthomeid" => $hostHome->id,
             "propertyID" => $this->host_home_id,
             "paymentAmount" => $this->totalamount,
             'dateAndTime' => Carbon::parse($this->created_at)->format('M j, Y'),
         ];
     }
}
