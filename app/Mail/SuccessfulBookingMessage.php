<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SuccessfulBookingMessage extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        private $host,
        private $guest,
        private $hosthome,
        private $checkInDate,
        private $checkOutDate,
        private $title,
    )
    {
        //
    }

    /**
     * Get the message envelope.
     *
     * @return \Illuminate\Mail\Mailables\Envelope
     */
    public function build(){
        return $this->subject($this->title)
        ->view("emails.successfulBookingMessage")
        ->with([
            "host" => $this->host,
            "guest" => $this->guest,
            "hosthome" => $this->hosthome,
            "checkInDate" => $this->checkInDate,
            "checkOutDate" => $this->checkOutDate,
        ]);
    }
}
