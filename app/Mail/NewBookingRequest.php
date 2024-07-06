<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewBookingRequest extends Mailable
{
    use Queueable, SerializesModels;

    protected $user;
    protected $title;

    public function __construct($user,$title)
    {
        $this->user = $user;
        $this->title = $title;
    }
    
    public function build(){
        return $this->subject($this->title)
        ->view('emails.newBookingRequest')
        ->with([
            'user' => $this->user
        ]);
    }
}
