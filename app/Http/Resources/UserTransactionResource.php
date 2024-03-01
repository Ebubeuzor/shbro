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
        $hostHome = HostHome::find($this->host_home_id);

        return [
            "id" => $this->id,
            "duration_of_stay" => $this->duration_of_stay,
            "description" => $hostHome->description,
            "paymentMethod" => $this->paymentType,
            "transactionID" => $this->paymentId,
            "hostname" => $host->name,
            "amountForOneNight" => $this->priceForANight,
            "serviceFee" => $this->host_service_charge ?? 0,
            "hosthomebeds" => $hostHome->beds,
            "propertyName" => $hostHome->title,
            "securityFee" => $this->securityDeposit,
            "propertyID" => $this->host_home_id,
            "paymentAmount" => $this->totalamount,
            'paymentDate' => Carbon::parse($this->created_at)->format('M j, Y'),
            'check_in' => Carbon::parse($this->check_in)->format('M j, Y'),
            'check_out' => Carbon::parse($this->check_out)->format('M j, Y'),
        ];
    }
}
