<?php

namespace App\Events;

use App\Models\AdminGuestChat;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageBroadcasted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(
        public $user,
        public $message,
        public $image,
        public $userType,
        public $receiverId,
        public $chatId
    )
    {
        
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        if ($this->receiverId != null) {
            if ($this->userType == "guest" || $this->userType == "cohost" || $this->userType == "host") {
                return new PrivateChannel('chat.user.' .  $this->receiverId);
            }else {
                return new PrivateChannel('chat.admin.' .  $this->receiverId);
            }
        }else {
            return new Channel('start-convo');
        }
    }

    public function broadcastWith()
    {
        if ($this->receiverId != null) {
            $unattendedChats = AdminGuestChat::whereNull('admin_id')
            ->whereNull('start_convo')
            ->get();

            return response()->json(['unattended_chats' => $unattendedChats]);
        }else {
            if ($this->userType == "guest" || $this->userType == "cohost" || $this->userType == "host") {
                return [
                    'user_id' => auth()->id(),
                    'message' => $this->message,
                    'image' => $this->image != null ? url($this->image) : null,
                    'admin_id' => $this->receiverId,
                    'chatId' => $this->chatId
                ];
            }else {
                return [
                    'user_id' => $this->receiverId,
                    'message' => $this->message,
                    'image' => $this->image != null ? url($this->image) : null,
                    'admin_id' => auth()->id,
                    'chatId' => $this->chatId
                ];
                
            }
        }
    }

    
}
