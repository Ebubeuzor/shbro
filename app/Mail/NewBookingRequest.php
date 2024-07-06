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
    protected $hosthome;
    protected $title;

    public function __construct($user,$hosthome,$title)
    {
        $this->user = $user;
        $this->hosthome = $hosthome;
        $this->title = $title;
    }
    
    public function build(){
        return $this->subject($this->title)
        ->view('emails.newBookingRequest')
        ->with([
            'user' => $this->user,
            'hosthome' => $this->hosthome,
        ]);
    }
}
