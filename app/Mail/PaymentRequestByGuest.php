<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PaymentRequestByGuest extends Mailable
{
    use Queueable, SerializesModels;

    protected $user;
    protected $amount;
    protected $formattedDate;
    protected $title;

    public function __construct($user,$amount,$formattedDate,$title)
    {
        $this->user = $user;
        $this->amount = $amount;
        $this->formattedDate = $formattedDate;
        $this->title = $title;
    }
    
    public function build(){
        return $this->subject($this->title)
        ->view('emails.paymentRequestByGuest')
        ->with([
            'user' => $this->user,
            'formattedDate' => $this->formattedDate,
            'useramount' => $this->amount
        ]);
    }
}
