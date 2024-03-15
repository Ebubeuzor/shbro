<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Crypt;

class CoHostInvitationForNonUsers extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        protected $hostremToken,
        protected $cohostemail,
        protected $hostid,
        protected $hosthomeid,
    )
    {

    }

    public function build()
    {
        $encryptedCohostemail = Crypt::encryptString($this->cohostemail);
        $encryptedHostremToken = Crypt::encryptString($this->hostremToken);
        return $this->subject("Invitation to join Shortlet Bookings and ")
        ->view('emails.invitationfornonusers')
        ->with([
            'cohostemail' => $encryptedCohostemail,
            'hostremToken' => $encryptedHostremToken,
            'hostid' => $this->hostid,
            'hosthomeid' => $this->hosthomeid,
        ])
        ;
    }
}
