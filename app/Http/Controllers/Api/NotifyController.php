<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Http\Requests\StoreNotificationRequest;
use App\Http\Requests\UpdateNotificationRequest;
use App\Http\Resources\NotificationResource;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class NotifyController extends Controller
{
    
    public function index()
    {
        $user = Auth::user();
        return NotificationResource::collection(
            User::whereId($user->id)->get()
        );
    }

    public function destroy(Notification $notification)
    {
        $notification->delete();
        return response("Done");
    }
}
