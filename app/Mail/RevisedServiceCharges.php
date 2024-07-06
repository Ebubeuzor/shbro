<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RevisedServiceCharges extends Mailable
{
    use Queueable, SerializesModels;
    
    protected $user;
    protected $title;
    protected $guest_services_charge;
    protected $host_services_charge;
    protected $vat;
    protected $formatedDate;

    public function __construct($user, $title, $guest_services_charge, $host_services_charge, $vat, $formatedDate)
    {
        $this->user = $user;
        $this->title = $title;
        $this->guest_services_charge = $guest_services_charge;
        $this->host_services_charge = $host_services_charge;
        $this->vat = $vat;
        $this->formatedDate = $formatedDate;
    }

    public function build()
    {
        return $this->subject($this->title)
                    ->view('emails.revisedServiceCharges')
                    ->with([
                        'user' => $this->user,
                        'title' => $this->title,
                        'guest_services_charge' => $this->guest_services_charge,
                        'host_services_charge' => $this->host_services_charge,
                        'vat' => $this->vat,
                        'formatedDate' => $this->formatedDate,
                    ]);
    }
}
