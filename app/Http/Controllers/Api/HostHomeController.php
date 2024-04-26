<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HostHome;
use App\Http\Requests\StoreHostHomeRequest;
use App\Http\Requests\UpdateHostHomeRequest;
use App\Http\Resources\GetHostHomeAndIdResource;
use App\Http\Resources\HostHomeResource;
use App\Jobs\ClearCache;
use App\Jobs\ProcessDescription;
use App\Jobs\ProcessDiscount;
use App\Jobs\ProcessHostHomeCreation;
use App\Jobs\ProcessHostHomeUpdate;
use App\Jobs\ProcessImage;
use App\Jobs\ProcessNotice;
use App\Jobs\ProcessOffer;
use App\Jobs\ProcessReservation;
use App\Jobs\ProcessRule;
use App\Jobs\UpdateDescription;
use App\Jobs\UpdateDiscount;
use App\Jobs\UpdateImage;
use App\Jobs\UpdateNotice;
use App\Jobs\UpdateOffer;
use App\Jobs\UpdateReservation;
use App\Jobs\UpdateRule;
use App\Mail\ApartmentCreationApprovalRequest;
use App\Mail\ApartmentDeleteApprovalRequest;
use App\Mail\CoHostInvitation;
use App\Mail\CoHostInvitationForNonUsers;
use App\Mail\CohostUpdateForHost;
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
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

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

        // Generate a cache key based on the request parameters
        $cacheKey = 'host_homes_' . $perPage;

        return Cache::remember($cacheKey, now()->addHour(), function () use ($perPage) {
            return HostHomeResource::collection(
                HostHome::where('verified', 1)
                    ->where('disapproved', null)
                    ->whereNull('banned')
                    ->whereNull('suspend')
                    ->paginate($perPage)
            );
        });
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
        // Check if the response is cached
        $cacheKey = 'user_host_homes_' . Auth::id();
        if (Cache::has($cacheKey)) {
            // If cached, return the cached response
            return Cache::get($cacheKey);
        }

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

        // Cache the response for 1 hour
        Cache::put($cacheKey, response([
            "userHostHomes" => HostHomeResource::collection($userHostHomes),
        ], 200), 3600);

        // Return the response
        return Cache::get($cacheKey);
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
            HostHome::where(function($query) {
                $query->where('approvedByHost', true)
                      ->where('needApproval', false);
            })
            ->orWhere(function($query) {
                $query->whereNull('approvedByHost')
                      ->orWhereNull('needApproval');
            })
            ->where('verified',0)
            ->where('disapproved',null)
            ->whereNull('banned')
            ->whereNull('suspend')->get()
        );
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

        $user = User::find(auth()->id());

        ProcessHostHomeCreation::dispatch($data, $user->id);
        
        return response([
            "ok" => "Created"
        ], 201);
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
            'dates' => 'nullable|array',
            'dates.*' => 'date_format:Y-m-d',
        ]);

        $price = $data['price'];

        $hostHome = HostHome::findOrFail($id);

        if (!$hostHome) {
            abort(404, "Hosthome not found");
        }

        $dates = $data['dates'];

        if (!isset($data['dates'])) {
            $hostHome->update([
                'actualPrice' => $price,
            ]);
    
            return response("Price for all homes updated", 200);
        }
        
        if ($price == $hostHome->actualPrice) {
    
            abort(400,"Prices are already set to " . $price . ". Nothing to update.");
        }

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

        $user = User::find(auth()->id());
        $host = User::find($hostHome->user_id);
        $cohost = Hosthomecohost::where('user_id',$user->id)->first();
        if ($cohost) {
            $destination = "http://localhost:5173/Scheduler";
            Mail::to($host->email)->queue(new CohostUpdateForHost($hostHome,$host,$user,$destination));
        }

        ClearCache::dispatch($hostHome->id,$host->id);
        return response("Prices updated successfully", 200);
    }

    /**
     * @lrd:start
     * Update prices for a specific date range based on the request data.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id The ID of the host home.
     *
     * @lrd:end
     * 
     * @LRDparam new_price use|required
     * @LRDparam start_date use|required
     * @LRDparam end_date use|required
    */
    public function schdulerUpdatePricesForDateRange(Request $request, $id)
    {
        $data = $request->validate([
            'new_price' => ['required', 'numeric'],
            'start_date' => 'required|date_format:Y-m-d',
            'end_date' => 'required|date_format:Y-m-d',
        ]);

        $newPrice = $data['new_price'];
        $startDate = $data['start_date'];
        $endDate = $data['end_date'];

        $this->updatePricesForDateRange($id, $startDate, $endDate, $newPrice);
    }

    public function updatePricesForDateRange($hostHomeId, $startDate, $endDate, $newPrice)
    {
        // Find the host home by ID
        $hostHome = HostHome::findOrFail($hostHomeId);

        if (!$hostHome) {
            abort(404, "Hosthome not found");
        }

        // Check if the new price is the same as the host home's actualPrice
        if ($newPrice == $hostHome->actualPrice) {
            // Delete reserved prices for the specified date range
            ReservedPricesForCertainDay::where('host_home_id', $hostHomeId)
                ->whereBetween('date', [$startDate, $endDate])
                ->delete();

            return response("Reserved prices deleted for the specified date range because the price is reverted to actualPrice", 200);
        }

        // Update prices for the specified date range
        ReservedPricesForCertainDay::where('host_home_id', $hostHomeId)
            ->whereBetween('date', [$startDate, $endDate])
            ->update(['price' => $newPrice]);

        $user = User::find(auth()->id());
        $host = User::find($hostHome->user_id);
        $cohost = Hosthomecohost::where('user_id',$user->id)->first();
        if ($cohost) {
            $destination = "http://localhost:5173/Scheduler";
            Mail::to($host->email)->queue(new CohostUpdateForHost($hostHome,$host,$user,$destination));
        }
        
        ClearCache::dispatch($hostHome->id,$host->id);
        return response("Prices updated for the specified date range", 200);
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

        $user = User::find(auth()->id());
        $host = User::find($hostHome->user_id);
        $cohost = Hosthomecohost::where('user_id',$user->id)->first();
        if ($cohost) {
            $destination = "http://localhost:5173/Scheduler";
            Mail::to($host->email)->queue(new CohostUpdateForHost($hostHome,$host,$user,$destination));
        }

        ClearCache::dispatch($hostHome->id,$host->id);
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

        $user = User::find(auth()->id());
        $host = User::find($hostHome->user_id);
        $cohost = Hosthomecohost::where('user_id',$user->id)->first();
        if ($cohost) {
            $destination = "http://localhost:5173/Scheduler";
            Mail::to($host->email)->queue(new CohostUpdateForHost($hostHome,$host,$user,$destination));
        }

        
        ClearCache::dispatch($hostHome->id,$host->id);
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

        $user = User::find(auth()->id());
        $host = User::find($hostHome->user_id);
        $cohost = Hosthomecohost::where('user_id',$user->id)->first();
        if ($cohost) {
            $destination = "http://localhost:5173/Scheduler";
            Mail::to($host->email)->queue(new CohostUpdateForHost($hostHome,$host,$user,$destination));
        }
        
        ClearCache::dispatch($hostHome->id,$host->id);
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

        $user = User::find(auth()->id());
        $host = User::find($hostHome->user_id);
        $cohost = Hosthomecohost::where('user_id',$user->id)->first();
        if ($cohost) {
            $destination = "http://localhost:5173/Scheduler";
            Mail::to($host->email)->queue(new CohostUpdateForHost($hostHome,$host,$user,$destination));
        }
        
        ClearCache::dispatch($hostHome->id,$host->id);
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

        $user = User::find(auth()->id());
        $host = User::find($hostHome->user_id);
        $cohost = Hosthomecohost::where('user_id',$user->id)->first();
        if ($cohost) {
            $destination = "http://localhost:5173/Scheduler";
            Mail::to($host->email)->queue(new CohostUpdateForHost($hostHome,$host,$user,$destination));
        }
        
        ClearCache::dispatch($hostHome->id,$host->id);
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

        $user = User::find(auth()->id());
        $host = User::find($hostHome->user_id);
        $cohost = Hosthomecohost::where('user_id',$user->id)->first();
        if ($cohost) {
            $destination = "http://localhost:5173/Scheduler";
            Mail::to($host->email)->queue(new CohostUpdateForHost($hostHome,$host,$user,$destination));
        }

        ClearCache::dispatch($hostHome->id,$host->id);
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
     * @LRDparam dates use|required|array
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

        $user = User::find(auth()->id());
        $host = User::find($hostHome->user_id);
        $cohost = Hosthomecohost::where('user_id',$user->id)->first();
        if ($cohost) {
            $destination = "http://localhost:5173/Scheduler";
            Mail::to($host->email)->queue(new CohostUpdateForHost($hostHome,$host,$user,$destination));
        }

        ClearCache::dispatch($hostHome->id,$host->id);
        return response("Dates blocked successfully", 200);
    }

    /**
     * @lrd:start
     * 
     * Unblock specified dates or date ranges for a host home.
     * Also send the startDate and endDate
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id Host home ID
     * 
     * @lrd:end
     * @LRDparam start_date use|required
     * @LRDparam end_date use|required
    */
    public function schdulerUnblockHostHomeDates(Request $request, $id)
    {
        // Validate request data
        $data = $request->validate([
            'start_date' => 'required|date_format:Y-m-d',
            'end_date' => 'required|date_format:Y-m-d',
        ]);

            
        $startDate = $data['start_date'];
        $endDate = $data['end_date'];

        $this->unblockDateRange($id, $startDate, $endDate);
        // Respond with success message
        
        ClearCache::dispatch($hostHome->id,$host->id);
        return response("Dates unblocked successfully", 200);
    }
    
    public function unblockDateRange($hostHomeId, $startDate, $endDate)
    {
        // Find the host home by ID
        $hostHome = HostHome::findOrFail($hostHomeId);

        if (!$hostHome) {
            abort(404, "Hosthome not found");
        }

        // Update prices for the specified date range
        HostHomeBlockedDate::where('host_home_id', $hostHomeId)
            ->whereBetween('date', [$startDate, $endDate])
            ->delete();

        $user = User::find(auth()->id());
        $host = User::find($hostHome->user_id);
        $cohost = Hosthomecohost::where('user_id',$user->id)->first();
        if ($cohost) {
            $destination = "http://localhost:5173/Scheduler";
            Mail::to($host->email)->queue(new CohostUpdateForHost($hostHome,$host,$user,$destination));
        }

        
        ClearCache::dispatch($hostHome->id,$host->id);
        return response("Prices updated for the specified date range", 200);
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

            $user = User::find(auth()->id());
            $host = User::find($hostHome->user_id);
            $cohost = Hosthomecohost::where('user_id',$user->id)->first();
            if ($cohost) {
                $destination = "http://localhost:5173/Scheduler";
                Mail::to($host->email)->queue(new CohostUpdateForHost($hostHome,$host,$user,$destination));
            }
            
            ClearCache::dispatch($hostHome->id,$host->id);
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
     * @param \Illuminate\Http\Request $request The HTTP request containing the email of the potential co-host.
     * @return \Illuminate\Http\JsonResponse A JSON response indicating the success of the invitation.
     * @lrd:end
     * @LRDparam email use|required The email address of the potential co-host.
    */
    public function addCoHost(Request $request)
    {
        try {
            // Validate the incoming request data
            $data = $request->validate([
                'email' => 'required|email',
            ]);

            // Get the current authenticated host
            $host = User::find(auth()->id());

            if ($host->co_host == true) {
                abort(400,"Cohosts are not allowed to add cohost");
            }

            if ($host->hosthomes()->count() === 0) {
                abort(400,"You must have at least one home before you add a cohost");
            }

            // Check if a user with the provided email already exists
            $user = User::where('email', $data['email'])
                ->whereNull('banned')
                ->whereNull('suspend')
                ->first();
            

            // If the user doesn't exist 
            if (!$user) {
                // Send invitation to join shortlet bookings
                Mail::to($data['email'])->send(new CoHostInvitationForNonUsers($host->remember_token, $data['email'], $host->id));
                return response()->json(['message' => 'Invitation to join shortlet bookings has been sent'], 200);
            }else {
                abort(400,"Existing Users can't be a cohost");
            }

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



    public function becomeACoHost($userId,$hostid)
    {

        $user = User::find($userId);

        if ($user->email_verified_at == null) {
            abort(400,"Please verify your account first");
        }

        $hostHomes = HostHome::where('user_id', $hostid)->get();

        // Iterate through each host home
        foreach ($hostHomes as $hostHome) {
            // Check if the user is already a co-host for this home
            $existingCoHost = Hosthomecohost::where('user_id', $userId)
                ->where('host_home_id', $hostHome->id)
                ->first();

            // If the user is not already a co-host, create a co-host entry
            if (!$existingCoHost) {
                $hosthomeCoHost = new Hosthomecohost();
                $hosthomeCoHost->user_id = $userId;
                $hosthomeCoHost->host_id = $hostid;
                $hosthomeCoHost->host_home_id = $hostHome->id;
                $hosthomeCoHost->save();
            }
        }
        
        return redirect()->away('http://localhost:5173');

    }

    
    /**
     * @lrd:start
     * Remove a cohost from all host homes.
     *
     * This method removes the specified user as a cohost from all host homes.
     * If the user is not a cohost for any host home, a 404 error is returned.
     *
     * @param  int  $userId The ID of the user to be removed as a cohost.
     * @return \Illuminate\Http\Response
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException if the cohost relationship is not found.
     * @lrd:end
    */
    public function removeCoHost($userId)
    {
        try {
            // Find the user
            $user = User::findOrFail($userId);

            // Check if the user is a cohost for any host home
            $coHosts = Hosthomecohost::where('user_id', $userId)->get();

            // If the user is not a cohost for any host home, return a 404 error
            if ($coHosts->isEmpty()) {
                abort(404, "The User is not a cohost to any home");
            }

            // Delete cohost relationships for all host homes
            foreach ($coHosts as $coHost) {
                $coHost->delete();
            }

            // Return a success response
            return response("Cohost removed from all homes successfully", 200);
        } catch (\Exception $e) {
            // Provide a response for other exceptions
            return response()->json([
                'message' => 'An error occurred while removing the cohost from all homes.',
                'error' => $e->getMessage(),
            ], 500);
        }
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
        $cacheKey = "showGuestHome_".$hostHomeId;

        return Cache::remember( $cacheKey , now()->addHour() ,function () use ($hostHome){
            return new HostHomeResource($hostHome);
        });
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
        $tip->url = "/EditHostHomes" . $hosthomeid;
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

        $data = $request->validated();
        
        $user = User::find(auth()->id());

        ProcessHostHomeUpdate::dispatch($data,$user, $hostHomeId);

        return response([
            "ok" => "Updated"
        ]);
    }

    
    public function approveHomeForHost($hostid, $hosthomeid)
    {
        // Find the host home
        $hostHome = HostHome::findOrFail($hosthomeid);
        
        // Update the approval status
        $hostHome->approvedByHost = true;
        $hostHome->needApproval = false;
        $hostHome->save();
    
        // Set flash message for approval
        Session::flash('status', 'Apartment has been approved successfully.');
    
        // Return the view
        return view('approveordecline', ['message' => 'Apartment has been approved successfully.']);
    }
    
    public function disapproveHomeForHost($hostid, $hosthomeid)
    {
        // Find the host home
        $hostHome = HostHome::findOrFail($hosthomeid);
        
        // Delete the host home
        $hostHome->forceDelete();
    
        // Set flash message for disapproval
        Session::flash('status', 'Apartment has been declined.');
    
        // Return the view
        return view('approveordecline', ['message' => 'Apartment has been declined.']);
    }
    
    public function approveDeleteHomeForHost($hostid, $hosthomeid)
    {
        // Find the host home
        $hostHome = HostHome::findOrFail($hosthomeid);
        
        $hostHome->forceDelete();
    
        // Set flash message for approval
        Session::flash('status', 'Apartment has been deleted successfully.');
    
        // Return the view
        return view('approveordecline', ['message' => 'Apartment has been deleted successfully.']);
    }
    
    public function disapproveDeleteHomeForHost()
    {
    
        // Set flash message for disapproval
        Session::flash('status', 'Apartment deletion has been declined.');
    
        // Return the view
        return view('approveordecline', ['message' => 'Apartment deletion has been declined.']);
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
        
        $user = User::find(auth()->id());

        $cohost = Hosthomecohost::where('user_id',$user->id)->first();
        $hostHome = HostHome::find($id); 
        $host = User::find($hostHome->user_id);
        if ($user->co_host == true) {
            
            $hostHome->update([
                'approvedByHost' => false,
                'needApproval' => true
            ]);
            Mail::to($host->email)->queue(new ApartmentDeleteApprovalRequest($hostHome,$host,$user));
            $cohosts = $host->cohosts()->with('user')->get();
            // Filter out duplicate co-hosts based on email
            $uniqueCohosts = $cohosts->unique('user.email');

            $this->clearUserHostHomesCache($host->id);

            foreach ($uniqueCohosts as $cohost) {
                $this->clearUserHostHomesCache($cohost->user->id);
            }
            return response('Request has been sent to host',200);
        }else{
            $hostHome->hosthomedescriptions()->delete();
            $hostHome->hosthomediscounts()->delete();
            $hostHome->hosthomenotices()->delete();
            $hostHome->hosthomeoffers()->delete();
            $hostHome->hosthomephotos()->delete();
            $hostHome->hosthomereservations()->delete();
            $hostHome->hosthomerules()->delete();
            $hostHome->forceDelete();
            
            $cohosts = $host->cohosts()->with('user')->get();
            // Filter out duplicate co-hosts based on email
            $uniqueCohosts = $cohosts->unique('user.email');

            $this->clearUserHostHomesCache($host->id);

            foreach ($uniqueCohosts as $cohost) {
                $this->clearUserHostHomesCache($cohost->user->id);
            }
            return response('This home has been deleted',200);
        }

        
        $this->clearCacheForAllUsers($id);
    }
    
    
    public function clearUserHostHomesCache($userId)
    {
        $cacheKey = 'user_host_homes_' . $userId;
        if ($cacheKey) {
            Cache::forget($cacheKey);
        }
    }

    private function clearCacheForAllUsers($id)
    {
        // Generate cache key without user-specific information
        $cacheKey1 = 'host_homes_*';
        $cacheKey2 = 'filtered_host_homes_dates_*';
        $cacheKey3 = 'filtered_host_homes_*';
        $cacheKey4 = 'showGuestHome_' . $id;
        Cache::forget($cacheKey1);
        Cache::forget($cacheKey2);
        Cache::forget($cacheKey3);
        Cache::forget($cacheKey4);
    }
}
