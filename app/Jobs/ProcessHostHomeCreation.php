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
    
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(
        private $data,
        private $userId
    )
    {
        //
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $data = $this->data;
        $user = User::find($this->userId);
        $hostHome = new HostHome();

        $cohost = Cohost::where('user_id',$user->id)->first();

        $hostHome->user_id = $cohost ? $cohost->host_id : $user->id;
        $hostHome->property_type = $data['property_type'];
        $hostHome->guest_choice = $data['guest_choice'];
        $hostHome->address = $data['address'];
        $hostHome->guests = $data['guest'];
        $hostHome->bedroom = $data['bedrooms'];
        $hostHome->beds = $data['beds'];
        $hostHome->bathrooms = $data['bathrooms'];

        try {
            $hostHome->video = $this->uploadBase64($data['hosthomevideo']);
        } catch (\Exception $e) {
            Log::error('Video upload failed: ' . $e->getMessage());
            throw $e; // Re-throw the exception to stop the job.
        }

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

        $price = $data['price'];

        $service_fee = 0;
        $tax = 0;


        $total = $price + $service_fee + $tax;

        $hostHome->service_fee = 0;
        $hostHome->tax = 0;
        $hostHome->total = 0;
        
        $host = User::find($hostHome->user_id);
        $isFirstHome = $host->hosthomes->isEmpty(); 
        $hostStatus = $host->host;
        try {
            DB::transaction(function () use ($hostHome, $data,$user,$cohost,$host,$isFirstHome, $hostStatus) {
                $hostHome->save();


                $amenities = $data['amenities'];
                $images = $data['hosthomephotos'];
                $hosthomedescriptions = $data['hosthomedescriptions'];
                $reservations = $data['reservations'];
                $discounts = $data['discounts'];
                $rules = $data['rules'];
                $notices = $data['notice'];
                
                if(trim(isset($data['additionalRules']))){
                    Hosthomerule::create([
                        'rule' => $data['additionalRules'],
                        'host_home_id' => $hostHome->id
                    ]);
                }

                foreach ($images as $base64Image) {
                    ProcessImage::dispatch($base64Image, $hostHome->id);
                }
                
                foreach ($amenities as $amenity) {
                    ProcessOffer::dispatch($amenity, $hostHome->id);
                }
                
                foreach ($hosthomedescriptions as $hosthomedescription) {
                    ProcessDescription::dispatch($hosthomedescription,$hostHome->id);
                }
                
                foreach ($reservations as $reservation) {
                    ProcessReservation::dispatch($reservation,$hostHome->id);
                }
                
                foreach ($discounts as $discount) {
                    ProcessDiscount::dispatch($discount,$hostHome->id);
                }
                
                foreach ($rules as $rule) {
                    ProcessRule::dispatch($rule,$hostHome->id);
                }
                
                foreach ($notices as $notice) {
                    ProcessNotice::dispatch($notice, $hostHome->id);
                }


                if (!$cohost) {
                    $message = "Your listing has been created now awaiting admin approval";
                    $title = "Listing Created Successfully.";
                    Mail::to($host->email)->queue(new NewApartmentpendingApproval($host,$hostHome,$title));
                            
                    // Create a new notification record in the database
                    $notification = new Notification();
                    $notification->user_id = $host->id;  // Assuming you want to save the user ID
                    $notification->Message = $message;
                    $notification->save();
                    // Broadcast the NewNotificationEvent to notify the WebSocket clients
                    event(new NewNotificationEvent($notification, $notification->id, $host->id));

                }

                if ($user->co_host == true) {
                    
                    $hostHome->update([
                        'approvedByHost' => false,
                        'needApproval' => true
                    ]);
                    Mail::to($host->email)->queue(new ApartmentCreationApprovalRequest($hostHome,$host,$user));
                    
                    $this->clearAllCache();

                }

                if ($isFirstHome && $hostStatus == 0) {
                    $host->host = 1;
                    $host->save();

                    Mail::to($host->email)->queue(new FirstHomeWelcomeMessageMail($host));
                }

                if ($host->hostcohosts()->exists()) {
                    $coHosts = $host->hostcohosts()->with('user')->get();
                    $uniqueCohosts = $coHosts->unique('user.email');
                
                    foreach ($uniqueCohosts as $coHost) {
                        CreateHomesForCohosts::dispatch($coHost->user_id, $coHost->host_id, $hostHome->id);
                    }
                    
                    $this->clearAllCache();
                }

                if (!$user->co_host) {
                    $chunkSize = 100;
                    $title = "New Apartment Created: Admin Action Required";

                    // Process admins in chunks
                    User::whereNotNull('adminStatus')->chunk($chunkSize, function ($admins) use ($hostHome, $title, $host) {
                        try {
                            // Dispatch the notification job for the current chunk of admins
                            NotifyAdmins::dispatch($admins, $hostHome, $host, $title);
                        } catch (\Exception $e) {
                            // Optionally log any errors during the dispatch
                            Log::error("Failed to dispatch NotifyAdmins job: " . $e->getMessage());
                        }
                    });
                }



            });

            Log::info('DB transaction for HostHome creation completed successfully.');
        } catch (\Illuminate\Database\QueryException $e) {
            // Log database-specific errors
            Log::error('Transaction failed due to database error: ' . $e->getMessage(), [
                'sql' => $e->getSql(), 
                'bindings' => $e->getBindings()
            ]);
        } catch (\PDOException $e) {
            // Handle PDO-specific errors
            Log::error('PDO Exception: ' . $e->getMessage(), ['stack' => $e->getTraceAsString()]);
        } catch (\Exception $e) {
            // Log generic errors
            Log::error('General Exception in transaction: ' . $e->getMessage(), ['stack' => $e->getTraceAsString()]);
            Mail::to('ebubeuzor17@gmail.com')->send(new NotificationMail(User::find(1),$e->getMessage(),"Error Creating Hosthome"));
            throw $e;
        }
    }

    public function clearAllCache()
    {
        Cache::clear();
    }

    
    
    public function uploadBase64($video)
    {
        $videoBase64 = $video;
        $videoPath = $this->saveVideo($videoBase64);

        // Call a method to convert and compress the video
        $convertedPath = $this->convertAndCompressVideo($videoPath);

        // Optionally remove the original uncompressed file
        File::delete(public_path($videoPath));

        return $convertedPath;
    }
    
    private function saveVideo($video)
    {
        // Check if video is base64 string
        if (preg_match('/^data:video\/(\w+);base64,/', $video, $matches)) {
            $videoData = substr($video, strpos($video, ',') + 1);
            $videoType = strtolower($matches[1]);

            // Decode base64 video data
            $decodedVideo = base64_decode($videoData);
        } else {
            throw new \Exception('Invalid video format');
        }

        $dir = 'videos/';
        $file = Str::random() . '.' . $videoType;
        $absolutePath = public_path($dir);
        $relativePath = $dir . $file;

        if (!File::exists($absolutePath)) {
            if (!File::makeDirectory($absolutePath, 0755, true)) {
                throw new \Exception('Failed to create directory: ' . $absolutePath);
            }
        }

        // Save the decoded video to the file
        $filePath = $absolutePath . '/' . $file;
        if (!file_put_contents($filePath, $decodedVideo)) {
            throw new \Exception('Failed to save video');
        }

        return $relativePath;
    }

    private function convertAndCompressVideo($relativePath)
    {
        $absolutePath = public_path($relativePath);
        $ffmpeg = FFMpeg::create([
            'ffmpeg.binaries'  => '/usr/bin/ffmpeg', // Assuming ffmpeg is in the system's PATH
            'ffprobe.binaries' => '/usr/bin/ffprobe', // Assuming ffprobe is in the system's PATH
            'timeout'          => 3600, // The timeout for the underlying process
            'ffmpeg.threads'   => 12,   // The number of threads that FFMpeg should use
        ]);

        $video = $ffmpeg->open($absolutePath);
        $format = new \FFMpeg\Format\Video\X264(); // WebM format

        // Set lower bitrate for better compression
        $format->setKiloBitrate(1000); // Adjust as needed

        // Set audio codec and bitrate
        $format->setAudioCodec("aac");
        $format->setAudioKiloBitrate(128);

        // Resize the video to maintain aspect ratio
        $video->filters()->resize(new \FFMpeg\Coordinate\Dimension(1280, 720), \FFMpeg\Filters\Video\ResizeFilter::RESIZEMODE_INSET)->synchronize();

        // Define the output path and extension (always .mp4)
        $newPath = public_path('videos/' . Str::random() . '.mp4');

        $video->save($format, $newPath);

        return 'videos/' . basename($newPath);
    }

}
