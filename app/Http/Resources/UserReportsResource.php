<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Resources\Json\JsonResource;

class UserReportsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $reporter = User::find($this->user_id);
        $hostorguest = User::find($this->hostorguestuser_id);
        return [
            'id' => $this->id,
            'reasonforreporting' => $this->reasonforreporting,
            'extrareasonforreporting' => $this->extrareasonforreporting != null ? $this->extrareasonforreporting : "",
            'reporterName' => $reporter->name,
            'reporterEmail' => $reporter->email,
            'hostorguestName' => $hostorguest->name,
            'hostorguestEmail' => $hostorguest->email,
            'hostorguestId' => $hostorguest->id,
            'hostorguestStatus' => $hostorguest->host == 0 ? "Guest" : "Host And Guest",
        ];
    }
}
