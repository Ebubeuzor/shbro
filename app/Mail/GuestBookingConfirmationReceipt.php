<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class GuestBookingConfirmationReceipt extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(
        private $user,
        private $hosthome,
        private $checkin,
        private $checkout,
        private $title,
    )
    {
        //
    }

    public function build() {
        return $this->subject($this->title)
        ->view("emails.guestBookingConfirmationReceipt")
        ->with([
            'user' => $this->user,
            'hosthome' => $this->hosthome,
            'checkin' => $this->checkin,
            'checkout' => $this->checkout,
        ]);
    }
}
