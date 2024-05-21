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
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Spatie\ImageOptimizer\OptimizerChainFactory;

class ProcessImage implements ShouldQueue
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
            'image' => 'string',
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

    
    private function saveImage($image, $hosthomeid)
    {
        // Check if image is base64 string
        if (preg_match('/^data:image\/(\w+);base64,/', $image, $matches)) {
            $imageData = substr($image, strpos($image, ',') + 1);
            $imageType = strtolower($matches[1]);

            // Decode base64 image data
            $decodedImage = base64_decode($imageData);

            if ($decodedImage === false) {
                $this->deleteHostHome($hosthomeid);
                throw new \Exception('Failed to decode image');
            }
        } else {
            $this->deleteHostHome($hosthomeid);
            throw new \Exception('Invalid image format');
        }

        $dir = 'images/';
        $fileName = Str::random() . '.' . $imageType;
        $absolutePath = public_path($dir);
        $relativePath = $dir . $fileName;

        if (!File::exists($absolutePath)) {
            File::makeDirectory($absolutePath, 0755, true);
        }

        // Save the decoded image to the file
        if (!file_put_contents($absolutePath . '/' . $fileName, $decodedImage)) {
            $this->deleteHostHome($hosthomeid);
            throw new \Exception('Failed to save image');
        }

        // Optimize the saved image
        $optimizerChain = OptimizerChainFactory::create();
        $optimizerChain->optimize($absolutePath . '/' . $fileName);

        return $relativePath;
    }

    private function deleteHostHome($hosthomeid)
    {
        $hosthome = HostHome::find($hosthomeid);
        if ($hosthome) {
            $hosthome->delete();
        }
    }


}
