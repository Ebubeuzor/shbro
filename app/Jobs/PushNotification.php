<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Kreait\Firebase\Factory;
use Kreait\Firebase\Messaging\CloudMessage;

class PushNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    
    public function __construct(
        public string $title,
        public string $message,
        public string $token,
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
        // Initialize Firebase Messaging
        $firebase = (new Factory)
        ->withServiceAccount(storage_path('app/firebasecredentials.json'))
        ->createMessaging();

        // Create the notification message
        $message = CloudMessage::withTarget('token', $this->token)
            ->withNotification([
                'title' => $this->title,
                'body' => $this->message,
            ])
            ->withData([
                'additionalDataKey' => 'additionalDataValue',
            ]);

        // Send the notification
        $firebase->send($message);
    }
}
