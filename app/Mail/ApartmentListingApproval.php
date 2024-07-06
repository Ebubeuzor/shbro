<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ApartmentListingApproval extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(
        private $admin,
        private $hosthome,
        private $host,
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
        ->view("emails.apartmentListingApproval")
        ->with([
            "user" => $this->admin,
            "hosthome" => $this->hosthome,
            "hosthomeCreation" => $this->hosthome->created_at->format('M j, Y h:ia'),
            "host" => $this->host,
        ]);
    }
}
