<?php

namespace App\Mail;

use App\Models\User;
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
    )
    {

    }

    public function build()
    {
        $encryptedCohostemail = Crypt::encryptString($this->cohostemail);
        $hostremToken = $this->hostremToken;
        return $this->subject("Invitation to join Shortlet Bookings and ")
        ->view('emails.invitationfornonusers')
        ->with([
            'cohostemail' => $encryptedCohostemail,
            'hostremToken' => $hostremToken,
            'hostid' => $this->hostid,
            'host' => User::find($this->hostid),
        ])
        ;
    }
}
