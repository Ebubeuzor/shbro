<?php

namespace App\Jobs;

use App\Models\HostHome;
use App\Models\Hosthomephoto;
use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Spatie\ImageOptimizer\OptimizerChainFactory;
use Spatie\LaravelImageOptimizer\Facades\ImageOptimizer;

class ProcessImage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels,Batchable;

    public $tries = 3;

    public $retryAfter = 5;
    
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(
        private $image,
        private $hostHomeId
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
        $imageData = ['image' => $this->image, 'host_home_id' => $this->hostHomeId];
        $this->createImages($imageData);
    }

    public function createImages($data)
    {
        // Validate the input data
        $validator = Validator::make($data, [
            'image' => 'file',
            'host_home_id' => 'exists:App\Models\HostHome,id'
        ]);

        // Check for validation errors
        if ($validator->fails()) {
            // Handle validation errors, you can return a response or throw an exception
            return response(['error' => $validator->errors()], 422);
        }

        $data2 = $validator->validated();
        $data2['image'] = $this->saveImage($data2['image'], $data2['host_home_id']);

        return Hosthomephoto::create($data2);
    }

    
    private function saveImage($imageFile)
    {
        if (!$imageFile->isValid()) {
            throw new \Exception('Invalid image format or upload error');
        }
    
        // Move the uploaded file to a permanent temporary path before optimization
        $dir = 'images/';
        $fileName = Str::random() . '.' . $imageFile->extension();
        $absolutePath = public_path($dir);
        $filePath = $absolutePath . '/' . $fileName;
    
        if (!File::exists($absolutePath)) {
            File::makeDirectory($absolutePath, 0755, true);
        }
    
        $imageFile->move($absolutePath, $fileName);
    
        // Now optimize the image at the permanent location
        try {
            ImageOptimizer::optimize($filePath);
        } catch (\Exception $e) {
            Log::error('Image optimization failed: ' . $e->getMessage());
        }
    
        return $dir . $fileName;
    }

    private function deleteHostHome($hosthomeid)
    {
        $hosthome = HostHome::find($hosthomeid);
        if ($hosthome) {
            $hosthome->delete();
        }
    }


}
