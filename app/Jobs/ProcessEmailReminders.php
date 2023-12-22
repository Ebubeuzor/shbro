<?php

namespace App\Jobs;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessEmailReminders implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    
    public function handle()
    {
        Log::info("Testing");

        $users = User::whereNull('email_verified_at')->get();
        
        
        foreach ($users as $user) {
            if ($user->google_id == null ) {
                SendEmailToUnverifiedUser::dispatch($user);
            }
        }
    }
}
