<?php

namespace App\Jobs;

use App\Mail\NotificationMail;
use App\Models\HostHome;
use App\Models\Pendingreview;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class CheckOutNotificationJob implements ShouldQueue
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

        // Convert the check-out time to 24-hour format
        $checkOutTime = Carbon::parse($this->booking->check_out_time)->format('H:i A');

        // Check if today is the check-out day
        $checkOutDate = Carbon::parse($this->booking->check_out . ' ' . $checkOutTime);
        $today = Carbon::today();

        if ($checkOutDate->isSameDay($today) && is_null($this->booking->checkOutNotification)) {
            // Perform actions for the check-in notification
            Mail::to($this->booking->user->email)->send(new NotificationMail(
                $this->booking->user,
                "Check-out: You've been checked out",
                "You've been checked out"
            ));
            
            $pendingReviews = new Pendingreview();
            $pendingReviews->user_id = $this->booking->user_id;
            $pendingReviews->host_id = $this->booking->host_id;
            $pendingReviews->host_home_id = $this->booking->host_home_id;
            $pendingReviews->save();
            // Update the booking with the check-in notification timestamp
            $this->booking->update([
                'checkOutNotification' => now(),
            ]);

            
        }
    }
}
