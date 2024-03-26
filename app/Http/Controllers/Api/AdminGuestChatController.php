<?php

namespace App\Http\Controllers\Api;

use App\Events\JoinChatEvent;
use App\Events\LeaveChatEvent;
use App\Events\MessageBroadcasted;
use App\Http\Controllers\Controller;
use App\Http\Requests\StartConversationRequest;
use App\Mail\NotificationMail;
use App\Models\AdminGuestChat;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;

class AdminGuestChatController extends Controller
{

    
    private function saveImage($image)
    {
        // Check if image is base64 string
        if (preg_match('/^data:image\/(\w+);base64,/', $image, $matches)) {
            $imageData = substr($image, strpos($image, ',') + 1);
            $imageType = strtolower($matches[1]);

            // Check if file is an image
            if (!in_array($imageType, ['jpg', 'jpeg', 'gif', 'png', 'webp'])) {
                throw new \Exception('Invalid image type');
            }

            // Decode base64 image data
            $decodedImage = base64_decode($imageData);

            if ($decodedImage === false) {
                throw new \Exception('Failed to decode image');
            }
        } else {
            throw new \Exception('Invalid image format');
        }

        $dir = 'images/';
        $file = Str::random() . '.' . $imageType;
        $absolutePath = public_path($dir);
        $relativePath = $dir . $file;

        if (!File::exists($absolutePath)) {
            File::makeDirectory($absolutePath, 0755, true);
        }

        // Save the decoded image to the file
        if (!file_put_contents($relativePath, $decodedImage)) {
            throw new \Exception('Failed to save image');
        }

        return $relativePath;
    }

    /**
     * @lrd:start
     * Marks the end of a chat session between an admin and a guest
     * Once admin leaves a chat session ensure to remove the receipient id so that a new session can start
     * - `adminId` (integer, required): The ID of the admin who is leaving the chat.
     * - `guestId` (integer, required): The ID of the guest with whom the admin was chatting.
     * - `status` (string, required): Status of the user just guest or admin
     *
     * Response:
     * - `200 OK`: The chat session has been successfully ended.
     * - `404 Not Found`: If the conversation is not found or has already ended.
     *
     * Events: 
     * - LeaveChatEvent: Broadcasts the admin's departure from the chat.
     *
     * Channel:
     * - left.chat.{guestId}: Listens for admin-related chat events.
     * - left.chat.{adminId}: Listens for user-related chat events.
     * @lrd:end
    */
    public function leaveChat(int $adminId, int $guestid,$status)
    {
        // Find the conversation between the admin and the user
        $conversation = AdminGuestChat::where('admin_id', $adminId)
            ->where('user_id', $guestid)
            ->whereNotNull('start_convo') // Ensure conversation has started
            ->whereNull('end_convo') // Ensure conversation is ongoing
            ->first();

        if (!$conversation) {
            return response()->json(['error' => 'Conversation not found or already ended'], 404);
        }

        // Update end_convo timestamp to mark the end of the conversation
        $conversation->update(['end_convo' => now()]);

        if ($status == 'admin') {
            $admin = User::findOrFail(auth()->id());

            $message = $admin->name . " has left the chat";

            event(new LeaveChatEvent($guestid,$adminId,$message,$status));
        }else {
            $guest = User::findOrFail(auth()->id());

            $message = $guest->name . " has left the chat";

            event(new LeaveChatEvent($guestid,$adminId,$message,$status));
        }
        

        return response()->json(['message' => 'Left the chat successfully']);
    }

    /**
     * @lrd:start
     * Initiates a conversation between a guest and an admin then after an admin joins
     * use this method to continue the conversation.
     *
     * Request Body:
     * - `message` (string, optional): The initial message sent by the guest.
     * - `image` (file, optional): An image attached by the guest.
     * - `recipient_id` (integer, optional): The ID of the admin to whom the guest wants to send the message.
     *
     * Response:
     * - `200 OK`: The conversation has been successfully initiated.
     *
     * Events:
     * - MessageBroadcasted: Broadcasts the message to the targeted admin.
     *
     * Channels:
     * - chat.admin.{recipient_id}: Listens for admin-related chat events.
     * - chat.user.{recipient_id}: Listens for user-related chat events.
     * @lrd:end
    */
    public function startConversation(StartConversationRequest $request)
    {
        $data = $request->validated();
        $authUser = User::find(auth()->id());

        $chat = new AdminGuestChat();
        $chat->user_id = Auth::id();
        
        if (!empty(isset($data['message']))) {
            $chat->message = $data['message'];
        }

        if (!empty(isset($data['image']))) {
            $chat->image = $this->saveImage($data['image']);
        }
        
        $chat->save();

        if (empty(isset($data['recipient_id']))) {
            $users = User::all();
            foreach ($users as $user) {
                if ($user->adminStatus != null) {
                    $message = $authUser->name . " has reqested assistant for a certain matter";
                    Mail::to($user->email)->send(new NotificationMail($authUser,$message,"A guest rquires Assistant"));
                }
            }
            
            event(new MessageBroadcasted($authUser, $data['message'], url($chat->image), $data['status'], null, $chat->id));
            return response()->json(['message' => 'Conversation started successfully']);
        }
        else {
            if (!empty(isset($data['image']))) {
                event(new MessageBroadcasted($authUser, $data['message'], url($chat->image), $data['status'], $data['recipient_id'], null));
            }else {
                event(new MessageBroadcasted($authUser, $data['message'], null, $data['status'], $data['recipient_id'], null));
            }

            return response()->json(['message' => 'Message sent']);
        }


    }

    /**
     * @lrd:start
     * Allows an admin to join an ongoing chat session with a guest.
     *
     * - `chatId` (integer, required): The ID of the chat session to join.
     * - `guestId` (integer, required): The ID of the guest with whom the admin is going to chat.
     *
     * Response:
     * - `200 OK`: The admin has successfully joined the chat.
     * - `404 Not Found`: If the chat session or guest is not found.
     *
     * Events:
     * - JoinChatEvent: Broadcasts the admin's presence in the chat.
     *
     * Channels:
     * - join.chat.{guestId}: Listens for admin-related chat events.
     * @lrd:end
    */
    public function joinChat($chatid, $guestid)
    {
        $admin = User::findOrFail(auth()->id());
        
        $existingChat = AdminGuestChat::where('id', $chatid)
        ->where('user_id',$guestid)
        ->first();

        if (!$existingChat) {
            abort(404, "Record not found");
        }

        if($existingChat->start_convo != null){
            abort(400, "Another Admin has already joined");
        }

        $existingChat->update([
            'admin_id' => $admin->id,
            'start_convo' => Carbon::now(),
        ]);

        $message = $admin->name . " has joined the chat";

        event(new JoinChatEvent($guestid, $message));

        return response("Joined Chat Successfully", 200);

    }

    /**
     * @lrd:start
     * Retrieves all unattended chat sessions where no admin has joined yet.
     *
     * Endpoint: GET /unattended-chats
     *
     * Response:
     * - `200 OK`: Returns a JSON object containing the list of unattended chat sessions.
     * 
     * now it can also happen real time to 
     * Channel:
     * - start-convo
     * Event:
     * MessageBroadcasted
     * @lrd:end
    */
    public function getUnattendedChats()
    {
        $unattendedChats = AdminGuestChat::whereNull('admin_id')
        ->whereNull('start_convo')
        ->get();

        return response()->json(['unattended_chats' => $unattendedChats]);
    }
    
    
    /**
     * @lrd:start
     * Retrieves all messages exchanged between a specific admin and user within a chat session.
     *
     * Endpoint: GET /chat-messages/{adminId}/{userId}
     * - `adminId` (integer, required): The ID of the admin.
     * - `userId` (integer, required): The ID of the user.
     *
     * Response:
     * - `200 OK`: Returns a JSON object containing the list of chat messages.
     *
     * Channels:
     * - None
     * @lrd:end
     */
    public function getChatMessages($adminId, $userId)
    {
        // Retrieve all messages for the given admin and user IDs within the current session
        $chatMessages = AdminGuestChat::where(function ($query) use ($adminId, $userId) {
            $query->where('admin_id', $adminId)
                ->where('user_id', $userId);
        })
        ->whereNotNull('start_convo') // Ensure conversation has started
        ->where(function ($query) {
            $query->whereNull('end_convo') // Conversation is ongoing
                ->orWhereNotNull('end_convo'); // Conversation has ended
        })
        ->orderBy('created_at', 'asc') // Order messages by creation time
        ->get();

        return response()->json(['chat_messages' => $chatMessages]);
    }

    
    /**
     * @lrd:start
     * Retrieves all messages exchanged within a session range.
     *
     * Endpoint: GET /session-messages
     *
     * Response:
     * - `200 OK`: Returns a JSON object containing the list of session messages.
     *
     * Channels:
     * - None
     * @lrd:end
    */
    public function getSessionMessages()
    {
        // Retrieve all messages within the session range
        $sessionMessages = AdminGuestChat::whereNotNull('start_convo') // Ensure conversation has started
            ->whereNotNull('end_convo') // Ensure conversation has ended
            ->orderBy('created_at', 'asc') // Order messages by creation time
            ->get();

        $sessionData = [];
        foreach ($sessionMessages as $message) {
            $sessionData[] = [
                'user_id' => $message->user_id,
                'admin_id' => $message->admin_id,
                'message' => $message->message,
                'image' => $message->image,
                'created_at' => $message->created_at,
                // Add other fields as needed
            ];
        }

        return response()->json(['session_messages' => $sessionData]);
    }

}
