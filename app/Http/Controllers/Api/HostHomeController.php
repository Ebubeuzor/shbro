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
     * /api/hosthomes?per_page=20
     * @lrd:end
     * @LRDparam per_page use|required |numeric to set how many items you want to get per page.
     */
    public function index(Request $request)
    {
        // Set a default value for the number of items per page
        $perPage = $request->input('per_page', 10);

        return HostHomeResource::collection(
            HostHome::where('verified', 1)
                ->where('disapproved', null)
                ->whereNull('banned')
                ->whereNull('suspend')
                ->paginate($perPage)
        );
    }

    
    /**
     * @lrd:start
     * gets the details of every verified homes based on a specific property_type
     * @lrd:end
     */
    public function searchHomeByProperty_type($property_type)
    {
        return HostHomeResource::collection(
            HostHome::where('verified', 1)
                    ->where('disapproved',null)
                    ->where('property_type',$property_type)
                    ->whereNull('banned')
                    ->whereNull('suspend')
                    ->get()
        );
    }
    
    /**
     * @lrd:start
     * Delete a host home for the authenticated user.
     *
     * @param  int  $hostHomeId
     * @return \Illuminate\Http\Response
     * @lrd:end
     */
    public function deleteHostHome($hostHomeId)
    {
        // Find the host home by ID
        $hostHome = HostHome::find($hostHomeId);

        // Check if the authenticated user owns the host home
        if ($hostHome && $hostHome->user_id == Auth::id()) {
            $hostHome->hosthomedescriptions()->delete();
            $hostHome->hosthomediscounts()->delete();
            $hostHome->hosthomenotices()->delete();
            $hostHome->hosthomeoffers()->delete();
            $hostHome->hosthomephotos()->delete();
            $hostHome->hosthomereservations()->delete();
            $hostHome->hosthomerules()->delete();
            $hostHome->forceDelete();

            return response([
                "message" => "Host home deleted successfully",
            ], 200);
        } else {
            return response("Unauthorized to delete the host home", 403);
        }
    }

    /**
     * @lrd:start
     * Get all host homes for the authenticated user.
     *
     * @return \Illuminate\Http\Response
     * @lrd:end
     */
    public function getUserHostHomes()
    {
        // Retrieve all host homes for the authenticated user
        $userHostHomes = Auth::user()->hostHomes;

        return response([
            "userHostHomes" => HostHomeResource::collection($userHostHomes),
        ], 200);
    }

    /**
     * @lrd:start
     * gets the details of every homes
     * @lrd:end
     */
    public function allHomes()
    {
        return HostHomeResource::collection(
            HostHome::where('disapproved',null)
            ->whereNull('banned')
            ->whereNull('suspend')
            ->get()
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
            HostHome::where('verified',0)
            ->where('disapproved',null)
            ->whereNull('banned')
            ->whereNull('suspend')->get()
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

    private function saveImage($image,$hosthomeid)
    {
        // Check if image is base64 string
        if (preg_match('/^data:image\/(\w+);base64,/', $image, $matches)) {
            $imageData = substr($image, strpos($image, ',') + 1);
            $imageType = strtolower($matches[1]);

            // Check if file is an image
            if (!in_array($imageType, ['jpg', 'jpeg', 'gif', 'png','webp'])) {
                throw new \Exception('Invalid image type');
            }

            // Decode base64 image data
            $decodedImage = base64_decode($imageData);

            if ($decodedImage === false) {
                $hosthome = HostHome::find($hosthomeid);
                $hosthome->delete();
                throw new \Exception('Failed to decode image');
            }
        } else {
            $hosthome = HostHome::find($hosthomeid);
            $hosthome->delete();
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
        $hostHome->actualPrice = $data['price'];
        $hostHome->price = 0;
        $hostHome->check_out_time = $data['check_out_time'];
        $hostHome->host_type = $data['host_type'];
        $hostHome->check_in_time = $data['checkin'];
        $hostHome->cancellation_policy = $data['cancelPolicy'];
        $hostHome->security_deposit = $data['securityDeposit'];

        $price = $data['price'];
        // $service_fee_percentage = 0.10;
        // $tax_percentage = 0.05;

        // $service_fee = $price * $service_fee_percentage;
        // $tax = $price * $tax_percentage;

        $service_fee = 0;
        $tax = 0;


        $total = $price + $service_fee + $tax;

        $hostHome->service_fee = 0;
        $hostHome->tax = 0;
        $hostHome->total = 0;

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
        
        info("test0");
        $validator = Validator::make($data,[
            'image' => 'string', 'host_home_id' => 'exists:App\Models\HostHome,id'
        ]);

        $data2 = $validator->validated();

        $data2['image'] = $this->saveImage($data2['image'], $data2['host_home_id']);
        
        return Hosthomephoto::create($data2);
    

    }
    
    public function createOffers($data)
    {
        info("test1");
        $validator = Validator::make($data,[
            'offer' => 'string', 'host_home_id' => 'exists:App\Models\HostHome,id'
        ]);

        $data2 = $validator->validated();

        return Hosthomeoffer::create($data2);

    }
    
    public function createDescriptions($data)
    {
        info("test2");
        $validator = Validator::make($data,[
            'description' => 'string', 'host_home_id' => 'exists:App\Models\HostHome,id'
        ]);

        $data2 = $validator->validated();

        return Hosthomedescription::create($data2);

    }
    
    public function createReservations($data)
    {
        info("test3");
        $validator = Validator::make($data,[
            'reservation' => 'string', 'host_home_id' => 'exists:App\Models\HostHome,id'
        ]);

        $data2 = $validator->validated();

        return Hosthomereservation::create($data2);

    }
    
    public function createDiscounts($data)
    {
        // Validate the input data
        $validator = Validator::make($data, [
            'discount' => 'required|string',
            'host_home_id' => 'required|exists:host_homes,id'
        ]);

        // Check for validation errors
        if ($validator->fails()) {
            // Handle validation errors, you can return a response or throw an exception
            return response(['error' => $validator->errors()], 422);
        }

        // Get the validated data
        $data2 = $validator->validated();

        // Find the HostHome
        $hostHome = HostHome::find($data2['host_home_id']);

        // Check the discount type
        if ($data2['discount'] == "20% New listing promotion") {
            $priceDiscount = intval($hostHome->actualPrice) * 0.2;
            $price = intval($hostHome->actualPrice) - $priceDiscount;
            $hostHome->price = $price;
        } else {
            // Reset to the actual price if not a special discount
            $hostHome->price = $hostHome->actualPrice;
        }

        // Calculate service fee and tax (you can adjust these calculations based on your business logic)
        $service_fee_percentage = 0.10;
        $tax_percentage = 0.05;

        $service_fee = $hostHome->price * $service_fee_percentage;
        $tax = $hostHome->price * $tax_percentage;

        // Update the HostHome attributes
        $hostHome->service_fee = $service_fee;
        $hostHome->tax = $tax;
        $hostHome->total = $hostHome->price + $service_fee + $tax;

        // Save the updated HostHome
        $hostHome->save();

        // Create the HostHomeDiscount record
        return HostHomeDiscount::create($data2);
    }

    public function createRules($data)
    {
        info("test5");
        $validator = Validator::make($data,[
            'rule' => 'string', 'host_home_id' => 'exists:App\Models\HostHome,id'
        ]);

        $data2 = $validator->validated();

        return Hosthomerule::create($data2);

    }
    
    public function createNotices($data)
    {
        info("test6");
        $validator = Validator::make($data,[
            'notice' => 'string', 'host_home_id' => 'exists:App\Models\HostHome,id'
        ]);

        $data2 = $validator->validated();

        return Hosthomenotice::create($data2);

    }

    /**
     * @lrd:start
     * this is for a user (Host Only) to see his house but only the admin can see every house
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
     * this is for a user (guests) to see a home based on a provided homeId
     * @lrd:end
     */
    public function showGuestHome($hostHomeId)
    {
        $hostHome = HostHome::whereId($hostHomeId)
                    ->where('verified', 1)
                    ->where('disapproved',null)
                    ->whereNull('banned')
                    ->whereNull('suspend')->first();
        return new HostHomeResource($hostHome);
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
     * this accept the value of unverified home id so that 
     * they can be disapproved
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

        $useremail = User::find($user);
        $hostHome = HostHome::find($hosthomeid);

        $hostHome->update([
            'disapproved' => 'disapproved'
        ]);

        Mail::to($useremail->email)->send(new NotificationMail($useremail,$data['message'],$title));
        

        return response()->json(['message'=>'disapproved'],200);
    }

    
    /**
     * @lrd:start
     * this is used to update the host home details the {hosthome} is the hosthome id the values are the same with the post except you dont have to include the arrays but if you want to update it overide all the other data
     * @lrd:end
     */
    public function update(UpdateHostHomeRequest $request, $hostHomeId)
    {
        // $securityDeposit = $data['securityDeposit'];

        // $service_fee_percentage = 0.10;
        // $tax_percentage = 0.05;

        // $service_fee = $price * $service_fee_percentage;
        // $tax = $price * $tax_percentage;
        $data = $request->validated();

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

        // Update only if new discounts are selected
        if (isset($data['discounts']) && !empty($data['discounts'])) {
            $hostHomeData['price'] = 0; // Reset the price to zero initially

            // Handle the updates, creations, and deletions of discounts
            $this->updateDiscounts($hostHome, $data['discounts']);
        } 
        
        
        $hostHome->update($hostHomeData);
        if(isset($data['price'])){
            if ($hostHome->bookingCount < 3 && $this->hasNewListingPromotionDiscount($hostHome)) {
                $priceDiscount = intval($hostHome->actualPrice) * 0.2;
                $newPrice = intval($hostHome->actualPrice) - $priceDiscount;
                $hostHome->update(['price' => $newPrice]);
            }else{
                $hostHome->update(['price' => $price]);
            }
        }
        
        if(trim(isset($data['additionalRules']))){
            $hosthomerule = Hosthomerule::where('host_home_id',$hostHome->id);
            $hosthomerule->update([
                'rule' => $data['additionalRules'],
            ]);
        }

        if (isset($images) && !empty($images)) {
            $this->updateImages($hostHome->id, $images);
        } 
        

        if(isset($amenities) && !empty($amenities)) {
            $this->updateOffers($hostHome->id, $amenities);
        }
        
        if(isset($hosthomedescriptions) && !empty($hosthomedescription)) {
            $this->updateDescriptions($hostHome->id, $hosthomedescriptions);
        }
        
        if(isset($reservations) && !empty($reservations)) {
            $this->updateReservations($hostHome->id, $reservations);
        }
        
        if(isset($discounts) && !empty($discounts)) {
            $this->updateDiscounts($hostHome->id, $discounts);
        }
        
        if(isset($rules) && !empty($rules)) {
            $this->updateRules($hostHome->id, $rules);
        }
        
        if(isset($notices) && !empty($notices)) {
            $this->updateNotices($hostHome->id, $notices);
        }

        return response([
            "ok" => "Updated"
        ]);
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

    private function updateNotices($hosthome, array $notices)
    {

        foreach ($notices as $notice) {
            $hosthomenoticeData = ['notice' => $notice, 'host_home_id' => $hosthome];
            $this->createNotices($hosthomenoticeData);
        }
    }

    private function updateRules($hosthome, array $rules)
    {

        foreach ($rules as $rule) {
            $hosthomeruleData = ['rule' => $rule, 'host_home_id' => $hosthome];
            $this->createRules($hosthomeruleData);
        }
    }

    private function updateDiscounts($hosthome, array $discounts)
    {
        foreach ($discounts as $discount) {
            $hosthomediscountData = ['discount' => $discount, 'host_home_id' => $hosthome];
            
            // Handle "20% New listing promotion" discount
            if ($discount === "20% New listing promotion") {
                $bookingCount = $hosthome->bookingCount ?? 0;

                // Apply the discount only if the bookingCount is less than 3
                if ($bookingCount < 3) {
                    $this->applyNewListingPromotion($hosthome);
                }
            }

            $this->createDiscounts($hosthomediscountData);
        }
    }

    private function applyNewListingPromotion($hostHome)
    {
        // Apply 20% off for the "20% New listing promotion"
        $priceDiscount = intval($hostHome->actualPrice) * 0.2;
        $price = intval($hostHome->actualPrice) - $priceDiscount;

        // Update the HostHome price and other attributes accordingly
        $hostHome->price = $price;

        // Update the bookingCount
        $hostHome->increment('bookingCount');

        // You might want to update other attributes here if needed
        // ...

        // Save the changes
        $hostHome->save();
    }


    private function updateReservations($hosthome, array $reservations)
    {

        foreach ($reservations as $reservation) {
            $hosthomedescriptionData = ['reservation' => $reservation, 'host_home_id' => $hosthome];
            $this->createReservations($hosthomedescriptionData);
        }
    }

    private function updateDescriptions($hosthome, array $hosthomedescriptions)
    {
        foreach ($hosthomedescriptions as $hosthomedescription) {
            $hosthomedescriptionData = ['description' => $hosthomedescription, 'host_home_id' => $hosthome];
            $this->createDescriptions($hosthomedescriptionData);
        }
    }

    private function updateOffers($hosthome, array $amenities)
    {
        foreach ($amenities as $amenity) {
            $amenityData = ['offer' => $amenity, 'host_home_id' => $hosthome];
            $this->createOffers($amenityData);
        }
    }

    private function updateImages($hosthome, array $images)
    {

        foreach ($images as $base64Image) {
            $imageData = ['image' => $base64Image, 'host_home_id' => $hosthome];
            $this->createImages($imageData);
        }
    }

    /* 
    *@lrd:start
    *This method deletes the provided Hosthomephoto instance and returns a response indicating the operation's success.
    *
    * @param  \App\Models\Hosthomephoto  $id The Hosthomephoto instance to be deleted.
    *
    * @return \Illuminate\Http\Response A response indicating the success of the deletion operation.
    * .
    * @throws \Illuminate\Database\Eloquent\ModelNotFoundException If the Hosthomephoto with the given ID is not found.
    * @lrd:end
    */ 
    public function deleteHostHostHomeImages($id)
    {

        try {
            $hosthomephoto = Hosthomephoto::find($id);
            $hosthomephoto->delete();
            return response("done",200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // Handle model not found exception (Hosthomephoto with the given ID not found)
            return response("Hosthomephoto not found.", 404);
        } catch (\Exception $e) {
            // Handle other exceptions
            return response("An error occurred while deleting Hosthomephoto.", 500);
        }
        
    }


    
    /**
     * @lrd:start
     * this is used to delete the host home details the {hosthome} is the hosthome id 
     * @lrd:end
     */
    public function destroy($id)
    {
        $hostHome = HostHome::find($id); 
        $hostHome->hosthomedescriptions()->delete();
        $hostHome->hosthomediscounts()->delete();
        $hostHome->hosthomenotices()->delete();
        $hostHome->hosthomeoffers()->delete();
        $hostHome->hosthomephotos()->delete();
        $hostHome->hosthomereservations()->delete();
        $hostHome->hosthomerules()->delete();
        $hostHome->forceDelete();
        return response('This home has been deleted',200);
    }
    

}
