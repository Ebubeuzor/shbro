<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DisapproveHostHome extends Mailable
{
    use Queueable, SerializesModels;

    protected $user;
    protected $message;
    protected $hosthome;
    protected $title;

    public function __construct($user,$message,$hosthome,$title)
    {
        $this->user = $user;
        $this->message = $message;
        $this->hosthome = $hosthome;
        $this->title = $title;
    }
    
    public function build(){
        return $this->subject($this->title)
        ->view('emails.disapproveHostHome')
        ->with([
            'user' => $this->user,
            'title' => $this->title,
            'hosthome' => $this->hosthome,
            'usermessage' => $this->message
        ]);
    }
}
