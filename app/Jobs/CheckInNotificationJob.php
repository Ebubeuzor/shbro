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
        
        // Convert the check-in time to 24-hour format
        $checkInTime = Carbon::parse($hosthome->check_in_time)->format('H:i');

        // Check if today is the check-in day
        $checkInDate = Carbon::parse($this->booking->check_in . ' ' . $checkInTime);
        $today = Carbon::today();

        if ($checkInDate->isSameDay($today) && is_null($this->booking->checkInNotification)) {
            // Perform actions for the check-in notification
            Mail::to($this->booking->user->email)->send(new NotificationMail(
                $this->booking->user,
                "Check-in: You've been checked in",
                "You've been checked in. Enjoy your stay!"
            ));
            Log::info($this->booking->id);

            // Update the booking with the check-in notification timestamp
            $this->booking->update([
                'checkInNotification' => now(),
            ]);
        }
    }

}
