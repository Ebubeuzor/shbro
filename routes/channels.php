<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('new-public-channel', function ($user) {
    return true; 
});

Broadcast::channel('start-convo', function ($user) {
    return true; 
});

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('messanger.{receiver}', function ($user, $id) {
    // Check if the user is authenticated using Sanctum token
    return (int) $user->id === (int) $id;
});

Broadcast::channel('typing.{receiver}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('chat.user.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

Broadcast::channel('join.chat.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

Broadcast::channel('left.chat.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

Broadcast::channel('chat.admin.{adminId}', function ($user, $adminId) {    
    return (int) $user->id === (int) $adminId;
});

Broadcast::channel('chat.endsession.{userId}', function ($user, $userId) {    
    return (int) $user->id === (int) $userId;
});
