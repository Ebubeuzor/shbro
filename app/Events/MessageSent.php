<?php

namespace App\Events;

use App\Models\Message;
use App\Models\User;
use App\Repository\ChatRepository;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class MessageSent implements ShouldBroadcast
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
    public function __construct($message, $sender, $receiver)
    {
        Log::info('MessageSent event instantiated', ['message' => $message, 'sender' => $sender, 'receiver' => $receiver]);

        $this->message = $message;
        $this->sender = $sender;
        $this->receiver = $receiver;
    }

    public function broadcastOn()
    {
        Log::info('Broadcasting on channel', ['channel' => 'messanger.' . $this->receiver]);
        return new PrivateChannel('messanger.' . $this->receiver);
    }

    public function broadcastWith()
    {
        Log::info('BroadcastWith method called', ['sender' => $this->sender, 'receiver' => $this->receiver]);

        $messages = Message::where('sender_id', $this->sender)
            ->where('receiver_id', $this->receiver)
            ->get();

        Log::info('Messages retrieved for broadcast', ['messages' => $messages]);

        // Load booking requests for each message if they exist
        $messages->load('bookingRequest');
        Log::info('Booking requests loaded');

        $chatRepository = new ChatRepository();
        $user = User::find($this->receiver);
        $user->profilePicture = url($user->profilePicture);
        
        Log::info('Returning broadcast data', ['receiver' => $user]);

        return [
            'messagesWithAUser' => $messages,
            'recentMessages' => $chatRepository->getRecentUserMessages($this->receiver),
            'receiver' => $user
        ];
    }
}

