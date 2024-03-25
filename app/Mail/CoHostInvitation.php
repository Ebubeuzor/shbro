<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CoHostInvitation extends Mailable
{
    use Queueable, SerializesModels;
    
    public function __construct(
        protected $user,
        protected $hostid
    )
    {
        //
    }

    public function build()
    {
        return $this->subject("Co host invitation link")
        ->view("emails.invitation")
        ->with([
            "user" => $this->user,
            "host" => User::find($this->hostid)
        ])
        ;
    }
}
