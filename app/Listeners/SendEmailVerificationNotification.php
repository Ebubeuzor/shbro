<?php

namespace App\Listeners;

use App\Events\EmailVerified;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendEmailVerificationNotification implements ShouldQueue
{
    use InteractsWithQueue;
    public function handle($event)
    {
        if ($event instanceof MustVerifyEmail && ! $event->hasVerifiedEmail()) {
            $event->sendEmailVerificationNotification();
        }

        // Dispatch the EmailVerified event after email verification
        event(new EmailVerified($event));
    }
}
