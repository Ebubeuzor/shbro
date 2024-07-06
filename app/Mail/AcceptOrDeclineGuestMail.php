<?php

namespace App\Mail;

use App\Models\HostHome;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AcceptOrDeclineGuestMail extends Mailable
{
    use Queueable, SerializesModels;

    protected $user;
    protected string $message;
    protected $title;
    protected string $status;
    protected $hosthomeid;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($user, $message, $title, $status, $hosthomeid)
    {
        $this->user = $user;
        $this->message = $message;
        $this->title = $title;
        $this->status = $status;
        $this->hosthomeid = $hosthomeid;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {

        return $this->subject($this->title)
        ->view('emails.bookingRequestResponse')
        ->with([
            'user' => $this->user,
            'guestmessage' => $this->message,
            'title' => $this->title,
            'status' => $this->status == 'accept' ? "Accepted" : "Declined",
            'hosthome' => HostHome::find($this->hosthomeid)
        ]);
    }
}
