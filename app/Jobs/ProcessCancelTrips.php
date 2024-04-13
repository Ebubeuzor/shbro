<?php

namespace App\Jobs;

use App\Models\Canceltrip;
use App\Models\UserWallet;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessCancelTrips implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    
    public function handle()
    {
        // Retrieve all cancel trips records
        $cancelTrips = Canceltrip::whereNull('addedToHostWallet')
            ->whereNull('addedToGuestWallet')
            ->get();

        // Process each cancel trip record
        foreach ($cancelTrips as $cancelTrip) {
            // Update host's wallet balance
            $this->updateUserWallet($cancelTrip->host_id, $cancelTrip->host_refund);

            // Update guest's wallet balance
            $this->updateUserWallet($cancelTrip->user_id, $cancelTrip->guest_refund);

            // Update cancel trip record with wallet status
            $cancelTrip->addedToHostWallet = 'Yes';
            $cancelTrip->addedToGuestWallet = 'Yes';
            $cancelTrip->save();
        }
    }

    private function updateUserWallet($userId, $amount)
    {
        // Find or create user's wallet
        $wallet = UserWallet::firstOrNew(['user_id' => $userId]);

        // If wallet doesn't exist, create it
        if (!$wallet->exists) {
            $wallet->totalbalance = 0; // Set initial balance to 0 or any other default value
        }

        // Update wallet balance
        $wallet->totalbalance += $amount;
        $wallet->save();
    }
}
