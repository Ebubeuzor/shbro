<?php

namespace App\Mail;

use App\Models\AcceptGuestRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BookingRequestCancelled extends Mailable
{
    use Queueable, SerializesModels;

    public $request;

    /**
     * Create a new message instance.
     *
     * @param AcceptGuestRequest $request
     */
    public function __construct(AcceptGuestRequest $request)
    {
        $this->request = $request;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Your Booking Request Has Been Cancelled')
                    ->view('emails.canceledbookingrequest')
                    ->with([
                        'userName' => $this->request->user->name, 
                        'apartmentName' => $this->request->hostHome->title, 
                        'apartmentId' => $this->request->host_home_id,
                    ]);
    }
}
