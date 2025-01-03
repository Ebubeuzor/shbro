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
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Kreait\Firebase\Factory;
use Kreait\Firebase\Messaging\CloudMessage;
use Illuminate\Support\Facades\Auth;

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
            Notification::where("user_id",$user->id)->latest()->paginate(10)
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
    public function sendNotificationToUser(Request $request)
    {
        $user = Auth::user();
        $deviceToken = $user->device_token;

        if (!$deviceToken) {
            return response()->json(['error' => 'No device token found for the user'], 400);
        }

        $notificationTitle = "Test Notification";
        $notificationBody = "This is a test push notification message.";

        try {
            // Initialize Firebase Messaging
            $firebase = (new Factory)
                ->withServiceAccount(storage_path('app/firebasecredentials.json'))
                ->createMessaging();

            // Create the notification message
            $message = CloudMessage::withTarget('token', $deviceToken)
                ->withNotification([
                    'title' => $notificationTitle,
                    'body' => $notificationBody,
                ])
                ->withData([
                    'additionalDataKey' => 'additionalDataValue',
                ]);

            // Send the notification
            $firebase->send($message);

            // Create a new notification record in the database
            $notification = new Notification();
            $notification->user_id = $user->id;  // Assuming you want to save the user ID
            $notification->Message = $notificationBody;
            $notification->save();
            // Broadcast the NewNotificationEvent to notify the WebSocket clients
            event(new NewNotificationEvent($notification, $notification->id, $user->id));

            return response()->json(['message' => 'Notification sent successfully']);
        } catch (\Exception $e) {
            // Log the exception and return an error response
            report($e);
            return response()->json(['error' => 'Failed to send notification: ' . $e->getMessage()], 500);
        }
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