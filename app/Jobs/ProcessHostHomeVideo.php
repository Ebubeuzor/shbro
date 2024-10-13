<?php

namespace App\Jobs;

use App\Models\HostHome;
use FFMpeg\FFMpeg;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;

class ProcessHostHomeVideo implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 2;
    public $timeout = 900; // 15 minutes
    private $video;
    private $hostHomeId;

    public function __construct($video, $hostHomeId)
    {
        $this->video = $video;
        $this->hostHomeId = $hostHomeId;
    }

    public function handle()
    {
        $hostHome = HostHome::findOrFail($this->hostHomeId);
        
        try {
            $processedPath = $this->processVideo($this->video);
            
            $hostHome->update(['video' => $processedPath]);
            
            Log::info("Video processed successfully", [
                'host_home_id' => $this->hostHomeId
            ]);
        } catch (Throwable $e) {
            Log::error("Video processing failed", [
                'host_home_id' => $this->hostHomeId,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
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

