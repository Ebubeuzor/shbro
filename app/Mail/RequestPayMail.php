<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RequestPayMail extends Mailable
{
    use Queueable, SerializesModels;

    protected $user;
    protected $amount;
    protected $title;

    public function __construct($user,$amount,$title)
    {
        $this->user = $user;
        $this->amount = $amount;
        $this->title = $title;
    }
    
    public function build(){
        return $this->subject($this->title)
        ->view('emails.paymentRequestReceived')
        ->with([
            'user' => $this->user,
            'amount' => $this->amount
        ]);
    }
}
