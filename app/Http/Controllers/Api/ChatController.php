<?php

namespace App\Http\Controllers\Api;

use App\Events\MessageSent;
use App\Events\Typing;
use App\Http\Controllers\Controller;
use App\Mail\NotificationMail;
use App\Models\Message;
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
    public function typing(Request $request,$receiverId,$senderid)
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

        if (empty($receiverId)) {
            return;
        }
        
        // Check if the message contains five numbers
        if (preg_match_all('/\d/', $request->message) > 3) {
            throw new \Exception('Message cannot contain three numbers.');
        }

        // Check if the user has already sent three messages containing numbers
        $user = $request->user();
        $messageCountWithNumbers = $this->chat->countMessagesWithNumbers($user->id,$receiverId);

        if (preg_match_all('/\d/', $request->message) && $messageCountWithNumbers >= 3) {
            throw new \Exception('You cannot send more than three messages containing numbers to a guest or host.');
        }

        try {
            $message = $this->chat->sendMessages([
                'message' => $request->message,
                'sender_id' => $user->id,
                'receiver_id' => $receiverId,
            ]);

            // If the message is sent successfully, increment the count
            if (preg_match('/\d/', $request->message)) {
                Message::where('sender_id',$user->id)->increment('messages_with_numbers_count');
            }

            event(new MessageSent($request->message,auth()->id(), $receiverId));
            $userToReceive = User::whereId($receiverId)->first();
            Mail::to($userToReceive->email)->queue(new NotificationMail($userToReceive, Auth::user()->name . ' sent an message', 'Sent a message'));
            return response("ok", 200);
        } catch (\Throwable $th) {
            Log::info($th->getMessage());
            return response($th, 422);
        }
    }



}
