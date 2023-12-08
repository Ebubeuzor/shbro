<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VerifyUser extends Mailable
{
    use Queueable, SerializesModels;

    protected $status;

    public function __construct($status)
    {
        $this->status = $status;
    }

    public function build()
    {
        return $this->subject("shbro")
        ->view('emails.VerifyUser')
        ->with([
            'status' => $this->status
        ])
        ;
    }

}
