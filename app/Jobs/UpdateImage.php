<?php

namespace App\Jobs;

use App\Models\HostHome;
use App\Models\Hosthomephoto;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Spatie\LaravelImageOptimizer\Facades\ImageOptimizer;

class UpdateImage implements ShouldQueue
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
        private $hostHomeId,
        private array $images
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
        $this->updateImages($this->hostHomeId, $this->images);
    }

    private function updateImages($hosthome, array $images)
    {

        foreach ($images as $base64Image) {
            $imageData = ['image' => $base64Image, 'host_home_id' => $hosthome];
            $this->createImages($imageData);
        }
    }

    
    public function createImages($data)
    {
        // Validate the input data
        $validator = Validator::make($data, [
            'image' => 'string',
            'host_home_id' => 'exists:App\Models\HostHome,id'
        ]);

        // Check for validation errors
        if ($validator->fails()) {
            // Handle validation errors, you can return a response or throw an exception
            return response(['error' => $validator->errors()], 422);
        }

        $data2 = $validator->validated();
        info($data2);
        $data2['image'] = $this->saveImage($data2['image'], $data2['host_home_id']);

        return Hosthomephoto::create($data2);
    }

    
    private function saveImage($image)
    {
        // Check if image is base64 string
        if (preg_match('/^data:image\/(\w+);base64,/', $image, $matches)) {
            $imageData = substr($image, strpos($image, ',') + 1);
            $imageType = strtolower($matches[1]);

            // Decode base64 image data
            $decodedImage = base64_decode($imageData);

            if ($decodedImage === false) {
                throw new \Exception('Failed to decode image');
            }
        } else {
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
}
