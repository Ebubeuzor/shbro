<?php

namespace App\Jobs;

use App\Models\Hosthomeoffer;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Validator;

class UpdateOffer implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;

    public $retryAfter = 5;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(
        private $hostHomeId,
        private array $amenities,
    )
    {
        //
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $this->updateOffers($this->hostHomeId, $this->amenities);
    }

    private function updateOffers($hosthome, array $amenities)
    {
        foreach ($amenities as $amenity) {
            
            $existingAmenity = Hosthomeoffer::where('host_home_id', $hosthome)
            ->where('offer', $amenity)
            ->first();
            
            if (!$existingAmenity) {
                $amenityData = ['offer' => $amenity, 'host_home_id' => $hosthome];
                $this->createOffers($amenityData);
            }

        }
    }

    
    public function createOffers($data)
    {
        // Validate the input data
        $validator = Validator::make($data, [
            'offer' => 'string',
            'host_home_id' => 'exists:App\Models\HostHome,id'
        ]);

        // Check for validation errors
        if ($validator->fails()) {
            // Handle validation errors, you can return a response or throw an exception
            return response(['error' => $validator->errors()], 422);
        }

        $data2 = $validator->validated();

        return Hosthomeoffer::create($data2);
    }

}
