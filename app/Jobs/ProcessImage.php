<?php

namespace App\Jobs;

use App\Models\HostHome;
use App\Models\Hosthomephoto;
use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Spatie\LaravelImageOptimizer\Facades\ImageOptimizer;
use Illuminate\Http\UploadedFile;

class ProcessImage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, Batchable;

    public $tries = 3;
    public $retryAfter = 5;
    
    private $imagePath;
    private $hostHomeId;

    public function __construct($imagePath, $hostHomeId)
    {
        $this->imagePath = $imagePath;
        $this->hostHomeId = $hostHomeId;
    }

    public function handle()
    {
        try {
            // Create a new UploadedFile instance from the existing file
            $file = new UploadedFile(
                public_path($this->imagePath),
                basename($this->imagePath),
                File::mimeType(public_path($this->imagePath)),
                null,
                true
            );

            // Process and save the image
            $savedPath = $this->saveImage($file);

            // Create the database record
            Hosthomephoto::create([
                'image' => $savedPath,
                'host_home_id' => $this->hostHomeId
            ]);

            // Clean up the original temp file
            if (File::exists(public_path($this->imagePath))) {
                File::delete(public_path($this->imagePath));
            }

            Log::info('Image processed successfully', [
                'original_path' => $this->imagePath,
                'saved_path' => $savedPath,
                'host_home_id' => $this->hostHomeId
            ]);

        } catch (\Exception $e) {
            Log::error('Image processing failed', [
                'image_path' => $this->imagePath,
                'host_home_id' => $this->hostHomeId,
                'error' => $e->getMessage()
            ]);
            
            throw $e;
        }
    }

    private function saveImage($file)
    {
        if (!$file->isValid()) {
            throw new \Exception('Invalid image file: ' . $this->imagePath);
        }
    
        // Set up the new file path
        $dir = 'images/hosthomes/';
        $fileName = Str::random(40) . '.' . $file->getClientOriginalExtension();
        $absolutePath = public_path($dir);
        $relativePath = $dir . $fileName;
        $newFilePath = $absolutePath . $fileName;
    
        // Create directory if it doesn't exist
        if (!File::exists($absolutePath)) {
            File::makeDirectory($absolutePath, 0755, true);
        }
    
        // Copy the file to its new location
        if (!File::copy($file->getRealPath(), $newFilePath)) {
            throw new \Exception('Failed to copy image to new location');
        }
    
        // Optimize the image
        try {
            ImageOptimizer::optimize($newFilePath);
        } catch (\Exception $e) {
            Log::error('Image optimization failed: ' . $e->getMessage());
            // Continue even if optimization fails
        }
    
        return $relativePath;
    }
}