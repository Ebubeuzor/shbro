<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ListingApproved extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        private $user,
        private $hosthome,
        private $title,
    )
    {
        //
    }

    public function build(){
        return $this->subject($this->title)
        ->view("emails.listingApproved")
        ->with([
            "user" => $this->user,
            "hosthome" => $this->hosthome
        ]);
    }
}
