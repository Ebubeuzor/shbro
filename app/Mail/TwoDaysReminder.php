<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TwoDaysReminder extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        private $user,
        private $title,
    )
    {
        //
    }

    public function build(){
        return $this->subject($this->title)
        ->view("emails.twoDaysReminder")
        ->with([
            "user" => $this->user
        ]);
    }
}
