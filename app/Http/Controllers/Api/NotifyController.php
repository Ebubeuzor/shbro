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
     * Sends a notification to the authenticated user.
     *
     * @return \Illuminate\Http\JsonResponse A JSON response indicating the success of the notification sending.
     *
     * This method sends a notification to the authenticated user. After saving the notification to the database, it broadcasts the "NewNotificationEvent" to notify WebSocket clients.
     * The channel for broadcasting the notification is "App.Models.User.{id}", where "id" is the ID of the authenticated user.
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
