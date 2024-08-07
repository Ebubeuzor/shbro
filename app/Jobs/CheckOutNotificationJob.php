<?php

namespace App\Jobs;

use App\Mail\GuestCheckedOut;
use App\Mail\NotificationMail;
use App\Models\HostHome;
use App\Models\HostPendingReview;
use App\Models\Hostpendingreviewforguest;
use App\Models\Pendingreview;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
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

        // Check if today is the check-out day
        $checkOutDate = Carbon::parse($this->booking->check_out);
        $today = Carbon::today();

        if ($checkOutDate->isSameDay($today) && is_null($this->booking->checkOutNotification)) {
            // Convert the check-out time to 24-hour format
            $checkOutTime = Carbon::parse($this->booking->check_out_time)->format('H:i');

            // Get the current time
            $currentTime = Carbon::now()->format('H:i A');

            // Check if it's time for the check-out notification
            if ($currentTime >= $checkOutTime) {
                info($this->booking);
                // Perform actions for the check-out notification
                Mail::to($this->booking->user->email)->queue(new GuestCheckedOut(
                    $this->booking->user,
                    "You've been checked out"
                ));

                // Create a pending review
                $pendingReviews = new Pendingreview();
                $pendingReviews->booking_id = $this->booking->id;
                $pendingReviews->user_id = $this->booking->user_id;
                $pendingReviews->host_id = $this->booking->hostId;
                $pendingReviews->host_home_id = $this->booking->host_home_id;
                $pendingReviews->save();
                
                $hostPendingReviews = new Hostpendingreviewforguest();
                $hostPendingReviews->booking_id = $this->booking->id;
                $hostPendingReviews->user_id = $this->booking->hostId;
                $hostPendingReviews->guest_id = $this->booking->user_id;
                $hostPendingReviews->host_home_id = $this->booking->host_home_id;
                $hostPendingReviews->save();

                // Update the booking with the check-out notification timestamp
                $this->booking->update([
                    'checkOutNotification' => now(),
                ]);
            }
        }

    }



}
