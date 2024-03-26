<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LeaveChatEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(
        private int $guestid,
        private int $adminId,
        private string $message,
        private string $status
    )
    {
        //
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        if ($this->status == 'admin') {
            return new PrivateChannel('left.chat.'. $this->guestid);
        } else {
            return new PrivateChannel('left.chat.'. $this->adminId);
        }
        
    }
    
    public function broadcastWith()
    {
        return [
            'message' => $this->message
        ];
    }
    
}
