<?php

namespace App\Jobs;

use App\Models\Hosthomecohost;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CreateHomesForCohosts implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(
        private $user_id,
        private $host_id,
        private $host_home_id,
        private $updateHostHome = null
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
        if ($this->updateHostHome == null) {
            Hosthomecohost::create([
                'user_id' => $this->user_id,
                'host_id' => $this->host_id,
                'host_home_id' => $this->host_home_id
            ]);
        }
        
    }
}
