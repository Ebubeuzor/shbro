<?php

namespace App\Http\Controllers\Api;

use App\Events\MessageSent;
use App\Events\NewNotificationEvent;
use App\Events\Typing;
use App\Http\Controllers\Controller;
use App\Jobs\PushNotification;
use App\Jobs\SendMailForChatToCohosts;
use App\Mail\NewMessageMail;
use App\Mail\NotificationMail;
use App\Models\Cohost;
use App\Models\Message;
use App\Models\Notification;
use App\Models\User;
use App\Repository\ChatRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ChatController extends Controller
{
    public function __construct(private ChatRepository $chat) {
        $this->chat = $chat;
    }

    
    /**
     * @lrd:start
     * this gets all an authenticated user messages and who sent them
     * {receiverId?} is the auth user id
     * @lrd:end
     */
    public function index(Request $request, ?int $receiverId = null)
    {
        $messages = empty($receiverId) ? [] : $this->chat->getUserMessages((int) $request->user()->id, (int) $receiverId);

        // Load booking requests for each message if they exist
        foreach ($messages as $message) {
            $message->load('bookingRequest');
            foreach ($message->bookingRequest as $bookrequest) {
                $bookrequest->userName = User::find($bookrequest->user_id)->name;
            }
        }

        // Return the messages along with booking requests
        $user = User::find($receiverId);
        $user->profilePicture = url($user->profilePicture);
        return response([
            'messagesWithAUser' => $messages,
            'recentMessages' => $this->chat->getRecentUserMessages($request->user()->id),
            'receiver' => $user
        ]);
    }

    
    /**
     * @lrd:start
     * this is fired when an auth user is typing
     * channel is typing.{receiverid}
     * event is Typing
     * @lrd:end
     */
    public function typing($receiverId,$senderid)
    {
        event(new Typing($senderid,$receiverId));
    }

    
    /**
     * @lrd:start
     * Stores a message from the authenticated user to a specified recipient.
     *
     * @param  \Illuminate\Http\Request  $request The HTTP request containing the message.
     * @param  int|null  $receiverId The optional ID of the recipient of the message.
     * @return \Illuminate\Http\Response|null
     *
     * @throws \Exception When the message contains 3 or more numbers, or when the user has sent three or more messages containing numbers to the recipient.
     *
     * This method stores a message sent by the authenticated user to a specified recipient. If no recipient is provided, the method exits early.
     * The channel for broadcasting the message is "messenger.{receiver}", where "receiver" is the ID of the authenticated user
     * After broadcasting the message, the system listens for the "MessageSent" event.
     * @lrd:end
     *
     * @LRDparam message The message content to be sent (required).
     */
    public function store(Request $request, ?int $receiverId = null)
    {
        $request->validate([
            'message' => 'required|string'
        ]);

        // If receiverId is empty, return early
        if (empty($receiverId)) {
            return;
        }

        // Check if the message contains more than three numbers
        if (preg_match_all('/\d/', $request->message) > 3) {
            throw new \Exception('Message cannot contain more than three numbers.');
        }

        $user = User::find(auth()->id());

        $receiverUser = User::find($receiverId);

        if ($user->verified != "Verified") {
            abort(400, "Please verify your account by uploading a valid government ID");
        } 

        if (!$receiverUser->is_active) {
            return response()->json(["message" => "This account has been deactivated"], 400);
        }elseif ($receiverUser->verified != "Verified") {
            abort(400, "Message can't be sent because user isn't verified");
        }elseif ($receiverUser->suspend != null) {
            return response()->json(["message" => "This account has been suspended"], 400);
        }elseif($receiverUser->banned != null) {
            return response()->json(["message" => "This account has been banned"], 400);
        }else {
            
            // If the user is a cohost, get the host user
            if ($user->co_host == true) {
                $cohost = Cohost::where('user_id', $user->id)->first();
                $user = User::find($cohost->host_id);
            }

            // Check if the user has already sent three messages containing numbers to the receiver
            $messageCountWithNumbers = $this->chat->countMessagesWithNumbers($user->id, $receiverId);
            if (preg_match_all('/\d/', $request->message) && $messageCountWithNumbers >= 3) {
                throw new \Exception('You cannot send more than three messages containing numbers to a guest or host.');
            }

            try {
                // Send message to the main receiver
                $this->sendChatMessage($request->message, $user->id, $receiverId);

                // Send message to cohosts, if any
                $this->sendMessagesToCohosts($request->message, $user->id, $receiverId);

                // Increment the count if the message contains numbers
                if (preg_match('/\d/', $request->message)) {
                    Message::where('sender_id', $user->id)->increment('messages_with_numbers_count');
                }

                // Trigger event for message sent
                event(new MessageSent($request->message, $user->id, $receiverId));

                // Send notification email to the receiver
                $receiver = User::find($receiverId);

                
                $deviceToken = $receiver->device_token;

                if ($deviceToken) {

                    PushNotification::dispatch("Shrbo", 'You have a new message' ,$deviceToken);

                }
                Mail::to($receiver->email)->queue(
                    (new NewMessageMail($receiver, 'You have a new message'))->onQueue('emails')
                );

                return response("ok", 200);
            } catch (\Throwable $th) {
                Log::error($th->getMessage());
                return response($th, 422);
            }
            
        }
    }

    private function sendChatMessage($message, $senderId, $receiverId)
    {
        $this->chat->sendMessages([
            'message' => $message,
            'sender_id' => $senderId,
            'receiver_id' => $receiverId,
        ]);

        
        $notification = Notification::create([
            'user_id' => $receiverId,
            'message' => 'You have a new message',
        ]);

        event(new NewNotificationEvent($notification, $notification->id, $receiverId));
    }

    private function sendMessagesToCohosts($message, $senderId, $receiverId)
    {
        $receiver = User::find($receiverId);
        $sender = User::find($senderId);

        if ($receiver->cohosts()->exists()) {
            $cohosts = $receiver->cohosts()->with('user')->get();
            $uniqueCohosts = $cohosts->unique('user.email');
            
            // Queue messages to cohosts in batch for efficiency
            foreach ($uniqueCohosts as $cohost) {
                SendMailForChatToCohosts::dispatch($message, $senderId, $cohost->user_id, false);
                
                $notification = Notification::create([
                    'user_id' => $cohost->user_id,
                    'message' => 'You have a new message',
                ]);

                event(new NewNotificationEvent($notification, $notification->id, $cohost->user_id));

            }
        }
        if ($sender->cohosts()->exists()) {
            $cohosts = $sender->cohosts()->with('user')->get();
            $uniqueCohosts = $cohosts->unique('user.email');

            foreach ($uniqueCohosts as $cohost2) {
                SendMailForChatToCohosts::dispatch($message,$cohost2->user_id, $receiverId, true);
            }
        }
    }



}
