<?php

namespace App\Jobs;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;

class ClearCache implements ShouldQueue
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
        private $hostId
    )
    {
        
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $mainHost = User::find($this->hostId);

        $cohosts = $mainHost->cohosts()->with('user')->get();
        
        // Filter out duplicate co-hosts based on email
        $uniqueCohosts = $cohosts->unique('user.email');
        $this->clearUserHostHomesCache($mainHost->id);

        foreach ($uniqueCohosts as $cohost) {
            $this->clearUserHostHomesCache($cohost->user->id);
        }

        $this->clearCacheForAllUsers();
    }

    
    private function clearCacheForAllUsers()
    {
        Cache::flush();
    }
    
    public function clearUserHostHomesCache($userId)
    {
        $cacheKey = 'user_host_homes_' . $userId;
        if ($cacheKey) {
            Cache::forget($cacheKey);
        }
    }
}
