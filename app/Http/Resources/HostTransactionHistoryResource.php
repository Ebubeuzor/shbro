<?php

namespace App\Http\Resources;

use App\Models\User;
use Carbon\Carbon;
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
        $host = User::find($this->hostId);

        return [
            "transactionID" => $this->paymentId,
            'paymentDate' => Carbon::parse($this->created_at)->format('M j, Y'),
            "guestid" => $guest->id,
            "hostid" => $host->id,
            "paymentStatus" => "Completed",
            "paymentDescription" => "Payment for apartment rental",
            "host_home_id" => $this->host_home_id,
            "paymentAmount" => $this->totalamount,
            'paymentforHostId' => $this->paidHostPaymentId,
            "duration_of_stay" => $this->duration_of_stay,
        ];
    }
}
