<?php

namespace App\Jobs;

use App\Models\HostHome;
use App\Models\Hosthomediscount;
use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Validator;

class ProcessDiscount implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(
        private $discount,
        private $hostHomeId
    )
    {
        
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $discountData = ['discount' => $this->discount, 'host_home_id' => $this->hostHomeId];
        $this->createDiscounts($discountData);
    }

    private function createDiscounts($data)
    {
        // Validate the input data
        $validator = Validator::make($data, [
            'discount' => 'required|string',
            'host_home_id' => 'required|exists:host_homes,id'
        ]);

        // Check for validation errors
        if ($validator->fails()) {
            // Handle validation errors, you can return a response or throw an exception
            return response(['error' => $validator->errors()], 422);
        }

        // Get the validated data
        $data2 = $validator->validated();

        // Find the HostHome
        $hostHome = HostHome::find($data2['host_home_id']);

        // Check the discount type
        if ($data2['discount'] == "20% New listing promotion") {
            $priceDiscount = intval($hostHome->actualPrice) * 0.2;
            $price = intval($hostHome->actualPrice) - $priceDiscount;
            $hostHome->price = $price;
        } else {
            // Reset to the actual price if not a special discount
            $hostHome->price = $hostHome->actualPrice;
        }

        // Calculate service fee and tax (you can adjust these calculations based on your business logic)
        $service_fee_percentage = 0.10;
        $tax_percentage = 0.05;

        $service_fee = $hostHome->price * $service_fee_percentage;
        $tax = $hostHome->price * $tax_percentage;

        // Update the HostHome attributes
        $hostHome->service_fee = $service_fee;
        $hostHome->tax = $tax;
        $hostHome->total = $hostHome->price + $service_fee + $tax;

        // Save the updated HostHome
        $hostHome->save();

        // Check if a discount with the same host_home_id already exists
        $existingDiscount = Hosthomediscount::where('host_home_id', $data2['host_home_id'])
            ->where('discount', $data2['discount'])
            ->first();

        // Create or update the HostHomeDiscount record
        if ($existingDiscount) {
            // Update existing discount
            $existingDiscount->update($data2);
            return $existingDiscount;
        } else {
            // Create new discount
            return HostHomeDiscount::create($data2);
        }
    }
}
