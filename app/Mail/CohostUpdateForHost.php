<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CohostUpdateForHost extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(
        private $hosthome,
        private $host,
        private $cohost,
        private $destination,
    )
    {
        
    }

    public function build()
    {
        return $this->subject("Update of an apartment")
        ->view('emails.apartmentUpdate')
        ->with([
            'hosthome' => $this->hosthome,
            'host' => $this->host,
            'cohost' => $this->cohost,
            'destination' => $this->destination,
        ]);
    }
}
