<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DamageReportMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        private $admin,
        private $hosthome,
        private $host,
        private $reportDamage,
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
        ->view("emails.damageReport")
        ->with([
            "user" => $this->admin,
            "hosthome" => $this->hosthome,
            "reportDamageCreation" => $this->reportDamage->created_at->format('M j, Y h:ia'),
            "reportDamageDescription" => $this->reportDamage->damage_description,
            "host" => $this->host,
        ]);
    }
}
