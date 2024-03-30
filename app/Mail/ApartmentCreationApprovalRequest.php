<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ApartmentCreationApprovalRequest extends Mailable
{
    use Queueable, SerializesModels;

    
    public function __construct(
        private $hosthome,
        private $host,
        private $cohost,
    )
    {
        
    }
    
    public function build()
    {
        return $this->subject("Approval on creation of an apartment")
        ->view('emails.apartmentcreationapproval')
        ->with([
            'hosthome' => $this->hosthome,
            'host' => $this->host,
            'cohost' => $this->cohost,
        ]);
    }

}
