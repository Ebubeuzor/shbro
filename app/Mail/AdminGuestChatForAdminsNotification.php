<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdminGuestChatForAdminsNotification extends Mailable
{
    use Queueable, SerializesModels;

    protected $guest;
    protected $message;
    protected $title;
    protected $formattedTime;
    protected $admin;

    public function __construct($guest,$message,$title,$formattedTime,$admin)
    {
        $this->guest = $guest;
        $this->message = $message;
        $this->title = $title;
        $this->formattedTime = $formattedTime;
        $this->admin = $admin;
    }
    
    public function build(){
        return $this->subject($this->title)
        ->view('emails.newGuestLiveChat')
        ->with([
            'guest' => $this->guest,
            'formattedTime' => $this->formattedTime,
            'admin' => $this->admin,
            'usermessage' => $this->message
        ]);
    }
}
