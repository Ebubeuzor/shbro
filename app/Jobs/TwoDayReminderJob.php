<?php

namespace App\Jobs;

use App\Mail\NotificationMail;
use App\Mail\TwoDaysReminder;
use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class TwoDayReminderJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    
    protected $booking;

    public function __construct($booking)
    {
        $this->booking = $booking;
    }

    public function handle()
    {
        
        // Check if today is two days before the check-in day
        $checkInDate = Carbon::parse($this->booking->check_in);
        $twoDaysBefore = Carbon::today()->addDays(2);

        if ($checkInDate->isSameDay($twoDaysBefore) && is_null($this->booking->twoDayReminder)) {
            Mail::to($this->booking->user->email)->queue(new TwoDaysReminder(
                $this->booking->user,
                "You have a booking in 2 days. Get ready!"
            ));

            $updateBookingData = Booking::find($this->booking->id);
            $updateBookingData->update(
                [
                    'twoDayReminder' => now()
                ]
            );
        }
    }
}
