<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdminToUsers extends Mailable
{
    use Queueable, SerializesModels;

    protected $user;
    protected $message;
    protected $title;

    public function __construct($user,$message,$title)
    {
        $this->user = $user;
        $this->message = $message;
        $this->title = $title;
    }
    
    public function build(){
        return $this->subject($this->title)
        ->view('emails.adminToUsers')
        ->with([
            'user' => $this->user,
            'title' => $this->title,
            'usermessage' => $this->message
        ]);
    }
}
