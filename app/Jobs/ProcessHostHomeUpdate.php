<?php

namespace App\Jobs;

use App\Events\NewNotificationEvent;
use App\Mail\ApartmentListingUpdateReview;
use App\Mail\CohostUpdateForHost;
use App\Mail\NotificationMail;
use App\Models\Cohost;
use App\Models\HostHome;
use App\Models\Hosthomediscount;
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
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Throwable;

class ProcessHostHomeUpdate implements ShouldQueue
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
        private $user,
        private $hostHomeId,
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
        $hostHomeId = $this->hostHomeId;
        $hostHome = HostHome::find($hostHomeId);
        $price = $data['price'];
        
        // Assuming $service_fee_percentage and $tax_percentage are set to 0
        $service_fee_percentage = 0;
        $tax_percentage = 0;

        $service_fee = $price * $service_fee_percentage;
        $tax = $price * $tax_percentage;

        $total = $price + $service_fee + $tax;

        $video = $data['hosthomevideo'];

        $hostHomeData = [
            'property_type' => $data['property_type'],
            'guest_choice' => $data['guest_choice'],
            'address' => $data['address'],
            'guests' => $data['guest'],
            'bedroom' => $data['bedrooms'],
            'beds' => $data['beds'],
            'bathrooms' => $data['bathrooms'],
            'title' => $data['title'],
            'description' => $data['description'],
            'disapproved' => null,
            'reservation' => $data['reservation'],
            'actualPrice' => $data['price'],
            'check_out_time' => $data['check_out_time'],
            'host_type' => $data['host_type'],
            'check_in_time' => $data['checkin'],
            'service_fee' => $service_fee,
            'tax' => $tax,
            'total' => $total,
            'verified' => 0,
            'actualPrice' => $price,
            'cancellation_policy' => $data['cancelPolicy'],
            'security_deposit' => $data['securityDeposit']
        ];

        // Check if $video is not an empty string before updating
        if ($video != "") {
            // Assuming the rest of your code remains unchanged
            $hostHomeData['video'] = $this->processVideo($video);
        }

        DB::transaction(function () use ($hostHome, $hostHomeData,$data,$price) {
            $hostHome->update($hostHomeData);

            $amenities = $data['amenities'];
            $images = $data['hosthomephotos'];
            $hosthomedescriptions = $data['hosthomedescriptions'];
            $reservations = $data['reservations'];
            $discounts = $data['discounts'];
            $rules = $data['rules'];
            $notices = $data['notice'];

            UpdateDescription::dispatch($hostHome->id, $hosthomedescriptions);

            if(isset($data['price'])){
                if ($hostHome->bookingCount < 3 && $this->hasNewListingPromotionDiscount($hostHome)) {
                    $priceDiscount = intval($hostHome->actualPrice) * 0.2;
                    $newPrice = intval($hostHome->actualPrice) - $priceDiscount;
                    $hostHome->update([
                        'price' => $newPrice
                    ]);
                }else{
                    $hostHome->update([
                        'price' => $price
                    ]);
                }
            }
            
            if(trim(isset($data['additionalRules']))){
                $hosthomerule = Hosthomerule::where('host_home_id',$hostHome->id);
                $hosthomerule->update([
                    'rule' => $data['additionalRules'],
                ]);
            }

            if (isset($images) && !empty($images)) {
                UpdateImage::dispatch($hostHome->id, $images);
            } 
            

            if(isset($amenities) && !empty($amenities)) {
                UpdateOffer::dispatch($hostHome->id, $amenities);
            }
            
            
            if(isset($reservations) && !empty($reservations)) {
                UpdateReservation::dispatch($hostHome->id, $reservations);
            }
            
            if(isset($discounts) && !empty($discounts)) {
                UpdateDiscount::dispatch($hostHome->id, $discounts);
            }
            
            if(isset($rules) && !empty($rules)) {
                UpdateRule::dispatch($hostHome->id, $rules);
            }
            
            if(isset($notices) && !empty($notices)) {
                UpdateNotice::dispatch($hostHome->id, $notices);
            }

            
            $host = User::find($hostHome->user_id);
            $cohost = Cohost::where('user_id',$this->user->id)->first();
            if ($cohost) {
                $destination = "https://shortletbooking.com/EditHostHomes/$hostHome->id";
                Mail::to($host->email)->queue(new CohostUpdateForHost($hostHome,$host,$this->user,$destination));
            }

            $message = "Your listing has been updated now awaiting admin approval";
            $title = "Listing updated successfully and is now awaiting admin approval.";
            
            $notification = new Notification();
            $notification->user_id = $host->id;  
            $notification->Message = $message;
            $notification->save();
            
            event(new NewNotificationEvent($notification, $notification->id, $host->id));
            
            Mail::to($host->email)->queue(new ApartmentListingUpdateReview($host,$hostHome,$title));

            $this->clearCacheForAllUsers();

            $admins = User::whereNotNull('adminStatus')->get();
            $title = "Urgent: User Submitted Apartment Update Requires Admin Attention";
            NotifyAdmins::dispatch($admins,$hostHome,$host,$title);

        });
    }
    
    
    private function clearCacheForAllUsers()
    {
        Cache::flush();
    }
    

    private function hasNewListingPromotionDiscount($hostHome)
    {
        $discounts = Hosthomediscount::where('host_home_id', $hostHome->id)->get();

        foreach ($discounts as $discount) {
            if ($discount->discount === '20% New listing promotion') {
                return true;
            }
        }

        return false;
    }
    
    
    
    private function processVideo($videoBase64)
    {
        try {
            // Save the original video
            $originalPath = $this->saveVideo($videoBase64);
            
            // Convert and compress the video
            $processedPath = $this->convertAndCompressVideo($originalPath);
            
            // Clean up the original file after successful processing
            if ($originalPath !== $processedPath) {
                // Only delete the original if it's different from the processed path
                if (File::exists(public_path($originalPath))) {
                    Log::info("Deleting original video: " . public_path($originalPath));
                    File::delete(public_path($originalPath));
                } else {
                    Log::warning("Original video not found for deletion: " . public_path($originalPath));
                }
            }
            
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

        // Get original video dimensions
        $dimensions = $ffmpeg
            ->getFFProbe()
            ->streams($absolutePath)
            ->videos()
            ->first()
            ->getDimensions();

        // Get original video details
        $originalFormat = $video->getFormat();
        $originalDuration = $originalFormat->get('duration');
        $originalBitrate = $originalFormat->get('bit_rate');
        $originalFileSize = filesize($absolutePath) / (1024 * 1024); // in MB

        // Calculate target bitrate (aim for 70% of original, minimum 500kbps, maximum 2Mbps)
        $targetBitrate = min(max($originalBitrate * 0.7, 500000), 2000000);

        $format = new \FFMpeg\Format\Video\X264();
        $format->setKiloBitrate($targetBitrate / 1000) // Convert to kbps
            ->setAudioKiloBitrate(128) // Increased audio bitrate for better quality
            ->setAudioCodec('aac')
            ->setVideoCodec('libx264');

        // Set additional parameters for better compression while maintaining quality
        $format->setAdditionalParameters([
            '-preset', 'medium', // Balance between compression speed and quality
            '-crf', '23', // Constant Rate Factor (18-28 is good, lower is better quality)
            '-profile:v', 'main', // Main profile for better compatibility
            '-level', '4.0', // Compatibility level
            '-movflags', '+faststart', // Enable fast start for web playback
            '-pix_fmt', 'yuv420p' // Pixel format for better compatibility
        ]);

        $newFileName = Str::random() . '.mp4';
        $newRelativePath = 'videos/' . $newFileName;
        $newPath = public_path($newRelativePath);

        // Log compression attempt
        Log::info('Starting Video Compression', [
            'original_path' => $absolutePath,
            'original_size' => $originalFileSize . ' MB',
            'original_bitrate' => $originalBitrate,
            'target_bitrate' => $targetBitrate,
            'dimensions' => $dimensions->getWidth() . 'x' . $dimensions->getHeight()
        ]);

        try {
            $video->save($format, $newPath);
            
            $newFileSize = filesize($newPath) / (1024 * 1024); // in MB

            Log::info('Compression Result', [
                'original_size' => $originalFileSize . ' MB',
                'new_size' => $newFileSize . ' MB',
                'size_reduction' => ($originalFileSize - $newFileSize) . ' MB',
            ]);

            // Verify the new video is playable
            $newVideo = $ffmpeg->open($newPath);
            $newDuration = $newVideo->getFormat()->get('duration');
            
            // If new file is larger or duration is significantly different, keep the original
            if ($newFileSize > $originalFileSize || abs($newDuration - $originalDuration) > 1) {
                unlink($newPath);
                return $relativePath;
            }

            return $newRelativePath;
        } catch (\Exception $e) {
            Log::error('Video compression failed: ' . $e->getMessage());
            if (file_exists($newPath)) {
                unlink($newPath);
            }
            return $relativePath; // Return original path if compression fails
        }
    }
    
    
}
