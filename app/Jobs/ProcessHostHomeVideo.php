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

    
    private function processVideo($videoFile)
    {
        try {
            // Save the original video file
            $originalPath = $this->saveVideo($videoFile);

            // Convert and compress the video
            $processedPath = $this->convertAndCompressVideo($originalPath);

            // Clean up the original file after successful processing
            if ($originalPath !== $processedPath) {
                if (File::exists(public_path($originalPath))) {
                    Log::info("Deleting original video: " . public_path($originalPath));
                    File::delete(public_path($originalPath));
                } else {
                    Log::warning("Original video not found for deletion: " . public_path($originalPath));
                }
            }

            return $processedPath;
        } catch (\Throwable $e) {
            Log::error("Video processing failed: " . $e->getMessage());
            throw $e;
        }
    }

    private function saveVideo($videoFile)
    {
        $dir = 'videos/';
        $fileName = Str::random() . '.' . $videoFile->getClientOriginalExtension();
        $relativePath = $dir . $fileName;
        $absolutePath = public_path($dir);

        if (!File::exists($absolutePath)) {
            File::makeDirectory($absolutePath, 0755, true);
        }

        // Move uploaded file to the desired location
        $videoFile->move($absolutePath, $fileName);

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
                unlink($newPath);
                return $relativePath;
            }

            return $newRelativePath;
        } catch (\Exception $e) {
            Log::error('Video compression failed: ' . $e->getMessage());
            if (file_exists($newPath)) {
                unlink($newPath);
            }
            return $relativePath;
        }
    }
    
}

