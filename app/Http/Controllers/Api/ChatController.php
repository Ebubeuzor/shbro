<?php

namespace App\Http\Controllers\Api;

use App\Events\MessageSent;
use App\Http\Controllers\Controller;
use App\Mail\NotificationMail;
use App\Models\Message;
use App\Models\User;
use App\Repository\ChatRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

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
        // $messages = Message::where('sender_id', $request->user()->id)->get();
        return response([
            'messages' => $messages,
            'recentMessages' => $this->chat->getRecentUserMessages($request->user()->id),
            'receiver' => User::find($receiverId)
        ]);
    }

    
    /**
     * @lrd:start
     * this gets all an authenticated user messages and who sent them
     * {receiverId?} is the person id who you want to send the message
     * the channel is private-messanger.{sender}.{receiver} 
     * and then listen to MessageSent
     * sender being the auth user id
     * receiver being the person id who you want to send the message 
     * @lrd:end
     */
    public function store(Request $request, ?int $receiverId = null)
    {
        $request->validate([
            'message' => 'required|string'
        ]);

        if (empty($receiverId)) {
            return;
        }

        Log::info("Start");
        
        // Check if the message contains five numbers
        if (preg_match_all('/\d/', $request->message) >= 5) {
            throw new \Exception('Message cannot contain five numbers.');
        }

        // Check if the user has already sent three messages containing numbers
        $user = $request->user();
        $messageCountWithNumbers = $this->chat->countMessagesWithNumbers($user->id);

        if ($messageCountWithNumbers >= 3) {
            throw new \Exception('You cannot send more than three messages containing numbers.');
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

            broadcast(new MessageSent($request->message, auth()->id(), $receiverId));
            $userToReceive = User::whereId($receiverId)->first();
            Mail::to($userToReceive->email)->send(new NotificationMail($userToReceive, Auth::user()->name . ' sent an message', 'Sent a message'));
            return response("ok", 200);
        } catch (\Throwable $th) {
            Log::info($th->getMessage());
            return response($th, 422);
        }
    }

}
