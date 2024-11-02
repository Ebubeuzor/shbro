<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\File;

class ProcessHostHomeImages implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 600; // 10 minutes
    private $images;
    private $hostHomeId;

    public function __construct($images, $hostHomeId)
    {
        $this->images = $images;
        $this->hostHomeId = $hostHomeId;
    }

    public function handle()
    {
        $imageChunks = array_chunk($this->images, 2); // Process 2 images at a time
        
        foreach ($imageChunks as $chunk) {
            $batch = Bus::batch([]);
            
            foreach ($chunk as $imagePath) {
                if ($this->isValidFile($imagePath)) {
                    $batch->add(new ProcessImage($imagePath, $this->hostHomeId));
                }
            }
            
            if ($batch->jobs->isNotEmpty()) {
                $batch->onQueue('single-image')->dispatch();
            }
        }
    }

    private function isValidFile($imagePath)
    {
        return $imagePath && 
               File::exists(public_path($imagePath)) && 
               File::isReadable(public_path($imagePath));
    }
}