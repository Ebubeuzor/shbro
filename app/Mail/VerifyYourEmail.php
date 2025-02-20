<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VerifyYourEmail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    protected $user;
    protected $mobileRequest;

    public function __construct($user, $mobileRequest)
    {
        $this->user = $user;
        $this->mobileRequest = $mobileRequest;
    }

    public function build()
    {
        return $this->subject('Activate your account by verifying your email address.')
        ->view('emails.verify-email')
        ->with([
            'user' => $this->user,
            'mobileRequest' => $this->mobileRequest
        ])
        ;    
    }
}
