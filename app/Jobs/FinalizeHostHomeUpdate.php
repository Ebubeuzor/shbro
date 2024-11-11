<?php

namespace App\Jobs;

use App\Mail\ApartmentListingUpdateReview;
use App\Mail\CohostUpdateForHost;
use App\Models\Cohost;
use App\Models\HostHome;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;

class FinalizeHostHomeUpdate implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $hostHome;
    protected $host;
    protected $user;

    public function __construct(HostHome $hostHome, User $host, User $user)
    {
        $this->hostHome = $hostHome;
        $this->host = $host;
        $this->user = $user;  // The user who initiated the update (could be a cohost)
    }

    public function handle()
    {
        // Call the function to handle all notifications and emails, including cohost logic
        $this->handleNotificationsAndEmails();
    }

    private function handleNotificationsAndEmails()
    {
        // Handle the notification and email logic
        $cohost = Cohost::where('user_id', $this->user->id)->first();
        if ($cohost) {
            $destination = "https://shortletbooking.com/EditHostHomes/{$this->hostHome->id}";
            Mail::to($this->host->email)->send(new CohostUpdateForHost($this->hostHome, $this->host, $this->user, $destination));
            Cache::flush();
        }

        $message = "Your listing has been updated and is now awaiting admin approval";
        $title = "Listing updated successfully and is now awaiting admin approval.";

        // Notify the host about the update
        Notification::create([
            'user_id' => $this->host->id,
            'Message' => $message,
        ]);

        // Send a review email to the host
        Mail::to($this->host->email)->send(new ApartmentListingUpdateReview($this->host, $this->hostHome, $title));

        // Notify all admins after the update
        $admins = User::whereNotNull('adminStatus')->get();
        $adminTitle = "Urgent: User Submitted Apartment Update Requires Admin Attention";
        NotifyAdmins::dispatch($admins, $this->hostHome, $this->host, $adminTitle)->onQueue('notifications');

        Cache::flush();
    }
}
