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

class ProcessHostHomeVideo implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 2;
    public $timeout = 900; // 15 minutes
    private $videoPath;
    private $hostHomeId;

    /**
     * The unique ID of the job.
     */
    public function uniqueId()
    {
        return $this->hostHomeId;
    }

    public function __construct($videoPath, $hostHomeId)
    {
        $this->videoPath = $videoPath;
        $this->hostHomeId = $hostHomeId;
    }

    public function handle()
    {
        $hostHome = HostHome::findOrFail($this->hostHomeId);
        
        try {
            // Check if video is already processed
            if ($hostHome->video && File::exists(public_path($hostHome->video))) {
                Log::info("Video already processed, skipping", [
                    'host_home_id' => $this->hostHomeId,
                    'video_path' => $hostHome->video
                ]);
                return;
            }

            // Check if original video exists
            if (!File::exists(public_path($this->videoPath))) {
                throw new \RuntimeException("Original video file not found at: " . public_path($this->videoPath));
            }

            $processedPath = $this->processVideo($this->videoPath);
            
            $hostHome->update(['video' => $processedPath]);
            
            Log::info("Video processed successfully", [
                'host_home_id' => $this->hostHomeId,
                'processed_path' => $processedPath
            ]);
        } catch (Throwable $e) {
            Log::error("Video processing failed", [
                'host_home_id' => $this->hostHomeId,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    private function processVideo($videoPath)
    {
        try {
            // Get the full path of the original video
            $originalFullPath = public_path($videoPath);

            // Move the video to the permanent location
            $permanentPath = $this->moveToFinalLocation($videoPath);
            
            // Convert and compress the video
            $processedPath = $this->convertAndCompressVideo($permanentPath);

            // Clean up the original file after successful processing
            if ($permanentPath !== $processedPath) {
                if (File::exists(public_path($permanentPath))) {
                    Log::info("Deleting original video: " . public_path($permanentPath));
                    File::delete(public_path($permanentPath));
                }
            }

            return $processedPath;
        } catch (\Throwable $e) {
            Log::error("Video processing failed: " . $e->getMessage());
            throw $e;
        }
    }

    private function moveToFinalLocation($tempPath)
    {
        $extension = pathinfo($tempPath, PATHINFO_EXTENSION);
        $dir = 'videos/';
        $fileName = Str::random() . '.' . $extension;
        $relativePath = $dir . $fileName;
        $absolutePath = public_path($dir);

        // Create videos directory if it doesn't exist
        if (!File::exists($absolutePath)) {
            File::makeDirectory($absolutePath, 0755, true);
        }

        // Move the file from temp location to final location
        $originalPath = public_path($tempPath);
        $newPath = public_path($relativePath);
        
        if (!File::copy($originalPath, $newPath)) {
            throw new \RuntimeException("Failed to copy video from {$originalPath} to {$newPath}");
        }

        // Delete the original temp file
        File::delete($originalPath);
        
        // Delete the temp directory if it's empty
        $tempDir = dirname($originalPath);
        if (File::isDirectory($tempDir) && count(File::files($tempDir)) === 0) {
            File::deleteDirectory($tempDir);
        }

        return $relativePath;
    }

    
    private function convertAndCompressVideo($relativePath)
    {
        $absolutePath = public_path($relativePath);
        $ffmpeg = FFMpeg::create([
            'ffmpeg.binaries'  => 'ffmpeg',
            'ffprobe.binaries' => 'ffprobe',
            'timeout'          => 3600,
            'ffmpeg.threads'   => 12,
        ]);

        $video = $ffmpeg->open($absolutePath);

        // Get original video details
        $dimensions = $ffmpeg
            ->getFFProbe()
            ->streams($absolutePath)
            ->videos()
            ->first()
            ->getDimensions();

        $originalFormat = $video->getFormat();
        $originalDuration = $originalFormat->get('duration');
        $originalBitrate = $originalFormat->get('bit_rate');
        $originalFileSize = filesize($absolutePath) / (1024 * 1024); // in MB

        // Calculate target bitrate
        $targetBitrate = min(max($originalBitrate * 0.7, 500000), 2000000);

        $format = new \FFMpeg\Format\Video\X264();
        $format->setKiloBitrate($targetBitrate / 1000)
            ->setAudioKiloBitrate(128)
            ->setAudioCodec('aac')
            ->setVideoCodec('libx264');

        $format->setAdditionalParameters([
            '-preset', 'medium',
            '-crf', '23',
            '-profile:v', 'main',
            '-level', '4.0',
            '-movflags', '+faststart',
            '-pix_fmt', 'yuv420p'
        ]);

        $newFileName = Str::random() . '.mp4';
        $newRelativePath = 'videos/' . $newFileName;
        $newPath = public_path($newRelativePath);

        try {
            $video->save($format, $newPath);

            $newFileSize = filesize($newPath) / (1024 * 1024); // in MB
            $newVideo = $ffmpeg->open($newPath);
            $newDuration = $newVideo->getFormat()->get('duration');

            if ($newFileSize > $originalFileSize || abs($newDuration - $originalDuration) > 1) {
                File::delete($newPath);
                return $relativePath;
            }

            return $newRelativePath;
        } catch (\Exception $e) {
            Log::error('Video compression failed: ' . $e->getMessage());
            if (File::exists($newPath)) {
                File::delete($newPath);
            }
            return $relativePath;
        }
    }
}