<?php

namespace App\Jobs;

use App\Events\NewNotificationEvent;
use App\Mail\ApartmentListingUpdateReview;
use App\Mail\CohostUpdateForHost;
use App\Mail\ApartmentUpdateFailedMail;
use App\Models\Cohost;
use App\Models\HostHome;
use App\Models\Hosthomediscount;
use App\Models\Hosthomerule;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class ProcessHostHomeUpdate implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $retryAfter = 5;
    public $timeout = 300;

    private $data;
    private $user;
    private $hostHomeId;
    private $lock;
    private $jobKey;

    public function __construct($data, $user, $hostHomeId, $lock)
    {
        $this->data = $data;
        $this->user = $user;
        $this->hostHomeId = $hostHomeId;
        $this->lock = $lock;
        $this->jobKey = "apartment_update_job_{$hostHomeId}";
    }

    public function handle()
    {
        Log::info("Starting apartment update", ['host_home_id' => $this->hostHomeId]);

        try {
            $this->updateProgress('started', 0);

            return DB::transaction(function () {
                $hostHome = HostHome::findOrFail($this->hostHomeId);
                $host = User::findOrFail($hostHome->user_id);
                
                $this->updateProgress('processing', 25);

                $this->updateBasicHostHome($hostHome);
                
                $this->updateProgress('processing', 50);

                $this->dispatchRelatedJobs($hostHome, $host);
                
                $this->updateProgress('processing', 75);
                
                $this->updateProgress('completed', 100);

                Log::info("Apartment update completed, related jobs dispatched", [
                    'host_home_id' => $this->hostHomeId,
                ]);
                
                return $hostHome;
            }, 1);
        } catch (Throwable $exception) {
            $this->handleError($exception);
            throw $exception;
        } finally {
            $this->lock->release();
        }
    }

    private function updateProgress($status, $percentage)
    {
        Cache::put($this->jobKey, [
            'status' => $status,
            'percentage' => $percentage,
            'updated_at' => now(),
        ], now()->addHours(24));
    }

    private function updateBasicHostHome($hostHome)
    {
        $this->validateData();
        
        $price = $this->data['price'];
        $service_fee = 0;
        $tax = 0;
        $total = $price + $service_fee + $tax;

        $hostHomeData = [
            'property_type' => $this->data['property_type'],
            'guest_choice' => $this->data['guest_choice'],
            'address' => $this->data['address'],
            'guests' => $this->data['guest'],
            'bedroom' => $this->data['bedrooms'],
            'beds' => $this->data['beds'],
            'bathrooms' => $this->data['bathrooms'],
            'title' => $this->data['title'],
            'description' => $this->data['description'],
            'disapproved' => null,
            'reservation' => $this->data['reservation'],
            'actualPrice' => $price,
            'check_out_time' => $this->data['check_out_time'],
            'host_type' => $this->data['host_type'],
            'check_in_time' => $this->data['checkin'],
            'service_fee' => $service_fee,
            'tax' => $tax,
            'total' => $total,
            'verified' => 0,
            'cancellation_policy' => $this->data['cancelPolicy'],
            'security_deposit' => $this->data['securityDeposit']
        ];

        $hostHome->update($hostHomeData);

        if ($hostHome->bookingCount < 3 && $this->hasNewListingPromotionDiscount($hostHome)) {
            $priceDiscount = intval($hostHome->actualPrice) * 0.2;
            $newPrice = intval($hostHome->actualPrice) - $priceDiscount;
            $hostHome->update(['price' => $newPrice]);
        } else {
            $hostHome->update(['price' => $price]);
        }

        if (!empty($this->data['additionalRules'])) {
            Hosthomerule::updateOrCreate(
                ['host_home_id' => $hostHome->id],
                ['rule' => $this->data['additionalRules']]
            );
        }
    }

    private function dispatchRelatedJobs($hostHome, $host)
    {
        $relatedJobs = [];
    
        if (!empty($this->data['hosthomevideo'])) {
            $relatedJobs[] = (new ProcessHostHomeVideo($this->data['hosthomevideo'], $hostHome->id))->onQueue('videos');
        }
    
        $relatedJobs[] = (new UpdateDescription($hostHome->id, $this->data['hosthomedescriptions']))->onQueue('details');
        $relatedJobs[] = (new ProcessHostHomeImages($this->data['hosthomephotos'], $hostHome->id))->onQueue('images');
        $relatedJobs[] = (new UpdateOffer($hostHome->id, $this->data['amenities']))->onQueue('details');
        $relatedJobs[] = (new UpdateReservation($hostHome->id, $this->data['reservations']))->onQueue('details');
        $relatedJobs[] = (new UpdateDiscount($hostHome->id, $this->data['discounts']))->onQueue('details');
        $relatedJobs[] = (new UpdateRule($hostHome->id, $this->data['rules']))->onQueue('details');
        $relatedJobs[] = (new UpdateNotice($hostHome->id, $this->data['notice']))->onQueue('details');
    
        // Ensure handleNotificationsAndEmails runs after the other jobs
        $relatedJobs[] = (new FinalizeHostHomeUpdate($hostHome, $host, $this->user))->onQueue('notifications');
    
        // Dispatch the chain of jobs
        Bus::chain($relatedJobs)->dispatch();
    
        Log::info("Chained related update jobs", ['host_home_id' => $hostHome->id]);
    }
    

    private function clearCacheForAllUsers()
    {
        Cache::flush();
    }

    private function validateData()
    {
        $required = [
            'property_type', 'guest_choice', 'address', 'guest', 'bedrooms', 
            'beds', 'bathrooms', 'title', 'description', 'reservation', 
            'price', 'check_out_time', 'host_type', 'checkin', 
            'cancelPolicy', 'securityDeposit'
        ];
        
        foreach ($required as $field) {
            if (!isset($this->data[$field])) {
                throw new \InvalidArgumentException("Missing required field: {$field}");
            }
        }
    }

    private function hasNewListingPromotionDiscount($hostHome)
    {
        return Hosthomediscount::where('host_home_id', $hostHome->id)
            ->where('discount', '20% New listing promotion')
            ->exists();
    }

    public function handleError(Throwable $exception)
    {
        Log::error("Apartment update job failed completely", [
            'host_home_id' => $this->hostHomeId,
            'error' => $exception->getMessage()
        ]);
        
        $hostHome = HostHome::find($this->hostHomeId);
        $host = User::find($hostHome->user_id);
        Mail::to($host->email)->queue(new ApartmentUpdateFailedMail($host));
        
        Notification::create([
            'user_id' => $host->id,
            'Message' => 'We encountered an issue while updating your listing. Our team has been notified and will look into it.'
        ]);

        $this->updateProgress('failed', 0);
        $this->lock->release();
    }
}