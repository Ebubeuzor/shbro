<?php

use Spatie\ImageOptimizer\Optimizers\Cwebp;
use Spatie\ImageOptimizer\Optimizers\Gifsicle;
use Spatie\ImageOptimizer\Optimizers\Jpegoptim;
use Spatie\ImageOptimizer\Optimizers\Optipng;
use Spatie\ImageOptimizer\Optimizers\Pngquant;
use Spatie\ImageOptimizer\Optimizers\Svgo;

return [
    'optimizers' => [
        Jpegoptim::class => [
            '-m15', // set maximum quality to 15%
            '--strip-all', // strip all text information such as comments and EXIF data
            '--all-progressive', // make sure the resulting image is a progressive one
        ],
        Pngquant::class => [
            '--force', // required parameter for this package
            '--quality=10-15', // set quality range to 10-15%
        ],
        Optipng::class => [
            '-i0', // result in a non-interlaced, progressive scanned image
            '-o7', // set optimization level to 7 (highest)
            '-quiet', // required parameter for this package
        ],
        Svgo::class => [
            '--disable=cleanupIDs', // disabling because it is known to cause troubles
        ],
        Gifsicle::class => [
            '-b', // required parameter for this package
            '-O3', // produce the slowest but best results
        ],
        Cwebp::class => [
            '-m 6', // slowest compression method for best compression
            '-pass 10', // maximize the amount of analysis pass
            '-mt', // multithreading for some speed improvements
            '-q 15', // quality factor that brings the least noticeable changes
        ],
    ],
    'binary_path' => 'C:\ProgramData\chocolatey\bin',
    'timeout' => 60,
    'log_optimizer_activity' => true, // Enable logging
];
