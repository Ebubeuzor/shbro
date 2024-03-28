<?php

namespace App\Jobs;

use App\Models\Hosthomenotice;
use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Validator;

class ProcessNotice implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(
        private $notice,
        private $hostHomeId
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
        $noticeData = ['notice' => $this->notice, 'host_home_id' => $this->hostHomeId];
        $this->createNotices($noticeData);
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
    
        return Hosthomenotice::create($data2);
        
    }
}
