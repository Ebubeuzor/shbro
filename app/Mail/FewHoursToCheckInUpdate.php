<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class FewHoursToCheckInUpdate extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        private $user,
        private $hosthome,
        private $checkintime,
        private $title,
    )
    {
        //
    }

    public function build(){
        return $this->subject($this->title)
        ->view("emails.fewHoursToCheckInUpdate")
        ->with([
            "user" => $this->user,
            "checkintime" => $this->checkintime,
            "hosthome" => $this->hosthome
        ]);
    }
}
