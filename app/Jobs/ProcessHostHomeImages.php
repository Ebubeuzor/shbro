<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Bus;

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
        $batch = Bus::batch([]);
        
        foreach ($this->images as $image) {
            $batch->add(new ProcessImage($image, $this->hostHomeId));
        }
        
        $batch->onQueue('single-image')->dispatch();
    }
}
