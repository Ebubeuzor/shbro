<?php

namespace App\Jobs;

use App\Events\NewNotificationEvent;
use App\Mail\ApartmentCreationApprovalRequest;
use App\Mail\FirstHomeWelcomeMessageMail;
use App\Mail\NewApartmentpendingApproval;
use App\Models\HostHome;
use App\Models\Notification;
use App\Models\Tip;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class ProcessHostHomeNotifications implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $backoff = [10, 30, 60];

    private $hostHomeId;
    private $userId;
    private $additionalData;

    public function __construct($hostHomeId, $userId, $additionalData = [])
    {
        $this->hostHomeId = $hostHomeId;
        $this->userId = $userId;
        $this->additionalData = $additionalData;
    }

    public function handle()
    {
        $hostHome = HostHome::findOrFail($this->hostHomeId);
        $user = User::findOrFail($this->userId);
        $host = User::findOrFail($this->additionalData['host_id']);

        $this->sendEmails($host, $user, $hostHome);

        $this->notifyCohosts($host, $hostHome);
        $this->notifyAdmins($hostHome, $host, $user);
        Cache::flush();

        $message = "Tip: Please upload your utility bill to verify your address for $hostHome->title and speed up the approval process.";
        $notify = new Notification();
        $notify->user_id = $user;
        $notify->Message = $message;
        $notify->save();

        $tip = new Tip();
        $tip->user_id = $user->id;
        $tip->message = $message;
        $tip->url = "listings";
        $tip->save();
    }

    private function sendEmails($host, $user, $hostHome)
    {
        $emailJobs = [
            ['email' => $host->email, 'mailable' => new NewApartmentpendingApproval($host, $hostHome, "Listing Created Successfully"), 'context' => 'host notification'],
        ];

        if ($this->additionalData['is_cohost']) {
            $hostHome->update(['approvedByHost' => false, 'needApproval' => true]);
            $emailJobs[] = ['email' => $host->email, 'mailable' => new ApartmentCreationApprovalRequest($hostHome, $host, $user), 'context' => 'cohost approval request'];
        }

        if ($host->hosthomes()->count() == 1 && $host->host == 0) {
            $host->update(['host' => 1]);
            $emailJobs[] = ['email' => $host->email, 'mailable' => new FirstHomeWelcomeMessageMail($host), 'context' => 'first home welcome'];
        }

        foreach ($emailJobs as $job) {
            $this->sendEmail($job['email'], $job['mailable'], $job['context']);
        }

    }

    private function sendEmail($to, $mailable, $context)
    {
        try {
            Mail::to($to)->send($mailable);
            Log::info("Successfully sent {$context} email", ['to' => $to]);
        } catch (Throwable $e) {
            Log::error("Failed to send {$context} email", [
                'error' => $e->getMessage(),
                'to' => $to,
                'mailable' => get_class($mailable),
            ]);
            
            // Re-throw the exception to trigger a job retry
            throw $e;
        }
    }

    private function notifyCohosts($host, $hostHome)
    {
        if ($host->hostcohosts()->exists()) {
            $coHosts = $host->hostcohosts()->with('user')->get()->unique('user.email');
            
            foreach ($coHosts as $coHost) {
                CreateHomesForCohosts::dispatch($coHost->user_id, $coHost->host_id, $hostHome->id)
                    ->delay(now()->addSeconds(rand(1, 60)));
            }
        }
    }

    private function notifyAdmins($hostHome, $host, $user)
    {
        if (!$user->co_host) {
            $title = "New Apartment Created: Admin Action Required";
            User::whereNotNull('adminStatus')
                ->chunk(100, function ($admins) use ($hostHome, $title, $host) {
                    NotifyAdmins::dispatch($admins, $hostHome, $host, $title);
            });
        }
    }

    public function failed(Throwable $exception)
    {
        Log::error('ProcessHostHomeNotifications job failed', [
            'hostHomeId' => $this->hostHomeId,
            'userId' => $this->userId,
            'error' => $exception->getMessage(),
        ]);
    }
}