<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ApartmentCreationFailedMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(
        private $user
    )
    {
        //
    }

    
    public function build()
    {
        return $this->subject('Apartment Creation Failed - Action Required')
        ->view('emails.apartmentcreationfailed', [
            'user' => $this->user,
        ]);
    }
}
