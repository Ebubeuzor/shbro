<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Resources\Json\JsonResource;

class HostTransactionHistoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        
        $guest = User::find($this->user_id);

        return [
            "transactionID" => $this->paymentId,
            "hostname" => $guest->name,
            'paidHostdate' => $this->paidHostdate,
            'amountToHost' => $this->hostBalance,
            "amountForOneNight" => $this->priceForANight,
            "paymentAmount" => $this->totalamount,
            'paymentforHostId' => $this->paidHostPaymentId,
            "duration_of_stay" => $this->duration_of_stay,
            "serviceFee" => $this->host_service_charge ?? 0,
            "serviceFeePercentage" => $this->host_service_charge_percentage ?? 0,
        ];
    }
}
