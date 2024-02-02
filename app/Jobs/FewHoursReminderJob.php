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

class FewHoursReminderJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $booking;

    public function __construct($booking)
    {
        $this->booking = $booking;
    }

    public function handle()
    {
        
        Log::info("ebubestart3");
        // Check if today is the check-in day
        $hosthome = HostHome::find($this->booking->host_home_id);

        // Convert the check-in time to 24-hour format
        $checkInTime = Carbon::parse($hosthome->check_in_time)->format('H:i');

        // Calculate the check-in date and time
        $checkInDateTime = Carbon::parse($this->booking->check_in)->setTimeFromTimeString($checkInTime);
        $now = Carbon::now();

        // Calculate the time difference in hours between now and the check-in time
        $hoursDifference = $now->diffInHours($checkInDateTime);
        
        // Check if today is the check-in day and it's within the specified hours before check-in
        if ($checkInDateTime->isSameDay($now) && $hoursDifference > 0 && $hoursDifference <= 5 && is_null($this->booking->fewHoursReminder)) {
            // Perform actions for the few hours reminder
            Mail::to($this->booking->user->email)->send(new NotificationMail(
                $this->booking->user,
                "Reminder: Your check-in is in a few hours",
                "Your check-in is approaching. Safe travels!"
            ));

            // Update the booking with the few hours reminder timestamp
            $this->booking->update([
                'fewHoursReminder' => now(),
            ]);
        }
    }
}
