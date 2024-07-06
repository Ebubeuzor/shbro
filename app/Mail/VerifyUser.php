<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VerifyUser extends Mailable
{
    use Queueable, SerializesModels;

    protected $user;
    protected $status;
    protected $viewToUse;
    protected $title;

    public function __construct($user,$status,$viewToUse,$title)
    {
        $this->user = $user;
        $this->status = $status;
        $this->viewToUse = $viewToUse;
        $this->title = $title;
    }

    public function build()
    {
        return $this->subject($this->title)
        ->view($this->viewToUse)
        ->with([
            'user' => $this->user,
            'status' => $this->status
        ])
        ;
    }

}
