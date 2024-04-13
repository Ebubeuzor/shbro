<?php

namespace App\Jobs;

use App\Models\Booking;
use App\Models\UserWallet;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessSecurityDeposit implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    
    public function handle()
    {
        $twentyFourHoursAgo = now()->subHours(24);

        // Retrieve bookings where paymentStatus is not null and pauseSecurityDepositToGuest is null,
        // and the checkOutNotification is 24 hours or more in the past
        $bookings = Booking::where('paymentStatus', 'success')
            ->where('checkOutNotification', '<=', $twentyFourHoursAgo)
            ->get();


        foreach ($bookings as $booking) {
            // Check if securityDepositToHost and pauseSecurityDepositToGuest are not null
            if (!is_null($booking->securityDepositToHost) && !is_null($booking->pauseSecurityDepositToGuest)&& is_null($booking->securityDepositToHostWallet)) {
                // Add security deposit to host
                $this->addToHostWallet($booking);
            } elseif(is_null($booking->pauseSecurityDepositToGuest) && is_null($booking->addedToGuestWallet)) {
                // Add security deposit to guest
                $this->addToGuestWallet($booking);
            }
        }
    }

    /**
     * Add security deposit to guest wallet.
     *
     * @param \App\Models\Booking $booking
     * @return void
     */
    protected function addToGuestWallet(Booking $booking)
    {
        
        $guestId = $booking->user_id;
        $securityDepositToGuest = $booking->securityDeposit;
        
        // Check if the money has already been added to the guest's account
        if ($booking->addedToGuestWallet) {
            return;
        }

        $userWallet = UserWallet::where('user_id', $guestId)->first();
        if ($userWallet) {
            // Update guest's wallet balance
            $userWallet->totalbalance += $securityDepositToGuest;
            $userWallet->save();
        } else {
            // Create a new wallet entry if it doesn't exist
            UserWallet::create([
                'user_id' => $guestId,
                'totalbalance' => $securityDepositToGuest,
            ]);
        }

        $booking->addedToGuestWallet = now();
        $booking->save();
    }

    protected function addToHostWallet(Booking $booking)
    {
        $hostId = $booking->hostId;
        $securityDepositToHost = $booking->securityDeposit;

        // Retrieve the host's wallet
        $userWallet = UserWallet::where('user_id', $hostId)->first();
        
        // Check if the host's wallet exists
        if ($userWallet) {
            // Update the host's wallet balance
            $userWallet->totalbalance += $securityDepositToHost;
            $userWallet->save();
        } else {
            // Create a new wallet entry if it doesn't exist
            UserWallet::create([
                'user_id' => $hostId,
                'totalbalance' => $securityDepositToHost,
            ]);
        }
        
        $booking->securityDepositToHostWallet = now();
        $booking->save();
    }
}