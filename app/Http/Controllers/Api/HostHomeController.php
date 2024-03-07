<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HostHome;
use App\Http\Requests\StoreHostHomeRequest;
use App\Http\Requests\UpdateHostHomeRequest;
use App\Http\Resources\GetHostHomeAndIdResource;
use App\Http\Resources\HostHomeResource;
use App\Mail\CoHostInvitation;
use App\Mail\NotificationMail;
use App\Mail\VerifyYourEmail;
use App\Mail\WelcomeMail;
use App\Models\HostHomeBlockedDate;
use App\Models\Hosthomecohost;
use App\Models\HostHomeCustomDiscount;
use App\Models\Hosthomedescription;
use App\Models\Hosthomediscount;
use App\Models\Hosthomenotice;
use App\Models\Hosthomeoffer;
use App\Models\Hosthomephoto;
use App\Models\Hosthomereservation;
use App\Models\Hosthomerule;
use App\Models\Notification as Notification;
use App\Models\ReservedPricesForCertainDay;
use App\Models\Tip;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

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
     * /api/hosthomes/{property_type}?per_page=20
     * @lrd:end
     * @LRDparam per_page use|required |numeric to set how many items you want to get per page.
     */
    public function searchHomeByProperty_type(Request $request,$property_type)
    {
        $perPage = $request->input('per_page', 10);
        return HostHomeResource::collection(
            HostHome::where('verified', 1)
                    ->where('disapproved',null)
                    ->where('property_type',$property_type)
                    ->whereNull('banned')
                    ->whereNull('suspend')
                    ->paginate($perPage)
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

        // Check if the authenticated user is the owner or a co-host
        $isAuthorized = ($hostHome && ($hostHome->user_id == Auth::id() || $hostHome->cohosthomes->contains('user_id', Auth::id())));

        if ($isAuthorized) {
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

        $userCohostedHomes = Auth::user()->cohosthomes()->with('hosthome')->get()
        ->map(function ($cohost) {
            $cohostUser = HostHome::where('id', $cohost->host_home_id)->first();
            return $cohostUser; // Return an empty collection if user not found
        })
        ->flatten();

            // Combine both sets of homes
        $userHostHomes = $userHostHomes->merge($userCohostedHomes);

        // Use unique to remove potential duplicates
        $userHostHomes = $userHostHomes->unique();

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
        // Validate the input data
        $validator = Validator::make($data, [
            'image' => 'string',
            'host_home_id' => 'exists:App\Models\HostHome,id'
        ]);

        // Check for validation errors
        if ($validator->fails()) {
            // Handle validation errors, you can return a response or throw an exception
            return response(['error' => $validator->errors()], 422);
        }

        $data2 = $validator->validated();
        $data2['image'] = $this->saveImage($data2['image'], $data2['host_home_id']);

        return Hosthomephoto::create($data2);
    }

    // Similar approach for createOffers, createDescriptions, and createReservations methods

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

        // Check if a discount with the same host_home_id already exists
        $existingDiscount = HostHomeDiscount::where('host_home_id', $data2['host_home_id'])
            ->where('discount', $data2['discount'])
            ->first();

        // Create or update the HostHomeDiscount record
        if ($existingDiscount) {
            // Update existing discount
            $existingDiscount->update($data2);
            return $existingDiscount;
        } else {
            // Create new discount
            return HostHomeDiscount::create($data2);
        }
    }


    
    public function createOffers($data)
    {
        // Validate the input data
        $validator = Validator::make($data, [
            'offer' => 'string',
            'host_home_id' => 'exists:App\Models\HostHome,id'
        ]);

        // Check for validation errors
        if ($validator->fails()) {
            // Handle validation errors, you can return a response or throw an exception
            return response(['error' => $validator->errors()], 422);
        }

        $data2 = $validator->validated();

        return Hosthomeoffer::create($data2);
    }

    public function createDescriptions($data)
    {
        // Validate the input data
        $validator = Validator::make($data, [
            'description' => 'string',
            'host_home_id' => 'exists:App\Models\HostHome,id'
        ]);

        // Check for validation errors
        if ($validator->fails()) {
            // Handle validation errors, you can return a response or throw an exception
            return response(['error' => $validator->errors()], 422);
        }

        $data2 = $validator->validated();

        return Hosthomedescription::create($data2);
        
    }

    public function createReservations($data)
    {
        // Validate the input data
        $validator = Validator::make($data, [
            'reservation' => 'string',
            'host_home_id' => 'exists:App\Models\HostHome,id'
        ]);

        // Check for validation errors
        if ($validator->fails()) {
            // Handle validation errors, you can return a response or throw an exception
            return response(['error' => $validator->errors()], 422);
        }

        $data2 = $validator->validated();

        return Hosthomereservation::create($data2);
        
    }

    
    public function createRules($data)
    {
        // Validate the input data
        $validator = Validator::make($data, [
            'rule' => 'string',
            'host_home_id' => 'exists:App\Models\HostHome,id'
        ]);
    
        // Check for validation errors
        if ($validator->fails()) {
            // Handle validation errors, you can return a response or throw an exception
            return response(['error' => $validator->errors()], 422);
        }
    
        $data2 = $validator->validated();
    
        return Hosthomerule::create($data2);
        
    }
    
    public function createNotices($data)
    {
        // Validate the input data
        $validator = Validator::make($data, [
            'notice' => 'string',
            'host_home_id' => 'exists:App\Models\HostHome,id'
        ]);
    
        // Check for validation errors
        if ($validator->fails()) {
            // Handle validation errors, you can return a response or throw an exception
            return response(['error' => $validator->errors()], 422);
        }
    
        $data2 = $validator->validated();
    
        return Hosthomenotice::create($data2);
        
    }


    /**
     * @lrd:start
     * Delete a discount record based on the given id.
     *
     * @param int $id
     * @return JsonResponse
     * @lrd:end
     */
    public function deleteDiscountById($id)
    {
        // Find the HostHomeDiscount record by id
        $discount = HostHomeDiscount::find($id);

        // Check if the record exists
        if ($discount) {
            // Find the corresponding HostHome
            $hostHome = HostHome::find($discount->host_home_id);

            // Reset the price to the actual price
            $hostHome->price = $hostHome->actualPrice;

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

            // Delete the HostHomeDiscount record
            $discount->delete();

            return response(['message' => 'Discount deleted successfully']);
        } else {
            // Handle the case where the record is not found
            return response(['error' => 'Discount not found'], 404);
        }
    }

    /**
     * @lrd:start
     * Delete an offer record based on the given id.
     *
     * @param int $id
     * @return JsonResponse
     * @lrd:end
     */
    public function deleteOfferById($id)
    {
        // Find the Hosthomeoffer record by id
        $offer = Hosthomeoffer::find($id);

        // Check if the record exists
        if ($offer) {
            // Delete the record
            $offer->delete();
            return response(['message' => 'Offer deleted successfully']);
        } else {
            // Handle the case where the record is not found
            return response(['error' => 'Offer not found'], 404);
        }
    }

    /**
     * @lrd:start
     * Delete a description record based on the given id.
     *
     * @param int $id
     * @return JsonResponse
     * @lrd:end
     */
    public function deleteDescriptionById($id)
    {
        // Find the Hosthomedescription record by id
        $description = Hosthomedescription::find($id);

        // Check if the record exists
        if ($description) {
            // Delete the record
            $description->delete();
            return response(['message' => 'Description deleted successfully']);
        } else {
            // Handle the case where the record is not found
            return response(['error' => 'Description not found'], 404);
        }
    }

    /**
     * @lrd:start
     * Delete a reservation record based on the given id.
     *
     * @param int $id
     * @return JsonResponse
     * @lrd:end
     */
    public function deleteReservationById($id)
    {
        // Find the Hosthomereservation record by id
        $reservation = Hosthomereservation::find($id);

        // Check if the record exists
        if ($reservation) {
            // Delete the record
            $reservation->delete();
            return response(['message' => 'Reservation deleted successfully']);
        } else {
            // Handle the case where the record is not found
            return response(['error' => 'Reservation not found'], 404);
        }
    }

    /**
     * @lrd:start
     * Delete a rule record based on the given id.
     *
     * @param int $id
     * @return JsonResponse
     * @lrd:end
     */
    public function deleteRuleById($id)
    {
        // Find the Hosthomerule record by id
        $rule = Hosthomerule::find($id);

        // Check if the record exists
        if ($rule) {
            // Delete the record
            $rule->delete();
            return response(['message' => 'Rule deleted successfully']);
        } else {
            // Handle the case where the record is not found
            return response(['error' => 'Rule not found'], 404);
        }
    }

    /**
     * @lrd:start
     * Delete a notice record based on the given id.
     *
     * @param int $id
     * @return JsonResponse
     * @lrd:end
     */
    public function deleteNoticeById($id)
    {
        // Find the Hosthomenotice record by id
        $notice = Hosthomenotice::find($id);

        // Check if the record exists
        if ($notice) {
            // Delete the record
            $notice->delete();
            return response(['message' => 'Notice deleted successfully']);
        } else {
            // Handle the case where the record is not found
            return response(['error' => 'Notice not found'], 404);
        }
    }

    /**
     * @lrd:start
     * Get host homes and their IDs for the authenticated host user.
     *
     * This method retrieves a list of host homes associated with the currently authenticated host user.
     * It returns a collection of host homes along with their corresponding IDs.
     *
     * @lrd:end
    */
    public function schdulerGetHostHomeAndId()
    {
        $hostId = auth()->id();

        // Retrieve host homes owned by the authenticated user
        $userOwnedHostHomes = HostHome::where("user_id", $hostId)
            ->whereNull('banned')
            ->whereNull('suspend')
            ->get();

        // Retrieve co-hosted homes where the authenticated user is a co-host
        $userCohostedHomes = Hosthomecohost::where('user_id', $hostId)->with('hosthome')->get()
        ->map(function ($cohost) {
            $cohostUser = HostHome::where('id', $cohost->host_home_id)->first();
            return $cohostUser; // Return an empty collection if user not found
        })
        ->flatten();

        // Combine both sets of homes
        $userHostHomes = $userOwnedHostHomes->merge($userCohostedHomes);

        // Use unique to remove potential duplicates
        $userHostHomes = $userHostHomes->unique();

        return GetHostHomeAndIdResource::collection($userHostHomes);
    }

    /**
     * 
     * @lrd:start
     * 
     * Edit the price of a host home for the scheduler.
     *
     * This method allows the scheduler to edit the regular price of a host home.
     * If the host home qualifies for the "20% New listing promotion" discount (less than 3 bookings),
     * it applies the discount and updates both the regular and actual prices.
     *
     * @param  \Illuminate\Http\Request  $request  The request containing the new price.
     * @param  int  $id  The ID of the host home.
     * date should be in format of YYYY-MM-DD
     * 
     * @lrd:end
     * 
     * @LRDparam price use|required
     * @LRDparam date use|required
    */
    public function schdulerEditHostHomePrice(Request $request, $id)
    {
        $data = $request->validate([
            'price' => ['required', 'numeric'],
            'dates' => 'nullable|array|min:2',
            'dates.*' => 'date_format:Y-m-d',
        ]);

        $price = $data['price'];
        
        $hostHome = HostHome::findOrFail($id);

        if (!$hostHome) {
            abort(404, "Hosthome not found");
        }

        $dates = $data['dates'];

        foreach ($dates as $index => $date) {
            $reservedDate = new ReservedPricesForCertainDay([
                'price' => $price,
                'date' => $date,
                'host_home_id' => $hostHome->id,
            ]);

            // Set start_date for the first entry
            if ($index === 0) {
                $reservedDate->start_date = $date;
            }

            // Set end_date for the last entry
            if ($index === count($dates) - 1) {
                $reservedDate->end_date = $date;
            }

            $reservedDate->save();
        }

        return response("Prices updated successfully", 200);
    }



    /**
     * @lrd:start
     * Edit the weekend price of a host home for the scheduler.
     *
     * This method allows the scheduler to edit the weekend price of a host home.
     *
     * @param  \Illuminate\Http\Request  $request  The request containing the new weekend price.
     * @param  int  $id  The ID of the host home.
     * @return \Illuminate\Http\Response
     * @lrd:end
     * @LRDparam price use|required
    */
    public function schdulerEditHostHomeWeekendPrice(Request $request, $id)
    {

        $data = $request-> validate([
            'price'=>['required','numeric']
        ]);

        $price = $data['price'];

        $hostHome = HostHome::find($id);

        $hostHome->update([
            'weekendPrice' => $price,
        ]);

        return response("Done", 200);
        
    }


    /**
     * @lrd:start
     * Edit the minimum nights required for booking in the host home.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     * @lrd:end
     * @LRDparam night use|required
     */
    public function schdulerEditHostHomeMinNights(Request $request, $id)
    {
        $data = $request->validate([
            'night' => ['required', 'numeric']
        ]);

        $night = $data['night'];

        $hostHome = HostHome::find($id);

        $hostHome->update([
            'min_nights' => $night,
        ]);

        return response("Done", 200);
    }

    /**
     * @lrd:start
     * Edit the maximum nights allowed for booking in the host home.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     * @lrd:end
     * @LRDparam night use|required
     */
    public function schdulerEditHostHomeMaxNights(Request $request, $id)
    {
        $data = $request->validate([
            'night' => ['required', 'numeric']
        ]);

        $night = $data['night'];

        $hostHome = HostHome::find($id);

        $hostHome->update([
            'max_nights' => $night,
        ]);

        return response("Done", 200);
    }

    /**
     * @lrd:start
     * Edit the advance notice required for booking in the host home.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     * @lrd:end
     * @LRDparam notice use|required
     */
    public function schdulerEditHostHomeAdvanceNotice(Request $request, $id)
    {
        $data = $request->validate([
            'notice' => ['required']
        ]);

        $notice = $data['notice'];

        $hostHome = HostHome::find($id);

        $hostHome->update([
            'advance_notice' => $notice,
        ]);

        return response("Done", 200);
    }

    /**
     * @lrd:start
     * Edit the preparation time required for booking in the host home.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     * @lrd:end
     * @LRDparam preparation_time use|required
     */
    public function schdulerEditHostHomePreparationTime(Request $request, $id)
    {
        $data = $request->validate([
            'preparation_time' => ['required']
        ]);

        $preparation_time = $data['preparation_time'];

        $hostHome = HostHome::find($id);

        $hostHome->update([
            'preparation_time' => $preparation_time,
        ]);

        return response("Done", 200);
    }

    /**
     * @lrd:start
     * Edit the availability window for booking in the host home.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     * @lrd:end
     * @LRDparam availability_window use|required
     */
    public function schdulerEditHostHomeAvailabilityWindow(Request $request, $id)
    {
        $data = $request->validate([
            'availability_window' => ['required']
        ]);

        $availability_window = $data['availability_window'];

        $hostHome = HostHome::find($id);

        $hostHome->update([
            'availability_window' => $availability_window,
        ]);

        return response("Done", 200);
    }


    
    /**
     * @lrd:start
     * Block a date for a host home for the scheduler.
     *
     * This method allows the scheduler to block a specific date for a host home.
     *
     * The request containing the date to be blocked date_format is  required and must be in "Y-m-d.
     * @param  int  $id  The ID of the host home.
     * @return \Illuminate\Http\Response
     * @lrd:end
     * 
     * @LRDparam date use|required
    */
    public function schdulerEditHostHomeBlockedDate(Request $request, $id)
    {
        $data = $request->validate([
            'dates' => 'nullable|array',
            'dates.*' => 'date_format:Y-m-d',
        ]);

        $dates = $data['dates'];
        $hostHome = HostHome::findOrFail($id);

        if (!$hostHome) {
            abort(404, "Hosthome not found");
        }

        foreach ($dates as $index => $date) {
            $hostHomeBlockDate = new HostHomeBlockedDate();
            $hostHomeBlockDate->date = $date;
            $hostHomeBlockDate->host_home_id = $id;
            if ($index === 0) {
                $hostHomeBlockDate->start_date = $date;
            }

            // Set end_date for the last entry
            if ($index === count($dates) - 1) {
                $hostHomeBlockDate->end_date = $date;
            }
            $hostHomeBlockDate->save();
        }

        return response("Dates blocked successfully", 200);
    }

    
    /**
     * @lrd:start
     * Update the discount for a host home based on custom criteria.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id Host home ID
     * @return \Illuminate\Http\Response
     * @throws \Illuminate\Validation\ValidationException
     * @lrd:end
     * 
     * @LRDparam duration use|required
     * @LRDparam discount_percentage use|required
     */
    public function schdulerEditHostHomediscount(Request $request, $id)
    {
        try {
            
            $data = $request->validate([
                'duration' => [
                    'required',
                    Rule::in(['1 week', '2 weeks', '3 weeks', '1 month', '2 months', '3 months']),
                ],
                'discount_percentage' => 'required|numeric',
            ]);

            $duration = $data['duration'];
            $discount_percentage = $data['discount_percentage'];

            $hostHome = HostHome::findOrFail($id);

            $hostHome->hosthomediscounts()->delete();
            // Find existing discount with the same duration
            $existingDiscount = HostHomeCustomDiscount::where('host_home_id', $id)
                ->where('duration', $duration)
                ->first();

            if ($existingDiscount) {
                // Update existing discount percentage
                $existingDiscount->update(['discount_percentage' => $discount_percentage]);
            } else {
                // Create new discount
                $ostHomeCustomDiscount = new HostHomeCustomDiscount();
                $ostHomeCustomDiscount->duration = $duration;
                $ostHomeCustomDiscount->discount_percentage = $discount_percentage;
                $ostHomeCustomDiscount->host_home_id = $id;
                $ostHomeCustomDiscount->save();
            }

            // Provide a success response
            return response()->json([
                'message' => 'Discount updated successfully.',
                'data' => $existingDiscount ?? $ostHomeCustomDiscount,
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Provide a response for validation failure
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            // Provide a response for other exceptions
            return response()->json([
                'message' => 'An error occurred.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * @lrd:start
     * Send a co-host invitation to join the host home.
     *
     * This method allows the primary host to send an invitation link to a potential co-host.
     * If the provided email corresponds to an existing user, the invitation is sent directly.
     * If the email does not match any user, a new user is created, and welcome/verification emails are sent.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $homeId The ID of the host home to which the co-host is being invited.
     * @return \Illuminate\Http\JsonResponse A JSON response indicating the success of the invitation.
     * @lrd:end
     * @LRDparam email use|required
     */
    public function addCoHost(Request $request, $homeId)
    {
        try {
            // Validate the incoming request data
            $data = $request->validate([
                'email' => 'required|email',
            ]);

            // Check if a user with the provided email already exists
            $user = User::where('email', $data['email'])
            ->whereNull('banned')
            ->whereNull('suspend')
            ->first();

            // If the user doesn't exist 
            if (!$user) {
                $user = User::create([
                    'name' => 'New Co-Host',
                    'email' => $data['email'],
                    'co_host' => true,
                    'password' => bcrypt(Str::random(16)),
                ]);

                // Send welcome and verification emails to the new user
                Mail::to($user->email)->send(new WelcomeMail($user));
                Mail::to($user->email)->send(new VerifyYourEmail($user));
            }

            // Check if the user is eligible for co-host invitation
            if (!$user || $user->banned || $user->suspend || $user->trashed()) {
                abort(400, "User not eligible for co-host invitation");
            }

            $user->update([
                "co_host" => true,
            ]);

            // Find the host home by its ID
            $hostHome = HostHome::find($homeId);

            // If the host home doesn't exist, return a 404 response
            if (!$hostHome) {
                abort(404, "Host home not found");
            }

            // Send the co-host invitation email with a link to join the host home
            Mail::to($data['email'])->send(new CoHostInvitation($user, $hostHome));

            // Provide a success response
            return response()->json(['message' => 'Co-host invitation sent successfully'], 200);
        } catch (\Exception $e) {
            // Provide a response for other exceptions
            return response()->json([
                'message' => 'An error occurred while sending the co-host invitation.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function becomeACoHost($userid,$hosthomeid)
    {
        $existingCoHost = Hosthomecohost::where('user_id',$userid)
        ->where('host_home_id',$hosthomeid)
        ->first();

        if ($existingCoHost) {
            abort(404,"The User is already a Co host to this home");
        }

        $hosthomeCoHost = new Hosthomecohost();
        $hosthomeCoHost->user_id = $userid;
        $hosthomeCoHost->host_home_id = $hosthomeid;
        $hosthomeCoHost->save();

        
        
        return redirect()->away('http://localhost:5173');

        
    }

    /**
     * @lrd:start
     * Remove a cohost from a host home.
     *
     * This method removes the specified user as a cohost from the given host home.
     * If the user is not a cohost for the specified home, a 404 error is returned.
     *
     * @param  int  $userid      The ID of the user to be removed as a cohost.
     * @param  int  $hosthomeid  The ID of the host home from which the cohost should be removed.
     * @return \Illuminate\Http\Response
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException if the cohost relationship is not found.
     * @lrd:end
     */
    public function removeCoHost($userid, $hosthomeid)
    {
        // Check if the specified user is a cohost for the given host home
        $coHost = Hosthomecohost::where('user_id', $userid)
            ->where('host_home_id', $hosthomeid)
            ->first();

        // If the user is not a cohost, return a 404 error
        if (!$coHost) {
            abort(404, "The User is not a Co host to this home");
        }

        // Delete the cohost relationship
        $coHost->delete();

        // Return a success response
        return response("Cohost removed successfully", 200);
    }

    /**
     * Determine the category of the duration (week or month).
     *
     * @param string $duration
     * @return string
     */
    private function getDurationCategory($duration)
    {
        // Implement your logic to determine the category
        // For example, check if the duration contains 'week' or 'month'
        if (strpos($duration, 'week') !== false) {
            return 'week';
        } elseif (strpos($duration, 'month') !== false) {
            return 'month';
        }
    
        return 'other';
    }
    
    /**
     * Get all durations within the specified category.
     *
     * @param string $category
     * @return array
     */
    private function getDurationsInCategory($category)
    {
        // Replace this with your dynamic logic to get durations in the specified category
        // For example, return all weeks or all months based on the category
        if ($category === 'week') {
            return ['1 week', '2 weeks', '3 weeks'];
        } elseif ($category === 'month') {
            return ['1 month', '2 months', '3 months'];
        }
    
        return [];
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

        if ($hostHome && $user->hosthomes->contains('id', $hostHomeId) ) {
            return new HostHomeResource($hostHome);
        }
        else if ($user->adminStatus != null) {
            return new HostHomeResource($hostHome);
        }
        else if ($user->cohosthomes->contains('host_home_id',$hostHomeId)) {
            return new HostHomeResource($hostHome);
        }
        else{
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
            // Handle the updates, creations, and deletions of discounts
            $this->updateDiscounts($hostHome, $data['discounts']);
        } 
        
        
        $hostHome->update($hostHomeData);
        

        $amenities = $data['amenities'];
        $images = $data['hosthomephotos'];
        $hosthomedescriptions = $data['hosthomedescriptions'];
        $reservations = $data['reservations'];
        $discounts = $data['discounts'];
        $rules = $data['rules'];
        $notices = $data['notice'];
        
        $this->updateDescriptions($hostHome->id, $hosthomedescriptions);

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
            $this->updateImages($hostHome->id, $images);
        } 
        

        if(isset($amenities) && !empty($amenities)) {
            $this->updateOffers($hostHome->id, $amenities);
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



    private function applyNewListingPromotion($hostHomeId)
    {
        $hostHome = HostHome::find($hostHomeId);

        // Ensure $hostHome is an instance of HostHome
        if ($hostHome instanceof HostHome) {
            $priceDiscount = intval($hostHome->actualPrice) * 0.2;
            $price = intval($hostHome->actualPrice) - $priceDiscount;

            // Make sure the discounted price is not less than 0
            $hostHome->price = max(0, $price);

            // Save the updated price immediately
            $hostHome->save();
        }else {
            return response("Not good",422);
        }
    }






    private function updateReservations($hosthome, array $reservations)
    {

        $getHostHome = HostHome::find($hosthome);
        
        $getHostHome->hosthomereservations()->delete();

        foreach ($reservations as $reservation) {
            $hosthomedescriptionData = ['reservation' => $reservation, 'host_home_id' => $hosthome];
            $this->createReservations($hosthomedescriptionData);
        }
    }

    private function updateDescriptions($hosthomeid, array $hosthomedescriptions)
    {
        foreach ($hosthomedescriptions as $hosthomedescription) {
            // Check if a description with the same host_home_id and description content already exists
            $existingDescription = Hosthomedescription::where('host_home_id', $hosthomeid)
                ->where('description', $hosthomedescription)
                ->first();

            if ($existingDescription) {
                // Update existing description
                $existingDescription->update(['description' => $hosthomedescription]);
            } else {
                // Create new description
                $descriptionData = ['description' => $hosthomedescription, 'host_home_id' => $hosthomeid];
                $this->createDescriptions($descriptionData);
            }
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
