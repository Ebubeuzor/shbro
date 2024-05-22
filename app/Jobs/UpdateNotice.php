<?php

namespace App\Jobs;

use App\Models\Hosthomenotice;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Validator;

class UpdateNotice implements ShouldQueue
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
        private array $notices,
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
        $this->updateNotices($this->hostHomeId, $this->notices);
    }

    private function updateNotices($hosthome, array $notices)
    {

        foreach ($notices as $notice) {
            $hosthomenoticeData = ['notice' => $notice, 'host_home_id' => $hosthome];
            $this->createNotices($hosthomenoticeData);
        }
    }

    public function createNotices($data)
    {
        // Validate the input data
        $validator = Validator::make($data, [
            'notice' => 'string',
            'host_home_id' => 'exists:App\Models\HostHome,id'
        ]);
    
        // Check for validation errors
        if ($validator->fails()) {
            // Handle validation errors, you can return a response or throw an exception
            return response(['error' => $validator->errors()], 422);
        }
    
        $data2 = $validator->validated();

        $existingNotice = Hosthomenotice::pluck("notice")->toArray();
    
        if(!in_array($data2['notice'], $existingNotice)){
            return Hosthomenotice::create($data2);
        }
        
    }
}
