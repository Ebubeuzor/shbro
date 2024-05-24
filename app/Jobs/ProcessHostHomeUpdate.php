<?php

namespace App\Jobs;

use App\Events\NewNotificationEvent;
use App\Mail\CohostUpdateForHost;
use App\Mail\NotificationMail;
use App\Models\HostHome;
use App\Models\Hosthomecohost;
use App\Models\Hosthomediscount;
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
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class ProcessHostHomeUpdate implements ShouldQueue
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
        private $user,
        private $hostHomeId,
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
        $hostHomeId = $this->hostHomeId;
        $hostHome = HostHome::find($hostHomeId);
        $price = $data['price'];
        
        // Assuming $service_fee_percentage and $tax_percentage are set to 0
        $service_fee_percentage = 0;
        $tax_percentage = 0;

        $service_fee = $price * $service_fee_percentage;
        $tax = $price * $tax_percentage;

        $total = $price + $service_fee + $tax;

        $hostHomeData = [
            'property_type' => $data['property_type'],
            'guest_choice' => $data['guest_choice'],
            'address' => $data['address'],
            'guests' => $data['guest'],
            'bedroom' => $data['bedrooms'],
            'beds' => $data['beds'],
            'bathrooms' => $data['bathrooms'],
            'video' => $this->saveVideo($data['hosthomevideo']),
            'title' => $data['title'],
            'description' => $data['description'],
            'reservation' => $data['reservation'],
            'actualPrice' => $data['price'],
            'check_out_time' => $data['check_out_time'],
            'host_type' => $data['host_type'],
            'check_in_time' => $data['checkin'],
            'service_fee' => $service_fee,
            'tax' => $tax,
            'total' => $total,
            'verified' => 0,
            'actualPrice' => $price,
            'cancellation_policy' => $data['cancelPolicy'],
            'security_deposit' => $data['securityDeposit']
        ];

        DB::transaction(function () use ($hostHome, $hostHomeData,$data,$price) {
            $hostHome->update($hostHomeData);

            $amenities = $data['amenities'];
            $images = $data['hosthomephotos'];
            $hosthomedescriptions = $data['hosthomedescriptions'];
            $reservations = $data['reservations'];
            $discounts = $data['discounts'];
            $rules = $data['rules'];
            $notices = $data['notice'];

            UpdateDescription::dispatch($hostHome->id, $hosthomedescriptions);

            if(isset($data['price'])){
                if ($hostHome->bookingCount < 3 && $this->hasNewListingPromotionDiscount($hostHome)) {
                    $priceDiscount = intval($hostHome->actualPrice) * 0.2;
                    $newPrice = intval($hostHome->actualPrice) - $priceDiscount;
                    $hostHome->update([
                        'price' => $newPrice
                    ]);
                }else{
                    $hostHome->update([
                        'price' => $price
                    ]);
                }
            }
            
            if(trim(isset($data['additionalRules']))){
                $hosthomerule = Hosthomerule::where('host_home_id',$hostHome->id);
                $hosthomerule->update([
                    'rule' => $data['additionalRules'],
                ]);
            }

            if (isset($images) && !empty($images)) {
                UpdateImage::dispatch($hostHome->id, $images);
            } 
            

            if(isset($amenities) && !empty($amenities)) {
                UpdateOffer::dispatch($hostHome->id, $amenities);
            }
            
            
            if(isset($reservations) && !empty($reservations)) {
                UpdateReservation::dispatch($hostHome->id, $reservations);
            }
            
            if(isset($discounts) && !empty($discounts)) {
                UpdateDiscount::dispatch($hostHome->id, $discounts);
            }
            
            if(isset($rules) && !empty($rules)) {
                UpdateRule::dispatch($hostHome->id, $rules);
            }
            
            if(isset($notices) && !empty($notices)) {
                UpdateNotice::dispatch($hostHome->id, $notices);
            }

            
            $host = User::find($hostHome->user_id);
            $cohost = Hosthomecohost::where('user_id',$this->user->id)->first();
            if ($cohost) {
                $destination = "https://shortletbooking.com/EditHostHomes/$hostHome->id";
                Mail::to($host->email)->queue(new CohostUpdateForHost($hostHome,$host,$this->user,$destination));
            }

            $message = "Your listing has been updated now awaiting admin approval";
            $title = "Listing updated Successfully.";
            
            $notification = new Notification();
            $notification->user_id = $host->id;  
            $notification->Message = $message;
            $notification->save();
            
            event(new NewNotificationEvent($notification, $notification->id, $host->id));
            
            Mail::to($host->email)->queue(new NotificationMail($host,$message,$title));

            $this->clearCacheForAllUsers();

            $admins = User::whereNotNull('adminStatus')->get();
            $message = "Attention Admins: An apartment update has been submitted by a user. Please review and take necessary action. Thank you!";
            $title = "Urgent: User Submitted Apartment Update Requires Admin Attention";
            NotifyAdmins::dispatch($admins,$message,$title);

        });
    }
    
    
    private function clearCacheForAllUsers()
    {
        Cache::flush();
    }
    

    private function hasNewListingPromotionDiscount($hostHome)
    {
        $discounts = Hosthomediscount::where('host_home_id', $hostHome->id)->get();

        foreach ($discounts as $discount) {
            if ($discount->discount === '20% New listing promotion') {
                return true;
            }
        }

        return false;
    }
    
    
    private function saveVideo($video)
    {
        // Check if video is base64 string
        if (preg_match('/^data:video\/(\w+);base64,/', $video, $matches)) {
            $videoData = substr($video, strpos($video, ',') + 1);
            $videoType = strtolower($matches[1]);

            // Decode base64 video data
            $decodedVideo = base64_decode($videoData);

        } else {
            throw new \Exception('Invalid video format');
        }

        $dir = 'videos/';
        $file = Str::random() . '.' . $videoType;
        $absolutePath = public_path($dir);
        $relativePath = $dir . $file;

        if (!File::exists($absolutePath)) {
            if (!File::makeDirectory($absolutePath, 0755, true)) {
                throw new \Exception('Failed to create directory: ' . $absolutePath);
            }
        }

        // Save the decoded video to the file
        $filePath = $absolutePath . '/' . $file;
        if (!file_put_contents($filePath, $decodedVideo)) {
            throw new \Exception('Failed to save video');
        }

        return $relativePath;
    }
    
}
