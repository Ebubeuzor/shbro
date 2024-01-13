<?php

namespace App\Jobs;

use App\Http\Controllers\Api\UserController;
use App\Mail\VerifyYourEmail;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendEmailToUnverifiedUser implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function handle()
    {

        try {
            
            if ($this->user->email_verified_at == null) {
                $deleteAttempts = $this->user->delete_attempts ?? 0;
                
                if ($deleteAttempts < 50000000) {
                    Mail::to($this->user->email)->send(new VerifyYourEmail($this->user));
                    $this->user->update(['delete_attempts' => $deleteAttempts + 1]);

                } else {
                    $this->user->forceDelete();
                }
            }

        } catch (\Exception $exception) {
            Log::error('Error processing SendEmailToUnverifiedUser job for user ' . $this->user->id . ': ' . $exception->getMessage());
        }
    }


}
