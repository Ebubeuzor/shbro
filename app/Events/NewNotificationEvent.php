<?php

namespace App\Events;

use App\Models\Notification;
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
    public $userId;

    public function __construct($notification, $notificationId, $userId)
    {
        $this->notification = $notification;
        $this->notificationId = $notificationId;
        $this->userId = $userId;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('App.Models.User.' . $this->userId);

    }
    
    public function broadcastWith()
    {
        // Fetch all notifications for the user, ordered from latest to oldest
        $notifications = Notification::where('user_id', $this->userId)
        ->latest()
        ->get()
        ->map(function ($notification) {
            return [
                'id' => $notification->id,
                'message' => $notification->message,
                'time' => $notification->created_at,
            ];
        });

        return [
            'notifications' => $notifications
        ];
    }

}
