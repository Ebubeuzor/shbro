<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PaymentRequestApproved extends Mailable
{
    use Queueable, SerializesModels;

    protected $user;
    protected $deductedAmount;
    protected $title;
    protected $paymentDate;

    public function __construct($user, $deductedAmount ,$title, $paymentDate)
    {
        $this->user = $user;
        $this->deductedAmount = $deductedAmount;
        $this->title = $title;
        $this->paymentDate = $paymentDate;
    }
    
    public function build(){
        return $this->subject($this->title)
        ->view("emails.paymentRequestApproved")
        ->with([
            'user' => $this->user,
            'amount' => $this->deductedAmount,
            'paymentDate' => $this->paymentDate,
        ]);
    }
}
