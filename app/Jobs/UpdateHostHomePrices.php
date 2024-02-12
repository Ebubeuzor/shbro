<?php

namespace App\Jobs;

use App\Models\HostHome;
use App\Models\Hosthomediscount;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class UpdateHostHomePrices implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle()
    {
        // Fetch all host homes
        $hostHomes = HostHome::all();

        foreach ($hostHomes as $hostHome) {
            // Get applicable discounts
            $discounts = HostHomeDiscount::where('host_home_id', $hostHome->id)->get();

            // Calculate the discounted price
            $discountedPrice = $this->calculateDiscountedPrice($hostHome->actualPrice, $discounts, $hostHome->bookingCount);

            // Update the host home with the new price
            $hostHome->update(['price' => max(0, $discountedPrice)]); // Ensure the discounted price is not negative
        }
    }

    private function calculateDiscountedPrice($actualPrice, $discounts, $bookingCount = 0)
    {
        $now = Carbon::now();

        foreach ($discounts as $discount) {
            if ($this->isDiscountApplicable($discount, $now)) {
                // Apply the discount based on the type and additional conditions
                return $this->applyDiscount($actualPrice, $discount, $bookingCount);
            }
        }

        // If no applicable discount, return the actual price
        return $actualPrice;
    }

    private function isDiscountApplicable($discount, $now)
    {
        // Check if the discount is still active based on created_at and updated_at
        return $now->greaterThanOrEqualTo($discount->created_at) && $now->lessThanOrEqualTo($discount->updated_at);
    }

    private function applyDiscount($price, $discount, $bookingCount = 0)
    {
        // Check the discount type and apply accordingly
        switch ($discount->discount) {
            case '20% New listing promotion':
                return $bookingCount <= 3 ? $price * (1 - 0.2) : $price; // 20% off for first 3 bookings
            case '5% Weekly discount':
                return $bookingCount >= 7 ? $price * (1 - 0.05) : $price; // 5% off for stays of 7 nights or more
            case '10% Monthly discount':
                return $bookingCount >= 28 ? $price * (1 - 0.1) : $price; // 10% off for stays of 28 nights or more
            default:
                return $price;
        }
    }
}
