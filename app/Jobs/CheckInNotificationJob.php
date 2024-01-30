<?php

namespace App\Jobs;

use App\Mail\NotificationMail;
use App\Models\Booking;
use App\Models\HostHome;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class CheckInNotificationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $booking;

    public function __construct($booking)
    {
        $this->booking = $booking;
    }

    public function handle()
    {
        $hosthome = HostHome::find($this->booking->host_home_id);
        
        
        $checkInDate = Carbon::parse($this->booking->check_in);
        $today = Carbon::today();
        
        if ($checkInDate->isSameDay($today) && is_null($this->booking->checkInNotification)) {
            // Perform actions for the check-in notification
            $checkInTime = Carbon::parse($hosthome->check_in_time)->format('H:i');

            // Get the current time
            $currentTime = Carbon::now()->format('H:i A');
            if ($currentTime >= $checkInTime) {
                
                Mail::to($this->booking->user->email)->send(new NotificationMail(
                    $this->booking->user,
                    "Check-in: You've been checked in",
                    "You've been checked in. Enjoy your stay!"
                ));
    
                // Update the booking with the check-in notification timestamp
                $this->booking->update([
                    'checkInNotification' => now(),
                ]);
            }
        }
    }

}
