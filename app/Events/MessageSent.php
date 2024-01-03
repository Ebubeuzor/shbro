<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class MessageSent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    
    public $message;
    public $sender;
    public $receiver;
    
    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($message,$sender,$receiver)
    {
        $this->message = $message;
        $this->sender = $sender;
        $this->receiver = $receiver;
    }

    public function broadcastOn()
    {
        $userId = auth()->id();
        
        return new PrivateChannel('messanger.' . $userId . '.' . $this->receiver);
    }

    public function broadcastWith()
    {
        return [
            'message' => [
                'sender_id' => $this->receiver,
                'message' => $this->message,
            ],
        ];
    }
}
