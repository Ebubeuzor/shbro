<?php

namespace App\Jobs;

use App\Events\MessageSent;
use App\Events\NewNotificationEvent;
use App\Mail\NewBookingRequest;
use App\Mail\NewMessageMail;
use App\Mail\NotificationMail;
use App\Models\HostHome;
use App\Models\Notification;
use App\Models\User;
use App\Repository\ChatRepository;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class SendMailForChatToCohosts implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(
        private $message,
        private $senderId,
        private $receiverId,
        private $sender,
        private $requestToBook = null,
        private $hostHomeId = null,
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
        if (!$this->sender && $this->requestToBook == null) {
            $this->sendMessage($this->message, $this->senderId, $this->receiverId);
        }elseif ($this->requestToBook != null && $this->hostHomeId) {
            $this->sendMessageForBookingRequest($this->message, $this->senderId, $this->receiverId);
        }else {
            $this->shareMessageWithCohost($this->message, $this->senderId, $this->receiverId);
        }
    }
    
    private function sendMessage($message, $senderId, $receiverId)
    {
        $chat = new ChatRepository();

        try {
            // Send the message
            $message = $chat->sendMessages([
                'message' => $message,
                'sender_id' => $senderId,
                'receiver_id' => $receiverId,
            ]);
            
            // Trigger message event
            event(new MessageSent($message, $senderId, $receiverId));
            
            // Send notification email to the receiver
            $receiver = User::find($receiverId);
            $sender = User::find($senderId);

            Mail::to($receiver->email)->queue(new NewMessageMail($receiver, 'You have a new message'));
        } catch (\Throwable $th) {
            throw new \Exception($th->getMessage());
        }
    }
     
    private function sendMessageForBookingRequest($message, $senderId, $receiverId)
    {
        $chat = new ChatRepository();

        try {
            // Send the message
            $message = $chat->sendMessages([
                'message' => $message,
                'sender_id' => $senderId,
                'receiver_id' => $receiverId,
            ]);
            
            // Trigger message event
            event(new MessageSent($message, $senderId, $receiverId));
            
            // Send notification email to the receiver
            $receiver = User::find($receiverId);
            $sender = User::find($senderId);

            
            // Create a new notification record in the database
            $notification = new Notification();
            $notification->user_id = $receiverId;  // Assuming you want to save the user ID
            $notification->Message = $message;
            $notification->save();
            // Broadcast the NewNotificationEvent to notify the WebSocket clients
            event(new NewNotificationEvent($notification, $notification->id, $receiverId));

            $hosthome = HostHome::find($this->hostHomeId);
            Mail::to($receiver->email)->queue(new NewBookingRequest($receiver,$hosthome, "A Guest made a request"));
        } catch (\Throwable $th) {
            throw new \Exception($th->getMessage());
        }
    }
    
    private function shareMessageWithCohost($message, $senderId, $receiverId)
    {
        $chat = new ChatRepository();

        try {
            // Send the message
            $message = $chat->sendMessages([
                'message' => $message,
                'sender_id' => $senderId,
                'receiver_id' => $receiverId,
            ]);
            
            
            // Trigger message event
            // event(new MessageSent($message, $senderId, $receiverId));
            
        } catch (\Throwable $th) {
            throw new \Exception($th->getMessage());
        }
    }
}
