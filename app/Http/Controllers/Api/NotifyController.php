<?php

namespace App\Http\Controllers\Api;

use App\Events\NewNotificationEvent;
use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Http\Requests\StoreNotificationRequest;
use App\Http\Requests\UpdateNotificationRequest;
use App\Http\Resources\NotificationResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class NotifyController extends Controller
{
 
    
    /**
     * @lrd:start
     * this gets all an authenticated user notification
     * @lrd:end
     */
    public function index()
    {
        $user = Auth::user();
        return NotificationResource::collection(
            User::whereId($user->id)->get()
        );
    }
    
    /**
     * @lrd:start
     * install laravel-echo and pusher-js
     * and then Configure Laravel Echo
     * use these values
     * broadcaster: 'pusher',
     * key: Laravel8ee0b2f6fbb5f883afe1,
     * cluster: 'mt1',
     * wsHost: domain.pusher.com`,
     * wsPort: 80,
     * wssPort:  443,
     * forceTLS: 'https',
     * enabledTransports: ['ws', 'wss'],
     * the channel is private-App.Models.User.{id} id being the auth user id
     * and then listen to NewNotificationEvent
     * @lrd:end
     */
    public function sendNotificationToUser()
    {
        $user = Auth::user();

        // Create a new notification record in the database
        $notification = new Notification();
        $notification->user_id = $user->id;  // Assuming you want to save the user ID
        $notification->Message = 'Test notification message';
        $notification->save();
        Log::info('Notification saved: ' . $notification->id);
        // Broadcast the NewNotificationEvent to notify the WebSocket clients
        broadcast(new NewNotificationEvent($notification, $notification->id));

        return response()->json(['message' => 'Notification sent successfully']);
    }

    /**
     * @lrd:start
     * this deletes all an authenticated user notification and it accepts the notification id in the url 
     * @lrd:end
     */
    public function destroy(Notification $notification)
    {
        $notification->delete();
        return response("Done");
    }
}
