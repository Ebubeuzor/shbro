<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BookingCancellation extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(
        private $host,
        private $guest,
        private $hosthome,
        private $formattedDate,
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
        ->view("emails.bookingCancellation")
        ->with([
            "host" => $this->host,
            "guest" => $this->guest,
            "hosthome" => $this->hosthome,
            "formattedDate" => $this->formattedDate,
            "checkInDate" => $this->checkInDate,
            "checkOutDate" => $this->checkOutDate,
        ]);
    }
}
