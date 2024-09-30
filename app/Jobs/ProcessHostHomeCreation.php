<?php

namespace App\Jobs;

use App\Events\NewNotificationEvent;
use App\Mail\ApartmentCreationApprovalRequest;
use App\Mail\FirstHomeWelcomeMessageMail;
use App\Mail\NewApartmentpendingApproval;
use App\Mail\NotificationMail;
use App\Models\Cohost;
use App\Models\HostHome;
use App\Models\Hosthomerule;
use App\Models\Notification;
use App\Models\User;
use FFMpeg\FFMpeg;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;

class ProcessHostHomeCreation implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $retryAfter = 5;
    
    public function __construct(
        private $data,
        private $userId
    )
    {
        //
    }

    public function handle()
    {
        Log::info('Starting ProcessHostHomeCreation job', ['user_id' => $this->userId]);

        try {
            $data = $this->data;
            $user = User::findOrFail($this->userId);
            $hostHome = new HostHome();

            $cohost = Cohost::where('user_id', $user->id)->first();

            $this->populateHostHome($hostHome, $data, $user, $cohost);

            $host = User::findOrFail($hostHome->user_id);
            $isFirstHome = $host->hosthomes->isEmpty(); 
            $hostStatus = $host->host;

            DB::beginTransaction();
            try {
                $hostHome->save();
                Log::info('HostHome saved successfully', ['host_home_id' => $hostHome->id]);

                $this->processRelatedData($hostHome, $data);

                $this->handleCohostScenario($user, $cohost, $host, $hostHome);
                $this->handleFirstHomeScenario($isFirstHome, $hostStatus, $host);
                $this->notifyAdmins($user, $hostHome, $host);

                DB::commit();
                Log::info('ProcessHostHomeCreation job completed successfully', ['host_home_id' => $hostHome->id]);
            } catch (\Exception $e) {
                DB::rollBack();
                Log::error('Error in DB transaction', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                throw $e;
            }
        } catch (\Exception $e) {
            Log::error('ProcessHostHomeCreation job failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    private function populateHostHome($hostHome, $data, $user, $cohost)
    {
        Log::info('Populating HostHome', ['user_id' => $user->id]);
        $hostHome->user_id = $cohost ? $cohost->host_id : $user->id;
        $hostHome->property_type = $data['property_type'];
        $hostHome->guest_choice = $data['guest_choice'];
        $hostHome->address = $data['address'];
        $hostHome->guests = $data['guest'];
        $hostHome->bedroom = $data['bedrooms'];
        $hostHome->beds = $data['beds'];
        $hostHome->bathrooms = $data['bathrooms'];
        $hostHome->video = $this->uploadBase64($data['hosthomevideo']);
        $hostHome->title = $data['title'];
        $hostHome->description = $data['description'];
        $hostHome->reservation = $data['reservation'];
        $hostHome->actualPrice = $data['price'];
        $hostHome->price = 0;
        $hostHome->check_out_time = $data['check_out_time'];
        $hostHome->host_type = $data['host_type'];
        $hostHome->check_in_time = $data['checkin'];
        $hostHome->cancellation_policy = $data['cancelPolicy'];
        $hostHome->security_deposit = $data['securityDeposit'];
        $hostHome->service_fee = 0;
        $hostHome->tax = 0;
        $hostHome->total = 0;
        Log::info('HostHome populated successfully');
    }

    private function processRelatedData($hostHome, $data)
    {
        Log::info('Processing related data', ['host_home_id' => $hostHome->id]);
        
        $this->processAmenities($hostHome, $data['amenities']);
        $this->processImages($hostHome, $data['hosthomephotos']);
        $this->processDescriptions($hostHome, $data['hosthomedescriptions']);
        $this->processReservations($hostHome, $data['reservations']);
        $this->processDiscounts($hostHome, $data['discounts']);
        $this->processRules($hostHome, $data['rules']);
        $this->processNotices($hostHome, $data['notice']);
        
        if(trim(isset($data['additionalRules']))){
            Hosthomerule::create([
                'rule' => $data['additionalRules'],
                'host_home_id' => $hostHome->id
            ]);
            Log::info('Additional rule created', ['host_home_id' => $hostHome->id]);
        }
        
        Log::info('Related data processed successfully', ['host_home_id' => $hostHome->id]);
    }

    private function processAmenities($hostHome, $amenities)
    {
        foreach ($amenities as $amenity) {
            ProcessOffer::dispatch($amenity, $hostHome->id);
        }
        Log::info('Amenities dispatched for processing', ['host_home_id' => $hostHome->id, 'count' => count($amenities)]);
    }

    private function processImages($hostHome, $images)
    {
        foreach ($images as $base64Image) {
            ProcessImage::dispatch($base64Image, $hostHome->id);
        }
        Log::info('Images dispatched for processing', ['host_home_id' => $hostHome->id, 'count' => count($images)]);
    }

    private function processDescriptions($hostHome, $descriptions)
    {
        foreach ($descriptions as $description) {
            ProcessDescription::dispatch($description, $hostHome->id);
        }
        Log::info('Descriptions dispatched for processing', ['host_home_id' => $hostHome->id, 'count' => count($descriptions)]);
    }

    private function processReservations($hostHome, $reservations)
    {
        foreach ($reservations as $reservation) {
            ProcessReservation::dispatch($reservation, $hostHome->id);
        }
        Log::info('Reservations dispatched for processing', ['host_home_id' => $hostHome->id, 'count' => count($reservations)]);
    }

    private function processDiscounts($hostHome, $discounts)
    {
        foreach ($discounts as $discount) {
            ProcessDiscount::dispatch($discount, $hostHome->id);
        }
        Log::info('Discounts dispatched for processing', ['host_home_id' => $hostHome->id, 'count' => count($discounts)]);
    }

    private function processRules($hostHome, $rules)
    {
        foreach ($rules as $rule) {
            ProcessRule::dispatch($rule, $hostHome->id);
        }
        Log::info('Rules dispatched for processing', ['host_home_id' => $hostHome->id, 'count' => count($rules)]);
    }

    private function processNotices($hostHome, $notices)
    {
        foreach ($notices as $notice) {
            ProcessNotice::dispatch($notice, $hostHome->id);
        }
        Log::info('Notices dispatched for processing', ['host_home_id' => $hostHome->id, 'count' => count($notices)]);
    }

    private function handleCohostScenario($user, $cohost, $host, $hostHome)
    {
        Log::info('Handling cohost scenario', ['user_id' => $user->id, 'host_id' => $host->id]);
        if (!$cohost) {
            $message = "Your listing has been created now awaiting admin approval";
            $title = "Listing Created Successfully.";
            Mail::to($host->email)->queue(new NewApartmentpendingApproval($host, $hostHome, $title));
            
            $notification = new Notification();
            $notification->user_id = $host->id;
            $notification->Message = $message;
            $notification->save();
            event(new NewNotificationEvent($notification, $notification->id, $host->id));
            Log::info('Notification created for host', ['host_id' => $host->id, 'notification_id' => $notification->id]);
        }

        if ($user->co_host == true) {
            $hostHome->update([
                'approvedByHost' => false,
                'needApproval' => true
            ]);
            Mail::to($host->email)->queue(new ApartmentCreationApprovalRequest($hostHome, $host, $user));
            $this->clearAllCache();
            Log::info('Cohost created listing, approval request sent', ['host_id' => $host->id, 'cohost_id' => $user->id]);
        }

        if ($host->hostcohosts()->exists()) {
            $coHosts = $host->hostcohosts()->with('user')->get();
            $uniqueCohosts = $coHosts->unique('user.email');
        
            foreach ($uniqueCohosts as $coHost) {
                CreateHomesForCohosts::dispatch($coHost->user_id, $coHost->host_id, $hostHome->id);
            }
            
            $this->clearAllCache();
            Log::info('Homes created for cohosts', ['host_id' => $host->id, 'cohost_count' => $uniqueCohosts->count()]);
        }
    }

    private function handleFirstHomeScenario($isFirstHome, $hostStatus, $host)
    {
        if ($isFirstHome && $hostStatus == 0) {
            $host->host = 1;
            $host->save();
            Mail::to($host->email)->queue(new FirstHomeWelcomeMessageMail($host));
            Log::info('First home created, host status updated', ['host_id' => $host->id]);
        }
    }

    private function notifyAdmins($user, $hostHome, $host)
    {
        if (!$user->co_host) {
            $chunkSize = 100;
            $title = "New Apartment Created: Admin Action Required";

            User::whereNotNull('adminStatus')->chunk($chunkSize, function ($admins) use ($hostHome, $title, $host) {
                try {
                    NotifyAdmins::dispatch($admins, $hostHome, $host, $title);
                    Log::info('Admin notification job dispatched', ['admin_count' => $admins->count()]);
                } catch (\Exception $e) {
                    Log::error("Failed to dispatch NotifyAdmins job", [
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString()
                    ]);
                }
            });
        }
    }

    public function clearAllCache()
    {
        Cache::clear();
        Log::info('All cache cleared');
    }

    public function uploadBase64($video)
    {
        Log::info('Starting base64 video upload');
        $videoBase64 = $video;
        $videoPath = $this->saveVideo($videoBase64);

        $convertedPath = $this->convertAndCompressVideo($videoPath);

        File::delete(public_path($videoPath));
        Log::info('Video uploaded and converted successfully', ['path' => $convertedPath]);

        return $convertedPath;
    }
    
    private function saveVideo($video)
    {
        Log::info('Saving video from base64');
        if (preg_match('/^data:video\/(\w+);base64,/', $video, $matches)) {
            $videoData = substr($video, strpos($video, ',') + 1);
            $videoType = strtolower($matches[1]);

            $decodedVideo = base64_decode($videoData);
        } else {
            Log::error('Invalid video format');
            throw new \Exception('Invalid video format');
        }

        $dir = 'videos/';
        $file = Str::random() . '.' . $videoType;
        $absolutePath = public_path($dir);
        $relativePath = $dir . $file;

        if (!File::exists($absolutePath)) {
            if (!File::makeDirectory($absolutePath, 0755, true)) {
                Log::error('Failed to create directory', ['path' => $absolutePath]);
                throw new \Exception('Failed to create directory: ' . $absolutePath);
            }
        }

        $filePath = $absolutePath . '/' . $file;
        if (!file_put_contents($filePath, $decodedVideo)) {
            Log::error('Failed to save video', ['path' => $filePath]);
            throw new \Exception('Failed to save video');
        }

        Log::info('Video saved successfully', ['path' => $relativePath]);
        return $relativePath;
    }

    private function convertAndCompressVideo($relativePath)
    {
        Log::info('Starting video conversion and compression', ['input_path' => $relativePath]);
        $absolutePath = public_path($relativePath);
        $ffmpeg = FFMpeg::create([
            'ffmpeg.binaries'  => '/usr/bin/ffmpeg',
            'ffprobe.binaries' => '/usr/bin/ffprobe',
            'timeout'          => 3600,
            'ffmpeg.threads'   => 12,
        ]);

        $video = $ffmpeg->open($absolutePath);
        $format = new \FFMpeg\Format\Video\X264();

        $format->setKiloBitrate(1000);
        $format->setAudioCodec("aac");
        $format->setAudioKiloBitrate(128);

        $video->filters()->resize(new \FFMpeg\Coordinate\Dimension(1280, 720), \FFMpeg\Filters\Video\ResizeFilter::RESIZEMODE_INSET)->synchronize();

        $newPath = public_path('videos/' . Str::random() . '.mp4');

        $video->save($format, $newPath);

        Log::info('Video converted and compressed successfully', ['output_path' => 'videos/' . basename($newPath)]);
        return 'videos/' . basename($newPath);
    }
}