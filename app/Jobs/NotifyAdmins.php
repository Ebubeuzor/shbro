<?php

namespace App\Jobs;

use App\Mail\ApartmentListingApproval;
use App\Mail\NotificationMail;
use App\Models\Adminrole;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class NotifyAdmins implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(
        private $admins,
        private $hostHome,
        private $host,
        private string $title,
    )
    {
        //
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        foreach ($this->admins as $admin) {
            $adminrole = Adminrole::where('user_id',$admin->id)
            ->where('rolePermission', 'Property')->first();

            if($adminrole){
                $admin = User::find($admin->id);
                Mail::to($admin->email)->queue(new ApartmentListingApproval($admin, $this->hostHome, $this->host, $this->title));
            }

        }
    }
}
