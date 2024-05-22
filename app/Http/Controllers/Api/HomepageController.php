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
use Spatie\ImageOptimizer\OptimizerChainFactory;

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

        $dir = 'images/';
        $fileName = Str::random() . '.' . $imageType;
        $absolutePath = storage_path('app/' . $dir);
        $relativePath = $dir . $fileName;

        if (!File::exists($absolutePath)) {
            File::makeDirectory($absolutePath, 0755, true);
        }

        // Save the decoded image to the file
        $filePath = $absolutePath . '/' . $fileName;
        if (!file_put_contents($filePath, $decodedImage)) {
            throw new \Exception('Failed to save image');
        }

        // Optimize the saved image
        $optimizerChain = OptimizerChainFactory::create();
        $optimizerChain->optimize($filePath);

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
