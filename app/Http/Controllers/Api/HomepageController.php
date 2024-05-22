<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\HomepageRequest;
use App\Http\Resources\HomepageResource;
use App\Models\Homepage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Spatie\ImageOptimizer\OptimizerChainFactory;
use Spatie\LaravelImageOptimizer\Facades\ImageOptimizer;

class HomepageController extends Controller
{
    
    /**
     * @lrd:start
     * this gets the homepage data
     * @lrd:end
     */
    public function index()
    {
        $cacheKey = "homepagedata";
        return   Cache::remember($cacheKey, now()->addDay(), fn () =>   
            HomepageResource::collection(
                Homepage::whereId(1)->get()
            ));
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
    
    /**
     * @lrd:start
     * this is used to update the homepage
     * @lrd:end
     */
    public function store(HomepageRequest $request)
    {
        $data = $request->validated();
        
        $attributes = [];
        $attributes['image'] = $this->saveImage($data['image']);
        $attributes['title'] = $data['title'];
        $attributes['subtitle'] = $data['subtitle'];
        Homepage::updateOrCreate([], $attributes);
        $cacheKey = "homepagedata";
        Cache::forget( $cacheKey );
        return response("Done", 201);
    }


}
