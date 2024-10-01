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

    public $tries = 1; // Changed from 5 to 1
    public $maxExceptions = 1; // Changed from 3 to 1
    public $timeout = 600; // 10 minutes
    
    private $data;
    private $userId;
    private $attempt = 0;

    public function __construct($data, $userId)
    {
        $this->data = $data;
        $this->userId = $userId;
    }

    public function handle()
    {
        $this->attempt++;
        Log::info("Starting apartment creation attempt {$this->attempt}", [
            'user_id' => $this->userId,
        ]);

        try {

            return DB::transaction(function () {
                $user = User::findOrFail($this->userId);
                $cohost = Cohost::where('user_id', $user->id)->first();
                $hostId = $cohost ? $cohost->host_id : $user->id;
                $host = User::findOrFail($hostId);
                
                // Create and save the main HostHome record
                $hostHome = $this->createHostHome($host, $cohost);
                
                // Process video
                if (isset($this->data['hosthomevideo'])) {
                    $hostHome->video = $this->processVideo($this->data['hosthomevideo']);
                    $hostHome->save();
                }
                
                // Process all related data
                $this->processRelatedData($hostHome, $host, $user, $cohost);
                
                // Handle notifications and emails
                $this->handleNotifications($hostHome, $host, $user, $cohost);
                
                $this->clearAllCache();
                
                Log::info("Apartment creation completed successfully", [
                    'user_id' => $this->userId,
                    'host_home_id' => $hostHome->id,
                    'attempt' => $this->attempt
                ]);
                
                return $hostHome;
            }, 1); 
        } catch (Throwable $exception) {
            $this->handleError($exception);
            throw $exception;
        }finally {
            $this->clearAllCache();
        }
    }

    private function createHostHome($host, $cohost)
    {
        $this->validateData();
        
        $hostHome = new HostHome();
        $hostHome->user_id = $cohost ? $cohost->host_id : $host->id;
        $hostHome->property_type = $this->data['property_type'];
        $hostHome->guest_choice = $this->data['guest_choice'];
        $hostHome->address = $this->data['address'];
        $hostHome->guests = $this->data['guest'];
        $hostHome->bedroom = $this->data['bedrooms'];
        $hostHome->beds = $this->data['beds'];
        $hostHome->bathrooms = $this->data['bathrooms'];
        $hostHome->title = $this->data['title'];
        $hostHome->description = $this->data['description'];
        $hostHome->reservation = $this->data['reservation'];
        $hostHome->actualPrice = $this->data['price'];
        $hostHome->price = 0;
        $hostHome->check_out_time = $this->data['check_out_time'];
        $hostHome->host_type = $this->data['host_type'];
        $hostHome->check_in_time = $this->data['checkin'];
        $hostHome->cancellation_policy = $this->data['cancelPolicy'];
        $hostHome->security_deposit = $this->data['securityDeposit'];
        $hostHome->service_fee = 0;
        $hostHome->tax = 0;
        $hostHome->total = 0;
        
        $hostHome->save();
        
        return $hostHome;
    }

    private function processVideo($videoBase64)
    {
        try {
            // Save the original video
            $originalPath = $this->saveVideo($videoBase64);
            
            // Convert and compress the video
            $processedPath = $this->convertAndCompressVideo($originalPath);
            
            // Clean up the original file
            File::delete(public_path($originalPath));
            
            return $processedPath;
        } catch (Throwable $e) {
            Log::error("Video processing failed: " . $e->getMessage());
            throw $e;
        }
    }

    private function saveVideo($video)
    {
        if (!preg_match('/^data:video\/(\w+);base64,/', $video, $matches)) {
            throw new \Exception('Invalid video format');
        }

        $videoData = substr($video, strpos($video, ',') + 1);
        $videoType = strtolower($matches[1]);
        $decodedVideo = base64_decode($videoData);

        $dir = 'videos/';
        $file = Str::random() . '.' . $videoType;
        $absolutePath = public_path($dir);
        $relativePath = $dir . $file;

        if (!File::exists($absolutePath)) {
            File::makeDirectory($absolutePath, 0755, true);
        }

        file_put_contents($absolutePath . $file, $decodedVideo);

        return $relativePath;
    }

    private function convertAndCompressVideo($relativePath)
    {
        $absolutePath = public_path($relativePath);
        $ffmpeg = FFMpeg::create([
            'ffmpeg.binaries'  => '/usr/bin/ffmpeg',
            'ffprobe.binaries' => '/usr/bin/ffprobe',
            'timeout'          => 3600,
            'ffmpeg.threads'   => 12,
        ]);

        $video = $ffmpeg->open($absolutePath);
        $format = new X264();

        // Improved settings for better quality
        $format->setKiloBitrate(2000)  // Higher bitrate for better quality
               ->setAudioCodec("aac")
               ->setAudioKiloBitrate(192);  // Better audio quality

        // Resize video while maintaining aspect ratio
        $video->filters()
              ->resize(new Dimension(1280, 720), 'preserve_aspect_ratio')
              ->synchronize();

        $newPath = public_path('videos/' . Str::random() . '.mp4');
        $video->save($format, $newPath);

        return 'videos/' . basename($newPath);
    }

    private function processRelatedData($hostHome, $host, $user, $cohost)
    {
        // Process additional rules
        if (!empty(trim($this->data['additionalRules'] ?? ''))) {
            Hosthomerule::create([
                'rule' => $this->data['additionalRules'],
                'host_home_id' => $hostHome->id
            ]);
        }

        // Dispatch jobs for processing related data
        $this->dispatchRelatedJobs($hostHome);
    }

    private function dispatchRelatedJobs($hostHome)
    {
        // Images
        foreach ($this->data['hosthomephotos'] as $base64Image) {
            ProcessImage::dispatch($base64Image, $hostHome->id)->delay(now()->addSeconds(5));
        }
        
        // Amenities
        foreach ($this->data['amenities'] as $amenity) {
            ProcessOffer::dispatch($amenity, $hostHome->id)->delay(now()->addSeconds(2));
        }
        
        // Other related data
        $relatedData = [
            'hosthomedescriptions' => ProcessDescription::class,
            'reservations' => ProcessReservation::class,
            'discounts' => ProcessDiscount::class,
            'rules' => ProcessRule::class,
            'notice' => ProcessNotice::class,
        ];

        foreach ($relatedData as $key => $jobClass) {
            if (!empty($this->data[$key])) {
                foreach ($this->data[$key] as $item) {
                    $jobClass::dispatch($item, $hostHome->id)->delay(now()->addSeconds(2));
                }
            }
        }
    }

    private function handleNotifications($hostHome, $host, $user, $cohost)
    {
        if (!$cohost) {
            $this->sendHostNotification($host, $hostHome);
        }

        if ($user->co_host) {
            $this->handleCohostApproval($hostHome, $host, $user);
        }

        $this->handleFirstHomeNotification($host);
        $this->notifyCohosts($host, $hostHome);
        $this->notifyAdmins($hostHome, $host, $user);
    }

    private function sendHostNotification($host, $hostHome)
    {
        $message = "Your listing has been created and is awaiting admin approval";
        $title = "Listing Created Successfully.";
        
        Mail::to($host->email)->queue(new NewApartmentpendingApproval($host, $hostHome, $title));
        
        $notification = Notification::create([
            'user_id' => $host->id,
            'Message' => $message
        ]);
        
        event(new NewNotificationEvent($notification, $notification->id, $host->id));
    }

    private function handleCohostApproval($hostHome, $host, $user)
    {
        $hostHome->update([
            'approvedByHost' => false,
            'needApproval' => true
        ]);
        
        Mail::to($host->email)->queue(new ApartmentCreationApprovalRequest($hostHome, $host, $user));
    }

    private function handleFirstHomeNotification($host)
    {
        $isFirstHome = $host->hosthomes->isEmpty();
        if ($isFirstHome && $host->host == 0) {
            $host->host = 1;
            $host->save();
            
            Mail::to($host->email)->queue(new FirstHomeWelcomeMessageMail($host));
        }
    }

    private function notifyCohosts($host, $hostHome)
    {
        if ($host->hostcohosts()->exists()) {
            $coHosts = $host->hostcohosts()->with('user')->get()->unique('user.email');
            
            foreach ($coHosts as $coHost) {
                CreateHomesForCohosts::dispatch($coHost->user_id, $coHost->host_id, $hostHome->id);
            }
        }
    }

    private function notifyAdmins($hostHome, $host, $user)
    {
        if (!$user->co_host) {
            $title = "New Apartment Created: Admin Action Required";
            User::whereNotNull('adminStatus')
                ->chunk(100, function ($admins) use ($hostHome, $title, $host) {
                    NotifyAdmins::dispatch($admins, $hostHome, $host, $title);
                });
        }
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
            'attempt' => $this->attempt,
            'error' => $exception->getMessage(),
            'trace' => $exception->getTraceAsString()
        ]);
        
        $this->storeProgress();
    }

    private function storeProgress()
    {
        $key = "apartment_progress_{$this->userId}";
        Cache::put($key, [
            'data' => $this->data,
            'progress' => $this->attempt,
            'timestamp' => now()
        ], now()->addHours(24));
    }

    public function failed(Throwable $exception)
    {
        Log::error("Apartment creation job failed completely", [
            'user_id' => $this->userId,
            'error' => $exception->getMessage()
        ]);
        
        $user = User::find($this->userId);
        Mail::to($user->email)->queue(new ApartmentCreationFailedMail($user));
        
        // You might want to create a notification here as well
        Notification::create([
            'user_id' => $this->userId,
            'Message' => 'We encountered an issue while creating your listing. Our team has been notified and will look into it.'
        ]);
    }

    private function clearAllCache()
    {
        Cache::clear();
    }
}