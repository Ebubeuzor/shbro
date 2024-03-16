<?php

namespace App\Repository;

use App\Models\Message;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ChatRepository
{
    public function getUserMessages(int $senderId,int $receiverId)
    {
        return Message::whereIn('sender_id', [$senderId,$receiverId])
        ->whereIn('receiver_id', [$senderId,$receiverId])
        ->get();
    }
    
    public function countMessagesWithNumbers($userId, $senderOrReceiverId)
    {
        return Message::where(function($query) use ($userId, $senderOrReceiverId) {
                $query->where('sender_id', $userId)
                    ->where('receiver_id', $senderOrReceiverId);
            })
            ->orWhere(function($query) use ($userId, $senderOrReceiverId) {
                $query->where('receiver_id', $userId)
                    ->where('sender_id', $senderOrReceiverId);
            })
            ->whereRaw('LENGTH(message) - LENGTH(REPLACE(message, \'0\', \'\')) +
                        LENGTH(message) - LENGTH(REPLACE(message, \'1\', \'\')) +
                        LENGTH(message) - LENGTH(REPLACE(message, \'2\', \'\')) +
                        LENGTH(message) - LENGTH(REPLACE(message, \'3\', \'\')) +
                        LENGTH(message) - LENGTH(REPLACE(message, \'4\', \'\')) +
                        LENGTH(message) - LENGTH(REPLACE(message, \'5\', \'\')) +
                        LENGTH(message) - LENGTH(REPLACE(message, \'6\', \'\')) +
                        LENGTH(message) - LENGTH(REPLACE(message, \'7\', \'\')) +
                        LENGTH(message) - LENGTH(REPLACE(message, \'8\', \'\')) +
                        LENGTH(message) - LENGTH(REPLACE(message, \'9\', \'\')) > 0')
            ->count();
    }

    
    public function getRecentUserMessages(int $senderId)
    {
        DB::statement("SET SESSION sql_mode=''");

        $recentMessages =  Message::where(function($query) use ($senderId) {
            $query->where('sender_id',$senderId)
            ->orWhere('receiver_id',$senderId);
        })->groupBy('sender_id','receiver_id')
        ->select('sender_id','receiver_id','message')
        ->orderBy('id', 'desc')
        ->limit(30)
        ->get();



        return $this->getfilterRecentMessages($recentMessages,$senderId);
    }

    public function getfilterRecentMessages($recentMessages, $senderId){
        $recentUserWithMessage = [];
        $usedUserIds = [];
        foreach ($recentMessages as $message) {
            $userId = $message->sender_id == $senderId ? $message->receiver_id : $message->sender_id;
            if (!in_array($userId, $usedUserIds)) {
                $recentUserWithMessage[] = [
                    'user_id' => $userId,
                    'message' => $message
                ];
                $usedUserIds[] = $userId;
            }
            
        }

        foreach ($recentUserWithMessage as $key => $userMessage) {
            $recentUserWithMessage[$key]['name'] = User::whereId($userMessage['user_id'])->value('name') ?? '';
        }

        return $recentUserWithMessage;
    }
    
    public function sendMessages(array $data)
    {
        return Message::create($data);
    }
}

