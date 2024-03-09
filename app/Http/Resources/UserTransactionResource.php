<?php

namespace App\Http\Resources;

use App\Models\HostHome;
use App\Models\User;
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
        $host = User::find($this->hostId);
        $guest = User::find($this->user_id);
        $hostHome = HostHome::find($this->host_home_id);

        return [
            "id" => $this->id,
            "duration_of_stay" => $this->duration_of_stay,
            "description" => $hostHome->description,
            "paymentMethod" => $this->paymentType,
            "transactionID" => $this->paymentId,
            "hostname" => $host->name,
            "guest_name" => $guest->name,
            "amountForOneNight" => $this->priceForANight,
            "serviceFee" => $this->host_service_charge ?? 0,
            "hosthomebeds" => $hostHome->beds ?? 0,
            "propertyName" => $hostHome->title ?? 0,
            "securityFee" => $this->securityDeposit ?? 0,
            "propertyID" => $this->host_home_id ?? 0,
            "paymentAmount" => $this->totalamount ?? 0,
            'amountToHost' => $this->hostBalance ?? 0,
            "amountForOneNight" => $this->priceForANight ?? 0,
            'paidHostdate' => $this->paidHostdate ?? 0,
            "serviceFee" => $this->host_service_charge ?? 0,
            "serviceFeePercentage" => $this->host_service_charge_percentage ?? 0,
            'paymentDate' => Carbon::parse($this->created_at)->format('M j, Y'),
            'check_in' => Carbon::parse($this->check_in)->format('M j, Y'),
            'check_out' => Carbon::parse($this->check_out)->format('M j, Y'),
        ];
    }
}
