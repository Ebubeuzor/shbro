<?php

namespace App\Listeners;

use App\Events\EmailVerified;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class GenerateTokenOnEmailVerification implements ShouldQueue
{
    use InteractsWithQueue;
    
    
    public function handle(EmailVerified $event)
    {
        $user = $event->user;

        // Generate token for the user
        $token = $user->createToken('main')->plainTextToken;

        // You can perform additional actions here if needed

        // Return the user and token or perform other actions
        return [
            'user' => $user,
            'token' => $token,
        ];
    }
}
