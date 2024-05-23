<?php

namespace App\Jobs;

use App\Events\NewNotificationEvent;
use App\Mail\ApartmentCreationApprovalRequest;
use App\Mail\NotificationMail;
use App\Models\HostHome;
use App\Models\Hosthomecohost;
use App\Models\Hosthomerule;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;

class ProcessHostHomeCreation implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    
    public $tries = 3;

    public $retryAfter = 5;
    
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(
        private $data,
        private $userId
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
        $data = $this->data;
        $user = User::find($this->userId);
        $hostHome = new HostHome();

        $cohost = Hosthomecohost::where('user_id',$user->id)->first();

        $hostHome->user_id = $cohost ? $cohost->host_id : $user->id;
        $hostHome->property_type = $data['property_type'];
        $hostHome->guest_choice = $data['guest_choice'];
        $hostHome->address = $data['address'];
        $hostHome->guests = $data['guest'];
        $hostHome->bedroom = $data['bedrooms'];
        $hostHome->beds = $data['beds'];
        $hostHome->bathrooms = $data['bathrooms'];
        $hostHome->video = $this->saveVideo($data['hosthomevideo']);
        $hostHome->title = $data['title'];
        $hostHome->description = $data['description'];
        $hostHome->reservation = $data['reservation'];
        $hostHome->actualPrice = $data['price'];
        $hostHome->price = 0;
        $hostHome->check_out_time = $data['check_out_time'];
        $hostHome->host_type = $data['host_type'];
        $hostHome->check_in_time = $data['checkin'];
        $hostHome->cancellation_policy = $data['cancelPolicy'];
        $hostHome->security_deposit = $data['securityDeposit'];

        $price = $data['price'];

        $service_fee = 0;
        $tax = 0;


        $total = $price + $service_fee + $tax;

        $hostHome->service_fee = 0;
        $hostHome->tax = 0;
        $hostHome->total = 0;

        DB::transaction(function () use ($hostHome, $data,$user,$cohost) {
            $hostHome->save();


            $amenities = $data['amenities'];
            $images = $data['hosthomephotos'];
            $hosthomedescriptions = $data['hosthomedescriptions'];
            $reservations = $data['reservations'];
            $discounts = $data['discounts'];
            $rules = $data['rules'];
            $notices = $data['notice'];
            
            if(trim(isset($data['additionalRules']))){
                Hosthomerule::create([
                    'rule' => $data['additionalRules'],
                    'host_home_id' => $hostHome->id
                ]);
            }

            foreach ($images as $base64Image) {
                ProcessImage::dispatch($base64Image, $hostHome->id);
            }
            
            foreach ($amenities as $amenity) {
                ProcessOffer::dispatch($amenity, $hostHome->id);
            }
            
            foreach ($hosthomedescriptions as $hosthomedescription) {
                ProcessDescription::dispatch($hosthomedescription,$hostHome->id);
            }
            
            foreach ($reservations as $reservation) {
                ProcessReservation::dispatch($reservation,$hostHome->id);
            }
            
            foreach ($discounts as $discount) {
                ProcessDiscount::dispatch($discount,$hostHome->id);
            }
            
            foreach ($rules as $rule) {
                ProcessRule::dispatch($rule,$hostHome->id);
            }
            
            foreach ($notices as $notice) {
                ProcessNotice::dispatch($notice, $hostHome->id);
            }

            $host = User::find($hostHome->user_id);

            if (!$cohost) {
                $message = "Your listing has been created now awaiting admin approval";
                $title = "Listing Created Successfully.";
                Mail::to($host->email)->queue(new NotificationMail($host,$message,$title));
                        
                // Create a new notification record in the database
                $notification = new Notification();
                $notification->user_id = $host->id;  // Assuming you want to save the user ID
                $notification->Message = $message;
                $notification->save();
                // Broadcast the NewNotificationEvent to notify the WebSocket clients
                event(new NewNotificationEvent($notification, $notification->id, $host->id));

            }

            if ($user->co_host == true) {
                
                $hostHome->update([
                    'approvedByHost' => false,
                    'needApproval' => true
                ]);
                Mail::to($host->email)->queue(new ApartmentCreationApprovalRequest($hostHome,$host,$user));
                
                $this->clearAllCache();

            }

            if ($host->cohosts()->exists()) {
                $coHosts = $host->cohosts()->with('user')->get();
                $uniqueCohosts = $coHosts->unique('user.email');

                foreach ($uniqueCohosts as $coHost) {
                    CreateHomesForCohosts::dispatch($coHost->user_id,$coHost->host_id,$hostHome->id);
                }
                
                $this->clearAllCache();

            }

            $admins = User::whereNotNull('adminStatus')->get();

            $message = "Attention Admins: A new apartment has been created. Please review and take necessary action. Thank you!";
            $title = "New Apartment Created: Admin Action Required";
            
            NotifyAdmins::dispatch($admins,$message,$title);

        });
    }

    public function clearAllCache()
    {
        Cache::flush();
    }

    private function saveVideo($video)
    {
        // Check if video is base64 string
        if (preg_match('/^data:video\/(\w+);base64,/', $video, $matches)) {
            $videoData = substr($video, strpos($video, ',') + 1);
            $videoType = strtolower($matches[1]);

            // Decode base64 video data
            $decodedVideo = base64_decode($videoData);

            if ($decodedVideo === false) {
                throw new \Exception('Failed to decode video');
            }
        } else {
            throw new \Exception('Invalid video format');
        }

        $dir = 'videos/';
        $file = Str::random() . '.' . $videoType;
        $absolutePath = public_path($dir);
        $relativePath = $dir . $file;

        if (!File::exists($absolutePath)) {
            File::makeDirectory($absolutePath, 0755, true);
        }

        // Save the decoded video to the file
        if (!file_put_contents($absolutePath . $file, $decodedVideo)) {
            throw new \Exception('Failed to save video');
        }

        return $relativePath;
    }
}
