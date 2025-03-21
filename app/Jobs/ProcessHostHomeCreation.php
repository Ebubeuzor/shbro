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
    public $timeout = 900;
    
    private $data;
    private $userId;
    private $jobKey;
    private $lock;
    private $video;
    private array $images;

    public function __construct(array $hostHomeData,$userId, $video, array $images, $lock)
    {
        $this->data = $hostHomeData;
        $this->video = $video;
        $this->userId = $userId;
        $this->images = $images;
        $this->jobKey = "apartment_creation_job_{$userId}";
        $this->lock = $lock;
    }

    public function handle()
    {
        Log::info("Starting apartment creation", ['user_id' => $this->userId]);

        info([
            "images" => $this->images,
            "video" => $this->video
        ]);

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
            $this->failed($exception);
            throw $exception;
            $this->lock->release();
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
            'check_in_time' => $this->data['checkin'],
            'cancellation_policy' => $this->data['cancelPolicy'],
            'security_deposit' => $this->data['securityDeposit'],
            'longitude' => $this->data['longitude'],
            'latitude' => $this->data['latitude'],
            'service_fee' => 0,
            'tax' => 0,
            'total' => 0,
        ]);
    }

    private function dispatchRelatedJobs($hostHome, $host, $user, $cohost)
    {
        // Create individual jobs
        $videoJob = new ProcessHostHomeVideo($this->video, $hostHome->id);
        $imageJob = new ProcessHostHomeImages($this->images, $hostHome->id);
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
            'price', 'check_out_time', 'checkin', 'longitude', 'latitude',
            'cancelPolicy', 'securityDeposit'
        ];
        
        foreach ($required as $field) {
            if (!isset($this->data[$field])) {
                throw new \InvalidArgumentException("Missing required field: {$field}");
            }
        }
    }

    public function failed(Throwable $exception)
    {
        Log::error("Apartment creation job failed completely", [
            'user_id' => $this->userId,
            'error' => $exception->getMessage()
        ]);
        
        $user = User::find($this->userId);
        Mail::to($user->email)->send(new ApartmentCreationFailedMail($user));
        
        // Create a notification for the user
        // Assuming you have a Notification model
        Notification::create([
            'user_id' => $this->userId,
            'Message' => 'We encountered an issue while creating your listing. Our team has been notified and will look into it.'
        ]);

        $this->updateProgress('failed', 0);
        $this->lock->release();
    }
    
}