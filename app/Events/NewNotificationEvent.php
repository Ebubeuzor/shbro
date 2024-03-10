<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class NewNotificationEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;


    public $notification;
    public $notificationId;

    public function __construct($notification, $notificationId)
    {
        $this->notification = $notification;
        $this->notificationId = $notificationId;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('App.Models.User.' . auth()->id());

    }
    
    public function broadcastWith()
    {
        info('testing');
        return [
            'notification' => [
                'id' => $this->notification->id,
                'message' => $this->notification->Message,
                'time' => $this->notification->created_at,
            ],
        ];
    }

}
