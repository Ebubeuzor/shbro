<?php

namespace App\Jobs;

use App\Models\HostHome;
use App\Models\Hosthomereservation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Validator;

class UpdateReservation implements ShouldQueue
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
        private array $reservations,
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
        $this->updateReservations($this->hostHomeId, $this->reservations);
    }

    private function updateReservations($hosthome, array $reservations)
    {

        $getHostHome = HostHome::find($hosthome);
        
        $getHostHome->hosthomereservations()->delete();

        foreach ($reservations as $reservation) {
            $hosthomedescriptionData = ['reservation' => $reservation, 'host_home_id' => $hosthome];
            $this->createReservations($hosthomedescriptionData);
        }
    }

    
    public function createReservations($data)
    {
        // Validate the input data
        $validator = Validator::make($data, [
            'reservation' => 'string',
            'host_home_id' => 'exists:App\Models\HostHome,id'
        ]);

        // Check for validation errors
        if ($validator->fails()) {
            // Handle validation errors, you can return a response or throw an exception
            return response(['error' => $validator->errors()], 422);
        }

        $data2 = $validator->validated();

        return Hosthomereservation::create($data2);
        
    }


}
