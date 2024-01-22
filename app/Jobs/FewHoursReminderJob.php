<?php

namespace App\Jobs;

use App\Mail\NotificationMail;
use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
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
        // Check if today is the check-in day
        $checkInDate = Carbon::parse($this->booking->check_in);
        $today = Carbon::today();

        if ($checkInDate->isSameDay($today) && is_null($this->booking->fewHoursReminder)) {
            // Perform actions for the few hours reminder
            Mail::to($this->booking->user->email)->send(new NotificationMail(
                $this->booking->user,
                "Reminder: Your check-in is in a few hours",
                "Your check-in is approaching. Safe travels!"
            ));

            $updateBookingData = Booking::find($this->booking->id);
            $updateBookingData->update(
                [
                    'fewHoursReminder' => now(),
                ]
            );
        }
    }
}
