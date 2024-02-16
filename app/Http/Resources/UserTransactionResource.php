<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class UserTransactionResource extends JsonResource
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
            "id" => $this->id,
            "transactionID" => $this->paymentId,
            "propertyID" => $this->host_home_id,
            "paymentAmount" => $this->totalamount,
            'check_in' => Carbon::parse($this->check_in)->format('M j, Y'),
            'check_out' => Carbon::parse($this->check_out)->format('M j, Y'),
        ];
    }
}
