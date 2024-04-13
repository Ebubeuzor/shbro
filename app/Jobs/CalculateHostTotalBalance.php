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

class CalculateHostTotalBalance implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle()
    {
        // Calculate the timestamp 24 hours ago
        $twentyFourHoursAgo = now()->subHours(24);

        // Retrieve bookings with checkInNotification time more than 24 hours ago
        $expiredBookings = Booking::where('checkInNotification', '<=', $twentyFourHoursAgo)
            ->where('paymentStatus', 'success')
            ->whereNull('addedToHostWallet')
            ->get();

        // Calculate the total balance for each host
        $hostBalances = [];
        foreach ($expiredBookings as $booking) {
            $hostId = $booking->hostId;
            $hostBalance = $booking->hostBalance;

            // Add the host balance to the total
            if (!isset($hostBalances[$hostId])) {
                $hostBalances[$hostId] = 0;
            }
            $hostBalances[$hostId] += $hostBalance;

            // Mark the booking as added to host wallet
            $booking->addedToHostWallet = now();
            $booking->save();
        }

        // Update the total balance for each host in the user_wallets table
        foreach ($hostBalances as $hostId => $totalBalance) {
            $userWallet = UserWallet::where('user_id', $hostId)->first();
            if ($userWallet) {
                // Update the total balance
                $userWallet->totalbalance += $totalBalance;
                $userWallet->save();
            } else {
                // Create a new wallet entry if it doesn't exist
                UserWallet::create([
                    'user_id' => $hostId,
                    'totalbalance' => $totalBalance,
                ]);
            }
        }
    }
}
