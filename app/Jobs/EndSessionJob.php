<?php

namespace App\Jobs;

use App\Events\SessionEnded;
use App\Models\AdminGuestChat;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class EndSessionJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle()
    {
        // Retrieve all active sessions
        $activeSessions = AdminGuestChat::get()->groupBy('session_id');

        foreach ($activeSessions as $session) {
            // Check if the session has both start_convo and end_convo values
            $startConvo = $session->first(function ($message) {
                return !is_null($message->start_convo);
            });

            $lastMessage = $session->last();

            if ($startConvo && $lastMessage) {
                // Check if the last message already has end_convo value
                if (is_null($lastMessage->end_convo)) {
                    // Calculate the time difference between the last message and the current time
                    $lastMessageSentAt = Carbon::parse($lastMessage->created_at);
                    $now = Carbon::now();
                    $minutesSinceLastMessage = $now->diffInMinutes($lastMessageSentAt);

                    // Check if the last message was sent more than 5 minutes ago
                    if ($minutesSinceLastMessage >= 7) {
                        // Update the end_convo field of the last message
                        $lastMessage->update(['end_convo' => $now]);

                        // Broadcast session ended event
                        event(new SessionEnded($lastMessage->admin_id, $lastMessage->user_id));
                    }
                }
            }
        }
    }


}
