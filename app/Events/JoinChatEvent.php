<?php

namespace App\Events;

use Carbon\Carbon;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class JoinChatEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(
        private $adminId,
        private $guestId,
        private $message,
        private $sessionId,
    )
    {
        //
    }

    
    public function broadcastOn()
    {
        return new PrivateChannel('join.chat.'. $this->guestId);
    }
    
    public function broadcastWith()
    {
        return [
            'adminid' => $this->adminId,
            'sessionId' => $this->sessionId,
            'message' => $this->message,
            'timejoined' => Carbon::now(),
        ];
    }


}
