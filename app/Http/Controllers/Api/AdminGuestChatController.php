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
     * Once admin or guest leaves a chat session ensure to remove the receipient id so that a new session can start and broadcast the channels and event below so thta the admin or guest may know when the other left 
     * the chat session
     * 
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
            ->orderBy('created_at', 'desc') 
            ->first();

        if (!$conversation) {
            return response()->json(['error' => 'Conversation not found or already ended'], 404);
        }

        // Update end_convo timestamp to mark the end of the conversation
        
        info($status);

        if ($status == 'admin') {
            $admin = User::findOrFail(auth()->id());

            $message = $admin->name . " has left the chat";

            event(new LeaveChatEvent($guestid,$adminId,$message,$status));
        }else {
            $guest = User::findOrFail(auth()->id());

            $message = $guest->name . " has left the chat";
            
            event(new LeaveChatEvent($guestid,$adminId,$message,$status));
        }
        
        $conversation->update(['end_convo' => now()]);

        return response()->json(['message' => 'Left the chat successfully']);
    }

    /**
     * @lrd:start
     * Initiates a conversation between a guest and an admin. After an admin joins, use this method to continue the conversation.
     * Now when you dont have a recipient_id it means that you (guests) are just starting the conservation you are sending message to all admins 
     * if this is the case then use the public channel to send all messages real time to all admins who are online real time with start-convo look at the joinchat route for the continuation.
     * 
     * Now that you the recipient_id which is the adminId and chat_session_id store them and use the when sending the next request for the guest and use the 
     * chat.admin.{recipient_id}: to listens for when a guest sends a message to an admin.
     * 
     * Now for the admin use this api endpoind too to send message to a guest the recipient_id which is the guestId and chat_session_id store them also in the admin side and use them for the session.
     * now use the below event for the above channels.
     * 
     * Request Body:
     * - `message` (string, optional): The initial message sent by the guest.
     * - `image` (file, optional): An image attached by the guest.
     * - `status` (string): Use "guest" for inquiries by guests and "admin" for responses by admins.
     * - `recipient_id` (integer, optional): The ID of the admin to whom the guest wants to send the message.
     * - `chat_session_id` (string, optional): The ID of the chat session. If not provided, a new session will be created.
     *
     * Response:
     * - `200 OK`: The conversation has been successfully initiated or continued.
     *
     * Events:
     * - MessageBroadcasted: Broadcasts the message to the targeted admin or guest.
     *
     * Channels:
     * - start-convo: Listens when a user (guest) starts a conversation.
     * - chat.admin.{recipient_id}: Listens for admin-related chat events.
     * - chat.user.{recipient_id}: Listens for user-related chat events.
     *
     * After 7 minutes of inactivity, both the admin and guest will receive a notification saying the session has ended so once its three mintues you should create a timer on bothe sides
     * And once the time ends , it will automatically close the chat so empty the recipient_id and chat_session_id if they are online or you tell them to leave if they try to send a message after a seesion has ended 
     * either way my response will guide you on that.
     *
     *  Events:
     * - SessionEnded: Broadcasts a notification to both the admin and guest when the session ends due to inactivity.
     * 
     * Channels:
     * - chat.endsession.adminId: Channel to notify the admin when a session ends.
     * - chat.endsession.userId: Channel to notify the user when a session ends.
     *
     * Note: If `chat_session_id` is provided, it should be the ID of an existing session. Use `recipient_id` to specify the recipient admin or guest id.
     * If `chat_session_id` is not provided, a new session will be created, and the recipient admin or guest id must be specified with `recipient_id`.
     *
     * If the chat session has already ended or the user has an active session with another admin, appropriate error responses will be returned.
     * Chat Session Already Ended
     * 
     * Error Code: 400
     * Error Message: "Chat session has already ended. Please start a new session."
     * Active Session with Another Admin
     * 
     * Error Code: 400
     * Error Message: "You already have an active chat session. Please end it before starting a new one or try again later."
     * @lrd:end
    */
    public function startConversation(StartConversationRequest $request)
    {
        $data = $request->validated();

        $user = null;
        $token = null;

        if (Auth::guard('sanctum')->check()) {
            $user = Auth::guard('sanctum')->user(); // Authenticated user via API token
        } else {
            if (empty($data['name']) || empty($data['email']) ) {
                return response("Please enter your name and email",422);
            }else {
                
                // User is not authenticated, check if email exists in the database
                $existingUser = User::where('email', $data['email'])->first();
        
                // If email does not exist, create a temporary guest account
                if (!$existingUser) {
                    $user = new User();
                    $user->name = $data['name'];
                    $user->email = $data['email'];
                    $user->is_guest = true; 
                    $user->save();
    
                }else {
                    $user = $existingUser;
                }

                if(empty($data['token'])){
                    $token = $user->createToken('main')->plainTextToken;
                }
            }
        }

        $recipient_id = intval($data['recipient_id']);
        $endedConvo = null;

        if (isset($data['chat_session_id'])) {
            
            if ($data['status'] == "guest") {
                $endedConvo = AdminGuestChat::where('admin_id', $recipient_id)
                ->where('session_id', $data['chat_session_id'])
                ->whereNotNull('end_convo')
                ->orderBy('created_at', 'desc') 
                ->first();
            } else {
                $endedConvo = AdminGuestChat::where('user_id', $recipient_id)
                ->where('session_id', $data['chat_session_id'])
                ->whereNotNull('end_convo')
                ->orderBy('created_at', 'desc') 
                ->first();
            }
            
            if ($endedConvo) {
                abort(400, "Chat session has already ended please leave and start another session");
            }
            
        }


        if ($data['status'] == "guest" && !empty(isset($data['chat_session_id']))) {
            $existingSession = AdminGuestChat::where('user_id', $user->id)
            ->whereNull('end_convo')
            ->orderBy('session_id', 'desc')
            ->first();

            if ($existingSession && $existingSession->admin_id != null && $existingSession->session_id != $data['chat_session_id']) {
                abort(400, "You already have an active chat session. Please end it before starting a new one or try again later.");
            }
        }
        
        $authUser = User::find($user->id);



        // Generate a unique session ID
        $sessionId = Str::uuid();
        $chat = new AdminGuestChat();

        $existingChat = AdminGuestChat::where('user_id', $user->id)
        ->whereNull('admin_id')
        ->where('created_at', '>=', now()->subMinutes(15))
        ->first();

        $chat->user_id = $user->id;
        $chat->status = $data['status'];



        if ($existingChat) {
            $chat->session_id = $existingChat->session_id;
        }elseif (empty(isset($data['chat_session_id']))) {
            $existingSessionIds = AdminGuestChat::pluck('session_id')->toArray();
            
            // Keep generating a new session ID until it's unique within the existing session IDs
            do {
                $sessionId = Str::uuid();
            } while (in_array($sessionId, $existingSessionIds));

            $chat->session_id = $sessionId;
        }else {
            $chat->session_id = $data['chat_session_id'];
        }
        

        if (!empty(isset($data['message']))) {
            $chat->message = $data['message'];
        }

        if (!empty(isset($data['image']))) {
            $chat->image = $this->saveImage($data['image']);
        }
        
        $chat->save();
        $imageUrl = !empty($chat->image) ? url($chat->image) : null;

        if (empty(isset($data['recipient_id']))) {
            $users = User::all();
            foreach ($users as $user) {

                if ($user->adminStatus != null && $user->id != 1) {
                    $message = $authUser->name . " has reqested assistant for a certain matter";
                    Mail::to($user->email)->queue(new NotificationMail($authUser,$message,"A guest rquires Assistant"));
                }
            }
            event(new MessageBroadcasted($authUser, $data['message'], $imageUrl, $data['status'], null, $chat->id,$data['chat_session_id'], $chat->created_at));

            return response()->json([
                'message' => 'Conversation started successfully',
                'user_id' => $authUser->id,
                'token' => $token
            ]);
        }
        else {

            $updateChat = AdminGuestChat::find($chat->id);

            if ($data['status'] == "guest") {
                $updateChat->update([
                    'admin_id' => $data['recipient_id']
                ]);
            }else {
                $updateChat->update([
                    'admin_id' => $user->id,
                    'user_id' => $data['recipient_id']
                ]);
            }

            event(new MessageBroadcasted($authUser, $data['message'], $imageUrl, $data['status'], $recipient_id, $chat->id,$data['chat_session_id'], $chat->created_at));
            

            return response()->json(
                [
                    'message' => 'Message sent',
                    'user_id' => $authUser->id,
                    'token' => $token
                ]
            );
        }


    }


    /**
     * @lrd:start
     * Allows an admin to join an ongoing chat session with a guest.
     * Now when an admin joins listen to the private channel below and get the message admin name has joined along with adminId and the chat sessionid which you will use for the chat session
     * Move back to the startconversation route.
     * 
     * Request Parameters:
     * - `guestId` (integer, required): The ID of the guest with whom the admin is going to chat.
     * - `sessionId` (string, required): The ID of the chat session to join.
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
    public function joinChat($guestid, $sessionId)
    {
        $admin = User::findOrFail(auth()->id());
        
        // Find all messages sent by the user within the same session
        $chatsToUpdate = AdminGuestChat::where('user_id', $guestid)
            ->where('session_id', $sessionId)
            ->orderBy('created_at') // Ensure messages are ordered by creation time
            ->get();

        // Ensure that there are messages for the given user and session
        if ($chatsToUpdate->isEmpty()) {
            abort(404, "Record not found");
        }

        // Check if another admin has already joined the chat
        if ($chatsToUpdate->first()->admin_id !== null) {
            abort(400, "Another admin has already joined the chat");
        }

        // Update the first message with admin_id and start_convo timestamp
        $chatsToUpdate->first()->update([
            'admin_id' => $admin->id,
            'start_convo' => Carbon::now(),
        ]);

        // Update admin_id for subsequent messages
        $chatsToUpdate->shift(); // Remove the first message
        $chatsToUpdate->each(function ($chat) use ($admin) {
            $chat->update(['admin_id' => $admin->id]);
        });

        $message = $admin->name . " has joined the chat";

        event(new JoinChatEvent(auth()->id(), $guestid, $message, $sessionId));

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
     * This endpoint listens for the 'start-convo' channel and triggers the 'MessageBroadcasted' event in real-time.
     * 
     * Public Channel:
     * - start-convo
     * 
     * Events:
     * - MessageBroadcasted
     * 
     * @lrd:end
    */
    public function getUnattendedChats()
    {
        $latestChatsSubquery = AdminGuestChat::selectRaw('MAX(id) as latest_id')
            ->whereNull('admin_id')
            ->whereNull('start_convo')
            ->groupBy('session_id');
    
        // Use the subquery to get the full rows of the latest chats
        $unattendedChats = AdminGuestChat::whereIn('id', $latestChatsSubquery)
            ->get();
    
        return response()->json(['unattended_chats' => $unattendedChats]);
    }
    
    
    /**
     * @lrd:start
     * Retrieves all messages exchanged between a specific admin and user within a chat session.
     *
     * - `adminId` (integer, optional): The ID of the admin. If not provided, messages from all admins to the user will be retrieved.
     * - `userId` (integer, required): The ID of the user.
     * - `sessionId` (string, optional): The session ID of the chat. If not provided, messages from all sessions will be retrieved.
     *
     * Response:
     * - `200 OK`: Returns a JSON object containing the list of chat messages.
     *
     * Channels:
     * - None
     * @lrd:end
    */
    public function getChatMessages($adminId = null, $userId, $sessionId = null)
    {
        
        // Convert 'null' string literals to actual null values
        $adminId = $adminId == 'null' ? null : $adminId;
        $sessionId = $sessionId == 'null' ? null : $sessionId;

        // Initialize the query

        $query = AdminGuestChat::where('user_id', $userId);

        // If adminId is not null, add the condition to filter by adminId
        if (!is_null($adminId)) {
            $query->where('admin_id', $adminId);
        }
        
        
        // If sessionId is not null, add the condition to filter by sessionId
        if (!is_null($sessionId)) {
            $query->where('session_id', $sessionId);
        } 
        
        if ($sessionId == null && $adminId == null) {
            
            $query->whereNull('admin_id') 
                ->whereNull('start_convo'); 
        }

        // Execute the query to retrieve chat messages
        $chatMessages = $query->get();

        // Modify the chat messages to include the image URL if available
        $chatMessages->map(function ($message) {
            if (!empty($message->image)) {
                $message->image = url($message->image);
            } else {
                $message->image = null;
            }
            return $message;
        });

        return response()->json(['chat_messages' => $chatMessages]);
    }



    
    /**
     * @lrd:start
     * Retrieves all messages exchanged within active chat sessions, along with session details.
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
        // Retrieve all messages grouped by session_id
        $sessionMessages = AdminGuestChat::orderBy('created_at', 'asc') // Order messages by creation time
            ->with('user', 'admin') // Eager load user and admin details
            ->get()
            ->groupBy('session_id');

        $sessionData = [];

        // Loop through each session group
        foreach ($sessionMessages as $sessionId => $messages) {
            // Check if the session has both start_convo and end_convo values
            $startConvo = $messages->first(function ($message) {
                return !is_null($message->start_convo);
            });

            $endConvo = $messages->last(function ($message) {
                return !is_null($message->end_convo);
            });

            // Only include sessions where both start_convo and end_convo are not null
            if (!is_null($startConvo) && !is_null($endConvo)) {
                $session = [
                    'session_id' => $sessionId,
                    'dateOfChat' => $startConvo->created_at->format('M j, Y, g:i A'),
                    'user_name' => $startConvo->user ? $startConvo->user->name : null,
                    'user_email' => $startConvo->user ? $startConvo->user->email : null,
                    'admin_name' => $startConvo->admin ? $startConvo->admin->name : null,
                    'admin_email' => $startConvo->admin ? $startConvo->admin->email : null,
                    'messages' => []
                ];

                // Loop through messages in the session
                foreach ($messages as $message) {
                    $session['messages'][] = [
                        'message' => $message->message,
                        'image' => $message->image != null ? url($message->image) : null,
                        'whoSentMessage' => $message->status,
                        'created_at' => $message->created_at,
                        // Add other fields as needed
                    ];
                }

                // Add the session data to the result array
                $sessionData[] = $session;
            }
        }

        return response()->json(['session_messages' => $sessionData]);
    }


    


}
