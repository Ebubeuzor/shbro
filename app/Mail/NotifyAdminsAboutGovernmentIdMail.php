<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NotifyAdminsAboutGovernmentIdMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(
        private $user,
        private $title,
        private $formatedDate
    )
    {
        //
    }

    public function build()
    {
        return $this->subject($this->title)
        ->view('emails.governmentIdSubmission')
        ->with([
            'admin' => $this->user,
            'formatedDate' => $this->formatedDate,
        ]);
    }
}
