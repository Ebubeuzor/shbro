<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class FirstHomeWelcomeMessageMail extends Mailable
{
    use Queueable, SerializesModels;

    
    public function __construct(
        protected $user
    )
    {
        
    }

    public function build()
    {
        return $this->subject('Congratulations! Your Shrbo Hosting Journey Begins')
        ->view('emails.firstHomeWelcomeMessage',[
            'user' => $this->user
        ]);
    }
}
