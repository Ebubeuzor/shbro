<?php

namespace App\Jobs;

use App\Mail\NotificationMail;
use App\Models\ReportPropertyDamage;
use App\Models\ReportPropertyDamagePhotos;
use App\Models\User;
use FFMpeg\FFMpeg;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Spatie\LaravelImageOptimizer\Facades\ImageOptimizer;

class SaveReportDamages implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(
        private $data,
        private $hostId,
        private $booking,
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
        $reportDamage = new ReportPropertyDamage();
        $reportDamage->booking_number = $this->data['booking_number'];
        $reportDamage->host_id = $this->hostId;
        $reportDamage->damage_description = $this->data['description'];
        $reportDamage->video = $this->uploadBase64($this->data['video']);
        $reportDamage->save();

        // Iterate through each photo and create an Image record
        $images = $this->data['photos'];
        foreach ($images as $base64Image) {
            $imageData = [
                'photos' => $base64Image,
                'report_property_damage_id' => $reportDamage->id,
            ];
            $this->createImages($imageData);
        }

        // Update the booking's pauseSecurityDepositToGuest
        $this->booking->pauseSecurityDepositToGuest = now();
        $this->booking->save();

        $guest = User::find($this->booking->user_id);
        $guestMessage = "Important Notice: The host has reported damages to their apartment during your stay. Your security deposit has been paused from entering your wallet pending verification by admins. We will update you once the matter is resolved. Thank you for your cooperation.";
        $guestTitle = "Notice: Host Report of Apartment Damage";
        Mail::to($guest->email)->queue(new NotificationMail($guest, $guestMessage, $guestTitle));
        
        $admins = User::whereNotNull('adminStatus')->get();
        $message = "Urgent: Host has reported damages to their apartment. Immediate attention required.";
        $title = "Damage Report: Urgent Attention Needed";

        NotifyAdmins::dispatch($admins,$message,$title);
    }

    
    public function createImages($data)
    {
        // Validate the input data
        $validator = Validator::make($data, [
            'photos' => ' required | string',
            'report_property_damage_id' => 'exists:App\Models\ReportPropertyDamage,id'
        ]);

        // Check for validation errors
        if ($validator->fails()) {
            // Handle validation errors, you can return a response or throw an exception
            return response(['error' => $validator->errors()], 422);
        }

        $data2 = $validator->validated();
        $data2['photos'] = $this->saveImage($data2['photos'], $data2['report_property_damage_id']);

        return ReportPropertyDamagePhotos::create($data2);
    }

    
    private function saveImage($image,$report_property_damage_id)
    {
        // Check if image is base64 string
        if (preg_match('/^data:image\/(\w+);base64,/', $image, $matches)) {
            $imageData = substr($image, strpos($image, ',') + 1);
            $imageType = strtolower($matches[1]);

            // Decode base64 image data
            $decodedImage = base64_decode($imageData);

            if ($decodedImage === false) {
                $report_property_damage = ReportPropertyDamage::find($report_property_damage_id);
                $report_property_damage->delete();
                throw new \Exception('Failed to decode image');
            }
        } else {
            $report_property_damage = ReportPropertyDamage::find($report_property_damage_id);
            $report_property_damage->delete();
            throw new \Exception('Invalid image format');
        }

        $tempDir = sys_get_temp_dir();
        $tempFile = tempnam($tempDir, 'image_') . '.' . $imageType;

        // Save the decoded image to the temp file
        if (!file_put_contents($tempFile, $decodedImage)) {
            throw new \Exception('Failed to save image to temp file');
        }

        // Optimize the image
        try {
            ImageOptimizer::optimize($tempFile);
        } catch (\Exception $e) {
            Log::error('Image optimization failed: ' . $e->getMessage());
        }

        // Move the optimized image to the public directory
        $dir = 'images/';
        $fileName = Str::random() . '.' . $imageType;
        $absolutePath = public_path($dir);
        $relativePath = $dir . $fileName;
        $filePath = $absolutePath . '/' . $fileName;

        if (!File::exists($absolutePath)) {
            File::makeDirectory($absolutePath, 0755, true);
        }

        if (!rename($tempFile, $filePath)) {
            throw new \Exception('Failed to move optimized image to public directory');
        }

        return $relativePath;
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
        $format = new \FFMpeg\Format\Video\WebM(); // WebM format

        // Set lower bitrate for better compression
        $format->setKiloBitrate(700); // Adjust as needed for better compression

        // Resize the video to maintain aspect ratio
        $video->filters()->resize(new \FFMpeg\Coordinate\Dimension(1280, 720), \FFMpeg\Filters\Video\ResizeFilter::RESIZEMODE_INSET)->synchronize();

        // Define the output path and extension (always .webm)
        $newPath = public_path('videos/' . Str::random() . '.webm');

        $video->save($format, $newPath);

        return 'videos/' . basename($newPath);
    }
}
