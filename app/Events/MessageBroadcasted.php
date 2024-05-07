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
        public $userStatus,
        public $receiverId,
        public $chatId,
        public $sessionId,
        public $created_at
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
            if ($this->userStatus == "guest" || $this->userStatus == "cohost" || $this->userStatus == "host") {
                return new PrivateChannel('chat.admin.' .  $this->receiverId);
            }else {
                return new PrivateChannel('chat.user.' .  $this->receiverId);
            }
        }else {
            return new Channel('start-convo');
        }
    }

    public function broadcastWith()
    {
        if ($this->receiverId == null) {
            $unattendedChats = AdminGuestChat::whereNull('admin_id')
            ->whereNull('start_convo')
            ->get();

            return ['unattended_chats' => $unattendedChats];
        }else {
            if ($this->userStatus == "guest" || $this->userStatus == "cohost" || $this->userStatus == "host") {
                $query = AdminGuestChat::where('user_id', $this->user->id)
                ->where('session_id', $this->sessionId)
                ->where('admin_id', $this->receiverId)
                ->get();

                $chatDataArray = [];

                
                foreach ($query as $chatData) {
                    
                    $chatDataArray[] = [
                        'user_id' => $chatData->user_id,
                        'message' => $chatData->message,
                        'image' => $chatData->image == null ? null : url($chatData->image),
                        'admin_id' => $chatData->admin_id,
                        'id' => $chatData->id,
                        'sessionId' => $chatData->session_id,
                        'status' => $chatData->status,
                        'created_at' => $chatData->created_at,
                    ];
                }

                return $chatDataArray;
            }else {
                return [
                    'user_id' => $this->receiverId,
                    'message' => $this->message,
                    'image' => $this->image != null ? url($this->image) : null,
                    'admin_id' => $this->user->id,
                    'id' => $this->chatId,
                    'sessionId' => $this->sessionId,
                    'status' => $this->userStatus,
                    'created_at' => $this->created_at,
                ];
                
            }
        }
    }

    
}
