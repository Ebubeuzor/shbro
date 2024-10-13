<?php

namespace App\Jobs;

use App\Models\Hosthomerule;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessHostHomeDetails implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $data;
    private $hostHomeId;

    public function __construct($data, $hostHomeId)
    {
        $this->data = $data;
        $this->hostHomeId = $hostHomeId;
    }

    public function handle()
    {
        // Process additional rules
        if (!empty(trim($this->data['additionalRules'] ?? ''))) {
            Hosthomerule::create([
                'rule' => $this->data['additionalRules'],
                'host_home_id' => $this->hostHomeId
            ]);
        }
        
        // Process other related data
        $relatedData = [
            'amenities' => ProcessOffer::class,
            'hosthomedescriptions' => ProcessDescription::class,
            'reservations' => ProcessReservation::class,
            'discounts' => ProcessDiscount::class,
            'rules' => ProcessRule::class,
            'notice' => ProcessNotice::class,
        ];

        foreach ($relatedData as $key => $jobClass) {
            if (!empty($this->data[$key])) {
                foreach ($this->data[$key] as $item) {
                    $jobClass::dispatch($item, $this->hostHomeId)
                        ->onQueue('details')
                        ->delay(now()->addSeconds(2));
                }
            }
        }
    }
}