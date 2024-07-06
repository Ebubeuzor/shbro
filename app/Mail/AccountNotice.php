<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AccountNotice extends Mailable
{
    use Queueable, SerializesModels;

    protected $user;
    protected $message;
    protected $title;
    protected $formattedDate;
    protected $viewToUse;

    public function __construct($user,$message,$title,$formattedDate,$viewToUse)
    {
        $this->user = $user;
        $this->message = $message;
        $this->title = $title;
        $this->formattedDate = $formattedDate;
        $this->viewToUse = $viewToUse;
    }
    
    public function build(){
        return $this->subject($this->title)
        ->view($this->viewToUse)
        ->with([
            'user' => $this->user,
            'formattedDate' => $this->formattedDate,
            'usermessage' => $this->message
        ]);
    }
}
