<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HostHome;
use App\Http\Requests\StoreHostHomeRequest;
use App\Http\Requests\UpdateHostHomeRequest;
use App\Http\Resources\HostHomeResource;
use App\Mail\NotificationMail;
use App\Models\Hosthomedescription;
use App\Models\Hosthomediscount;
use App\Models\Hosthomenotice;
use App\Models\Hosthomeoffer;
use App\Models\Hosthomephoto;
use App\Models\Hosthomereservation;
use App\Models\Hosthomerule;
use App\Models\Notification as Notification;
use App\Models\Tip;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class HostHomeController extends Controller
{
    /**
     * @lrd:start
     * gets the details of every verified homes
     * @lrd:end
     */
    public function index()
    {
        return HostHomeResource::collection(
            HostHome::where('verified',1)->get()
        );
    }
    
    /**
     * @lrd:start
     * gets the details of every homes
     * @lrd:end
     */
    public function allHomes()
    {
        return HostHomeResource::collection(
            HostHome::all()
        );
    }
    
    
    /**
     * @lrd:start
     * gets the details of every unverified homes
     * @lrd:end
     */
    public function notVerified()
    {
        return HostHomeResource::collection(
            HostHome::where('verified',0)->get()
        );
    }

    private function saveVideo($video)
    {
        // Check if video is base64 string
        if (preg_match('/^data:video\/(\w+);base64,/', $video, $matches)) {
            $videoData = substr($video, strpos($video, ',') + 1);
            $videoType = strtolower($matches[1]);

            // Check if file is a video
            if (!in_array($videoType, ['mp4','webm', 'avi', 'mov', 'mkv'])) {
                throw new \Exception('Invalid video type');
            }

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
        if (!file_put_contents($absolutePath . $file, $decodedVideo, FILE_BINARY)) {
            throw new \Exception('Failed to save video');
        }

        return $relativePath;
    }

    private function saveImage($image)
    {
        // Check if image is base64 string
        if (preg_match('/^data:image\/(\w+);base64,/', $image, $matches)) {
            $imageData = substr($image, strpos($image, ',') + 1);
            $imageType = strtolower($matches[1]);

            // Check if file is an image
            if (!in_array($imageType, ['jpg', 'jpeg', 'gif', 'png'])) {
                throw new \Exception('Invalid image type');
            }

            // Decode base64 image data
            $decodedImage = base64_decode($imageData);

            if ($decodedImage === false) {
                throw new \Exception('Failed to decode image');
            }
        } else {
            throw new \Exception('Invalid image format');
        }

        $dir = 'images/';
        $file = Str::random() . '.' . $imageType;
        $absolutePath = public_path($dir);
        $relativePath = $dir . $file;

        if (!File::exists($absolutePath)) {
            File::makeDirectory($absolutePath, 0755, true);
        }

        // Save the decoded image to the file
        if (!file_put_contents($relativePath, $decodedImage)) {
            throw new \Exception('Failed to save image');
        }

        return $relativePath;
    }

    
    /**
     * @lrd:start
     * and the values which you will send as object must be in the following object
     * 'property_type' => "required",
     * 'guest_choice' => "required",
     * 'address' => "required",
     * 'guest' => "required",
     * 'bedrooms' => "required",
     * 'beds' => "required",
     * 'bathrooms' => "required",
     * 'amenities' => "required | array",
     * 'hosthomephotos' => "required | array | min:5",
     * 'hosthomevideo' => [
     *     'required'],
     * 'title' => "required",
     * 'hosthomedescriptions' => "required|array| min:2",
     * 'description' => "required",            
     * 'reservations' => "required | array",
     * 'reservation' => "required",
     * 'price' => "required",
     * 'discounts' => "required | array",
     * 'rules' => "required | array",
     * 'additionalRules' => "string",
     * 'host_type' => "required",
     * 'notice' => "required | array",
     * 'checkin' => "required ",
     * 'cancelPolicy' => "required",
     * 'securityDeposit' => "required",
     * this follows how the hosthomes was on the frontend
     * amenities, hosthomephotos, hosthomedescriptions, reservations,discounts 
     * rules,notice
     * must be an array of only values 
            
     * @lrd:end
     */
    public function store(StoreHostHomeRequest $request)
    {
        $data = $request->validated();

        $user = Auth::user();

        $hostHome = new HostHome();

        $hostHome->user_id = $user->id;
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
        $hostHome->price = $data['price'];
        $hostHome->host_type = $data['host_type'];
        $hostHome->check_in_time = $data['checkin'];
        $hostHome->cancellation_policy = $data['cancelPolicy'];
        $hostHome->security_deposit = $data['securityDeposit'];

        $price = $data['price'];
        $securityDeposit = $data['securityDeposit'];

        $host_fees_percentage = 0.20;
        $service_fee_percentage = 0.05;
        $tax_percentage = 0.05;

        $host_fees = $price * $host_fees_percentage;
        $service_fee = $price * $service_fee_percentage;
        $tax = $price * $tax_percentage;

        $total = $price + $securityDeposit + $host_fees + $service_fee + $tax;

        $hostHome->host_fees = $host_fees;
        $hostHome->service_fee = $service_fee;
        $hostHome->tax = $tax;
        $hostHome->total = $total;

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
            $imageData = ['image' => $base64Image, 'host_home_id' => $hostHome->id];
            $this->createImages($imageData);
        }
        
        foreach ($amenities as $amenitie) {
            $offerData = ['offer' => $amenitie, 'host_home_id' => $hostHome->id];
            $this->createOffers($offerData);
        }
        
        foreach ($hosthomedescriptions as $hosthomedescription) {
            $descriptionData = ['description' => $hosthomedescription, 'host_home_id' => $hostHome->id];
            $this->createDescriptions($descriptionData);
        }
        
        foreach ($reservations as $reservation) {
            $reservationData = ['reservation' => $reservation, 'host_home_id' => $hostHome->id];
            $this->createReservations($reservationData);
        }
        
        foreach ($discounts as $discount) {
            $discountData = ['discount' => $discount, 'host_home_id' => $hostHome->id];
            $this->createDiscounts($discountData);
        }
        
        foreach ($rules as $rule) {
            $ruleData = ['rule' => $rule, 'host_home_id' => $hostHome->id];
            $this->createRules($ruleData);
        }
        
        foreach ($notices as $notice) {
            $noticeData = ['notice' => $notice, 'host_home_id' => $hostHome->id];
            $this->createNotices($noticeData);
        }

        return response([
            "ok" => "Created"
        ],201);
    }

    
    public function createImages($data)
    {
        $validator = Validator::make($data,[
            'image' => 'string', 'host_home_id' => 'exists:App\Models\HostHome,id'
        ]);

        $data2 = $validator->validated();

        $data2['image'] = $this->saveImage($data2['image']);

        return Hosthomephoto::create($data2);

    }
    
    public function createOffers($data)
    {
        $validator = Validator::make($data,[
            'offer' => 'string', 'host_home_id' => 'exists:App\Models\HostHome,id'
        ]);

        $data2 = $validator->validated();

        return Hosthomeoffer::create($data2);

    }
    
    public function createDescriptions($data)
    {
        $validator = Validator::make($data,[
            'description' => 'string', 'host_home_id' => 'exists:App\Models\HostHome,id'
        ]);

        $data2 = $validator->validated();

        return Hosthomedescription::create($data2);

    }
    
    public function createReservations($data)
    {
        $validator = Validator::make($data,[
            'reservation' => 'string', 'host_home_id' => 'exists:App\Models\HostHome,id'
        ]);

        $data2 = $validator->validated();

        return Hosthomereservation::create($data2);

    }
    
    public function createDiscounts($data)
    {
        $validator = Validator::make($data,[
            'discount' => 'string', 'host_home_id' => 'exists:App\Models\HostHome,id'
        ]);

        $data2 = $validator->validated();

        return Hosthomediscount::create($data2);

    }
    
    public function createRules($data)
    {
        $validator = Validator::make($data,[
            'rule' => 'string', 'host_home_id' => 'exists:App\Models\HostHome,id'
        ]);

        $data2 = $validator->validated();

        return Hosthomerule::create($data2);

    }
    
    public function createNotices($data)
    {
        $validator = Validator::make($data,[
            'notice' => 'string', 'host_home_id' => 'exists:App\Models\HostHome,id'
        ]);

        $data2 = $validator->validated();

        return Hosthomenotice::create($data2);

    }

    /**
     * @lrd:start
     * this is for a user to see his house but only the admin can see every house
     * @lrd:end
     */
    public function show($hostHomeId)
    {
        $hostHome = HostHome::find($hostHomeId);
        $user = Auth::user();

        if ($hostHome && $user->hosthomes->contains('id', $hostHomeId)) {
            return new HostHomeResource($hostHome);
        }else if ($user->adminStatus != null) {
            return new HostHomeResource($hostHome);
        }else{
            abort(403,'Unauthorized Access');
        }
    }
    
    
    /**
     * @lrd:start
     * this accept the value of unverified home id so that they can be verified
	 * {id} is the hosthome id
     * @lrd:end
     */
    public function approveHome($id)
    {
        $hostHome = HostHome::where('id', $id)->first();

        $hostHome->update([
            "verified" => 1,
        ]);
        
        $hostHome->user()->update([
            "host" => 1,
        ]);
        
        return response()->json(['message'=>'approved'],200);
    }
    
    
    /**
     * @lrd:start
     * this accept the value of unverified home id so that they can be verified
	 * {user} is the user id
	 * {hosthomeid} is the hosthome id
     * @lrd:end
     * @LRDparam message use|required
     */
    public function disapproveHome(Request $request, $user, $hosthomeid)
    {
        $data = $request->validate([
            'message' => 'required'
        ]);
        $title = "Your home was not approved";

        $notify = new Notification();
        $notify->user_id = $user;
        $notify->Message = $data['message'];
        $notify->save();

        $tip = new Tip();
        $tip->user_id = $user;
        $tip->message = $data['message'];
        $tip->url = "/hosthome/?hosthomeid=" . $hosthomeid;
        $tip->save();

        Mail::to($user->email)->send(new NotificationMail($user,$data['message'],$title));
        

        return response()->json(['message'=>'disapproved'],200);
    }

    
    /**
     * @lrd:start
     * this is used to update the host home details the {hosthome} is the hosthome id the values are the same with the post except you dont have to include the arrays but if you want to update it overide all the other data
     * @lrd:end
     */
    public function update(UpdateHostHomeRequest $request, HostHome $hostHome)
    {
        $data = $request->validated();
        
        $hostHome->update([
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
            'price' => $data['price'],
            'host_type' => $data['host_type'],
            'check_in_time' => $data['checkin'],
            'cancellation_policy' => $data['cancelPolicy'],
            'security_deposit' => $data['securityDeposit']
        ]);

        $amenities = $data['amenities'];
        $images = $data['hosthomephotos'];
        $hosthomedescriptions = $data['hosthomedescriptions'];
        $reservations = $data['reservations'];
        $discounts = $data['discounts'];
        $rules = $data['rules'];
        $notices = $data['notice'];
        
        if(trim(isset($data['additionalRules']))){
            $hosthomerule = Hosthomerule::where('host_home_id',$hostHome->id);
            $hosthomerule->update([
                'rule' => $data['additionalRules'],
            ]);
        }

        if (isset($images) && !empty($images)) {
            $this->updateImages($hostHome, $images);
        } 
        

        if(isset($amenities) && !empty($amenities)) {
            $this->updateOffers($hostHome, $amenities);
        }
        
        if(isset($hosthomedescriptions) && !empty($hosthomedescription)) {
            $this->updateDescriptions($hostHome, $hosthomedescriptions);
        }
        
        if(isset($reservations) && !empty($reservations)) {
            $this->updateReservations($hostHome, $reservations);
        }
        
        if(isset($discounts) && !empty($discounts)) {
            $this->updateDiscounts($hostHome, $discounts);
        }
        
        if(isset($rules) && !empty($rules)) {
            $this->updateRules($hostHome, $rules);
        }
        
        if(isset($notices) && !empty($notices)) {
            $this->updateNotices($hostHome, $notices);
        }

        return response([
            "ok" => "Updated"
        ]);
    }

    private function updateNotices(HostHome $hosthome, array $notices)
    {
        $hosthome->hosthomenotices()->delete();

        foreach ($notices as $notice) {
            $hosthomenoticeData = ['notice' => $notice, 'host_home_id' => $hosthome->id];
            $this->createNotices($hosthomenoticeData);
        }
    }

    private function updateRules(HostHome $hosthome, array $rules)
    {
        $hosthome->hosthomerules()->delete();

        foreach ($rules as $rule) {
            $hosthomeruleData = ['rule' => $rule, 'host_home_id' => $hosthome->id];
            $this->createRules($hosthomeruleData);
        }
    }

    private function updateDiscounts(HostHome $hosthome, array $discounts)
    {
        $hosthome->hosthomediscounts()->delete();

        foreach ($discounts as $discount) {
            $hosthomediscountData = ['discount' => $discount, 'host_home_id' => $hosthome->id];
            $this->createDiscounts($hosthomediscountData);
        }
    }

    private function updateReservations(HostHome $hosthome, array $reservations)
    {
        $hosthome->hosthomereservations()->delete();

        foreach ($reservations as $reservation) {
            $hosthomedescriptionData = ['reservation' => $reservation, 'host_home_id' => $hosthome->id];
            $this->createReservations($hosthomedescriptionData);
        }
    }

    private function updateDescriptions(HostHome $hosthome, array $hosthomedescriptions)
    {
        $hosthome->hosthomedescriptions()->delete();

        foreach ($hosthomedescriptions as $hosthomedescription) {
            $hosthomedescriptionData = ['description' => $hosthomedescription, 'host_home_id' => $hosthome->id];
            $this->createDescriptions($hosthomedescriptionData);
        }
    }

    private function updateOffers(HostHome $hosthome, array $amenities)
    {
        $hosthome->hosthomeoffers()->delete();

        foreach ($amenities as $amenity) {
            $amenityData = ['offer' => $amenity, 'host_home_id' => $hosthome->id];
            $this->createOffers($amenityData);
        }
    }

    private function updateImages(HostHome $hosthome, array $images)
    {
        $hosthome->hosthomephotos()->delete();

        foreach ($images as $base64Image) {
            $imageData = ['image' => $base64Image, 'host_home_id' => $hosthome->id];
            $this->createImages($imageData);
        }
    }

    
    /**
     * @lrd:start
     * this is used to delete the host home details the {hosthome} is the hosthome id 
     * @lrd:end
     */
    public function destroy(HostHome $hostHome)
    {
        $hostHome->delete();
        $hostHome->hosthomedescriptions()->delete();
        $hostHome->hosthomediscounts()->delete();
        $hostHome->hosthomenotices()->delete();
        $hostHome->hosthomeoffers()->delete();
        $hostHome->hosthomephotos()->delete();
        $hostHome->hosthomereservations()->delete();
        $hostHome->hosthomerules()->delete();
    }
    

}
