<?php

namespace App\Jobs;

use App\Models\Hosthomedescription;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Validator;

class UpdateDescription implements ShouldQueue
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
        private array $hosthomedescriptions
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
        $this->updateDescriptions($this->hostHomeId, $this->hosthomedescriptions);
    }

    private function updateDescriptions($hosthomeid, array $hosthomedescriptions)
    {
        foreach ($hosthomedescriptions as $hosthomedescription) {
            // Check if a description with the same host_home_id and description content already exists
            $existingDescription = Hosthomedescription::where('host_home_id', $hosthomeid)
                ->where('description', $hosthomedescription)
                ->first();

            if ($existingDescription) {
                // Update existing description
                $existingDescription->update(['description' => $hosthomedescription]);
            } else {
                // Create new description
                $descriptionData = ['description' => $hosthomedescription, 'host_home_id' => $hosthomeid];
                $this->createDescriptions($descriptionData);
            }
        }

    }

    public function createDescriptions($data)
    {
        // Validate the input data
        $validator = Validator::make($data, [
            'description' => 'string',
            'host_home_id' => 'exists:App\Models\HostHome,id'
        ]);

        // Check for validation errors
        if ($validator->fails()) {
            // Handle validation errors, you can return a response or throw an exception
            return response(['error' => $validator->errors()], 422);
        }

        $data2 = $validator->validated();

        return Hosthomedescription::create($data2);
        
    }

}
