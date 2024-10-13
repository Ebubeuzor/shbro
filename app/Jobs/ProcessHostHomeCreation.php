<?php

namespace App\Jobs;

use App\Events\NewNotificationEvent;
use App\Mail\ApartmentCreationApprovalRequest;
use App\Mail\ApartmentCreationFailedMail;
use App\Mail\FirstHomeWelcomeMessageMail;
use App\Mail\NewApartmentpendingApproval;
use App\Mail\NotificationMail;
use App\Models\Cohost;
use App\Models\HostHome;
use App\Models\Hosthomerule;
use App\Models\Notification;
use App\Models\User;
use FFMpeg\FFMpeg;
use FFMpeg\Coordinate\Dimension;
use FFMpeg\Format\Video\X264;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Throwable;

class ProcessHostHomeCreation implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 1;
    public $maxExceptions = 1;
    public $timeout = 300;
    
    private $data;
    private $userId;
    private $jobKey;

    public function __construct($data, $userId)
    {
        $this->data = $data;
        $this->userId = $userId;
        $this->jobKey = "apartment_creation_job_{$userId}";
    }

    public function handle()
    {
        Log::info("Starting apartment creation", ['user_id' => $this->userId]);

        try {
            $this->updateProgress('started', 0);

            return DB::transaction(function () {
                // 1. Get user and host information
                $user = User::findOrFail($this->userId);
                $cohost = Cohost::where('user_id', $user->id)->first();
                $hostId = $cohost ? $cohost->host_id : $user->id;
                $host = User::findOrFail($hostId);
                
                $this->updateProgress('processing', 25);

                // 2. Create basic HostHome record
                $hostHome = $this->createBasicHostHome($host, $cohost);
                
                $this->updateProgress('processing', 50);

                // 3. Dispatch all related jobs
                $this->dispatchRelatedJobs($hostHome, $host, $user, $cohost);
                
                $this->updateProgress('completed', 100);

                Log::info("Basic apartment creation completed, related jobs dispatched", [
                    'user_id' => $this->userId,
                    'host_home_id' => $hostHome->id,
                ]);
                
                return $hostHome;
            }, 1);
        } catch (Throwable $exception) {
            $this->handleError($exception);
            throw $exception;
        } finally {
            Cache::lock($this->jobKey)->release();
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

    private function createBasicHostHome($host, $cohost)
    {
        $this->validateData();
        
        return HostHome::create([
            'user_id' => $cohost ? $cohost->host_id : $host->id,
            'property_type' => $this->data['property_type'],
            'guest_choice' => $this->data['guest_choice'],
            'address' => $this->data['address'],
            'guests' => $this->data['guest'],
            'bedroom' => $this->data['bedrooms'],
            'beds' => $this->data['beds'],
            'bathrooms' => $this->data['bathrooms'],
            'title' => $this->data['title'],
            'description' => $this->data['description'],
            'reservation' => $this->data['reservation'],
            'actualPrice' => $this->data['price'],
            'price' => 0,
            'check_out_time' => $this->data['check_out_time'],
            'host_type' => $this->data['host_type'],
            'check_in_time' => $this->data['checkin'],
            'cancellation_policy' => $this->data['cancelPolicy'],
            'security_deposit' => $this->data['securityDeposit'],
            'service_fee' => 0,
            'tax' => 0,
            'total' => 0,
        ]);
    }

    private function dispatchRelatedJobs($hostHome, $host, $user, $cohost)
    {
        // Create individual jobs
        $videoJob = new ProcessHostHomeVideo($this->data['hosthomevideo'], $hostHome->id);
        $imageJob = new ProcessHostHomeImages($this->data['hosthomephotos'], $hostHome->id);
        $detailsJob = new ProcessHostHomeDetails($this->data, $hostHome->id);
        $notificationJob = new ProcessHostHomeNotifications($hostHome->id, $this->userId, [
            'is_cohost' => $user->co_host,
            'host_id' => $host->id,
        ]);

        // Chain the jobs together and dispatch them in sequence
        $chain = [
            $videoJob->onQueue('videos'),
            $imageJob->onQueue('images'),
            $detailsJob->onQueue('details'),
            $notificationJob->onQueue('notifications')
        ];

        // Dispatch the chain
        dispatch($videoJob)
            ->chain($chain);

        Log::info("Dispatched video, image, details, and notification processing jobs in sequence", ['host_home_id' => $hostHome->id]);
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

    private function handleError(Throwable $exception)
    {
        Log::error("Failed to create apartment", [
            'user_id' => $this->userId,
            'error' => $exception->getMessage(),
        ]);
        
        $this->updateProgress('failed', 0);
    }

    public function failed(Throwable $exception)
    {
        Log::error("Apartment creation job failed completely", [
            'user_id' => $this->userId,
            'error' => $exception->getMessage()
        ]);
        
        $user = User::find($this->userId);
        Mail::to($user->email)->queue(new ApartmentCreationFailedMail($user));
        
        // Create a notification for the user
        // Assuming you have a Notification model
        Notification::create([
            'user_id' => $this->userId,
            'Message' => 'We encountered an issue while creating your listing. Our team has been notified and will look into it.'
        ]);

        $this->updateProgress('failed', 0);
        Cache::lock($this->jobKey)->release();
    }
    
}