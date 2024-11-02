<?php

namespace App\Http\Controllers\Api;

use App\Events\NewNotificationEvent;
use App\Http\Controllers\Controller;
use App\Models\HostHome;
use App\Http\Requests\StoreHostHomeRequest;
use App\Http\Requests\UpdateHostHomeRequest;
use App\Http\Resources\GetHostHomeAndIdResource;
use App\Http\Resources\HostHomeResource;
use App\Jobs\ClearCache;
use App\Jobs\NotifyAdmins;
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
use App\Mail\DisapproveHostHome;
use App\Mail\ListingApproved;
use App\Mail\NotificationMail;
use App\Mail\VerifyYourEmail;
use App\Mail\WelcomeMail;
use App\Models\Booking;
use App\Models\Cohost;
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
use Exception;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
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
use RuntimeException;

class HostHomeController extends Controller
{
    /**
     * @lrd:start
     * gets the details of every verified homes
     * /api/hosthomes?per_page=20
     * /api/hosthomesForUnAuthUser is for unauthenticated user
     * /api/hosthomesForAuthUser is for authenticated user
     * @lrd:end
     * @LRDparam per_page use|required |numeric to set how many items you want to get per page.
     */
    public function index(Request $request)
    {
        // Set a default value for the number of items per page
        $perPage = $request->input('per_page', 10);

        $user = $request->user();

        $userIdOrUniqueId = $user ? $user->id : $request->ip();

        // Generate a cache key based on the request parameters
        $cacheKey = 'host_homes_' . $perPage . "_user_id_" . $userIdOrUniqueId;

        return Cache::remember($cacheKey, now()->addHour(), function () use ($perPage) {
            // Fetch the data with relationships
            $hostHomes = HostHome::with(['hosthomereviews', 'hosthomephotos', 'hosthomedescriptions'])
                ->where('verified', 1)
                ->whereNull('disapproved')
                ->whereNull('banned')
                ->whereNull('suspend')
                ->inRandomOrder()
                ->paginate($perPage);

            // Transform the data using the resource and serialize it
            return HostHomeResource::collection($hostHomes)->response()->getData(true);
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
        
        
        $user = $request->user();

        $userIdOrUniqueId = $user ? $user->id : $request->ip();

        $cacheKey = "view_home_by" . $property_type . "_per_page_" . $perPage . "user_id_" . $userIdOrUniqueId;;
        return Cache::remember($cacheKey,60, function() use($property_type, $perPage){
            // Fetch the data with relationships
            $hostHomes = HostHome::with(['hosthomereviews', 'hosthomephotos', 'hosthomedescriptions'])
            ->where('verified', 1)
            ->whereNull('disapproved')
            ->whereNull('banned')
            ->whereNull('suspend')
            ->where('property_type',$property_type)
            ->inRandomOrder()
            ->paginate($perPage);

            // Transform the data using the resource and serialize it
            return HostHomeResource::collection($hostHomes)->response()->getData(true);
        });
        
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

            Cache::flush();
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
     * and use the query parameter per_page to determine the number of record needed ?per_page=(Number of record needed)
     * @return \Illuminate\Http\Response
     * @lrd:end
     * @LRDparam per_page use|required |numeric to set how many items you want to get per page.
    */
    public function getUserHostHomes(Request $request)
    {
        // Set a default value for the number of items per page
        $perPage = $request->input('per_page', 10);

        // Set the current page based on the request, default to 1
        $currentPage = LengthAwarePaginator::resolveCurrentPage();


        $user = $request->user();

        $userIdOrUniqueId = $user ? $user->id : $request->ip();

        // Check if the response is cached
        $cacheKey = 'user_host_homes_' . Auth::id() . '_page_' . $currentPage . '_per_page_' . $perPage . "_user_id_" . $userIdOrUniqueId;;

        if (Cache::has($cacheKey)) {
            // If cached, return the cached response
            return Cache::get($cacheKey);
        }

        // Retrieve all host homes for the authenticated user
        $userHostHomes = Auth::user()->hostHomes;

        $userCohostedHomes = Auth::user()->cohosthomes()->with('hosthome')->get()
            ->map(function ($cohost) {
                return HostHome::where('id', $cohost->host_home_id)->first();
            })
            ->flatten();

        // Combine both sets of homes
        $userHostHomes = $userHostHomes->merge($userCohostedHomes);

        // Use unique to remove potential duplicates
        $userHostHomes = $userHostHomes->unique();

        // Paginate the collection
        $paginatedHomes = $this->paginateCollection($userHostHomes, $perPage, $currentPage);

        // Cache the response for 1 hour
        Cache::put($cacheKey, $paginatedHomes, 3600);

        // Return the paginated response
        return $paginatedHomes;
    }

    /**
     * Paginate a given collection.
     *
     * @param Collection $items
     * @param int $perPage
     * @param int $page
     * @return LengthAwarePaginator
     */
    protected function paginateCollection(Collection $items, $perPage, $page)
    {
        $offset = ($page * $perPage) - $perPage;
        $paginatedItems = $items->slice($offset, $perPage)->values();

        return new LengthAwarePaginator(
            HostHomeResource::collection($paginatedItems)->response()->getData(true), 
            $items->count(), 
            $perPage, 
            $page,
            ['path' => LengthAwarePaginator::resolveCurrentPath()]
        );
    }

    /**
     * @lrd:start
     * gets the details of every homes
     * 
     * and use the query parameter per_page to determine the number of record needed ?per_page=(Number of record needed)
     * @lrd:end
     * 
     * @LRDparam per_page use|required |numeric to set how many items you want to get per page.
    */
    public function allHomes(Request $request)
    {
        // Set a default value for the number of items per page
        $perPage = $request->input('per_page', 10);

        $user = $request->user();

        $userIdOrUniqueId = $user ? $user->id : $request->ip();

        // Generate a cache key based on the request parameters
        $cacheKey = 'allHomes_for_admin_' . $perPage . "_user_id_" . $userIdOrUniqueId;

        
        return Cache::remember($cacheKey, now()->addHour(), function () use ($perPage) {
            
            return HostHomeResource::collection(
                HostHome::where('disapproved',null)
                ->whereNull('banned')
                ->whereNull('suspend')
                ->paginate($perPage)
            )->response()->getData(true);;

        });
    }
    
    
    /**
     * @lrd:start
     * gets the details of every unverified homes
     * 
     * and use the query parameter per_page to determine the number of record needed ?per_page=(Number of record needed)
     * @lrd:end
     * 
     * @LRDparam per_page use|required |numeric to set how many items you want to get per page.
    */
    public function notVerified(Request $request)
    {
        // Set a default value for the number of items per page
        $perPage = $request->input('per_page', 10);

        $user = $request->user();

        $userIdOrUniqueId = $user ? $user->id : $request->ip();
        
        // Generate a cache key based on the request parameters
        $cacheKey = 'unverifiedHomes_for_admin_' . $perPage . "_user_id_" . $userIdOrUniqueId;

        
        return Cache::remember($cacheKey, now()->addHour(), function () use ($perPage) {
            // Fetch the data with relationships

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
                ->whereNull('suspend')->paginate($perPage)
            )->response()->getData(true);
        });
    }

    private function saveImage($image,$hosthomeid)
    {
        // Check if image is base64 string
        if (preg_match('/^data:image\/(\w+);base64,/', $image, $matches)) {
            $imageData = substr($image, strpos($image, ',') + 1);
            $imageType = strtolower($matches[1]);

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
        // Validate and get data
        $data = $request->validated();
        
        // Find user
        $user = User::findOrFail(auth()->id());
        
        // Use a distributed lock
        $jobKey = "apartment_creation_job_{$user->id}";
        $lock = Cache::lock($jobKey, 15 * 60);
        
        if (!$lock->get()) {
            return response([
                "error" => "An apartment creation is already in progress for this user."
            ], 409);
        }

        try {
            // Store files in public directory with unique identifiers
            $storedFiles = $this->storeFilesInPublic($request);
            
            // Create the data array for the job
            $jobData = array_merge($data, [
                'hosthomephotos' => array_map(function($photo) {
                    return [
                        'path' => $photo['path'],
                        'original_name' => $photo['original_name'],
                        'mime_type' => $photo['mime_type'],
                        'size' => $photo['size']
                    ];
                }, $storedFiles['photos']),
                'hosthomevideo' => $storedFiles['video'] ? [
                    'path' => $storedFiles['video']['path'],
                    'original_name' => $storedFiles['video']['original_name'],
                    'mime_type' => $storedFiles['video']['mime_type'],
                    'size' => $storedFiles['video']['size']
                ] : null
            ]);

            $lock->release();
            
            // Dispatch the job with the complete data
            ProcessHostHomeCreation::dispatch(
                $jobData,
                auth()->id(), 
                $storedFiles['video'] ? $storedFiles['video']['path'] : null,
                array_column($storedFiles['photos'], 'path'),
                $lock
            )->afterCommit();
            
            return response([
                "ok" => "Apartment creation process started"
            ], 202);
            
        } catch (\Exception $e) {
            Log::error('Failed to process host home creation', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            // Clean up stored files if job dispatch fails
            if (isset($storedFiles)) {
                $this->cleanupPublicFiles($storedFiles);
            }
            
            $lock->release();
            
            return response([
                "error" => "Failed to process apartment creation: " . $e->getMessage()
            ], 500);
        }
    }

    private function storeFilesInPublic($request)
    {
        // Initialize the array to store paths for photos and video
        $storedFiles = [
            'photos' => [],
            'video' => null
        ];

        // Create a unique subdirectory
        $uniqueDir = 'hosthomes/temp_' . uniqid();
        $basePath = public_path("uploads/{$uniqueDir}");
        
        // Create directory if it doesn't exist
        if (!File::isDirectory($basePath)) {
            File::makeDirectory($basePath, 0755, true);
        }

        // Process photos
        if ($request->hasFile('hosthomephotos')) {
            foreach ($request->file('hosthomephotos') as $index => $photo) {
                // Generate filename
                $filename = "photo_{$index}_" . time() . '_' . uniqid() . '.' . $photo->getClientOriginalExtension();
                $relativePath = "uploads/{$uniqueDir}/{$filename}";
                $fullPath = public_path($relativePath);

                // Move the file using copy and ensure it was successful
                if (copy($photo->getRealPath(), $fullPath)) {
                    $storedFiles['photos'][] = [
                        'path' => $relativePath,
                        'full_path' => $fullPath,
                        'original_name' => $photo->getClientOriginalName(),
                        'mime_type' => $photo->getClientMimeType(),
                        'size' => filesize($fullPath),
                    ];
                }
            }
        }

        // Process video
        if ($request->hasFile('hosthomevideo')) {
            $video = $request->file('hosthomevideo');

            // Generate filename
            $filename = "video_" . time() . '_' . uniqid() . '.' . $video->getClientOriginalExtension();
            $relativePath = "uploads/{$uniqueDir}/{$filename}";
            $fullPath = public_path($relativePath);

            // Move the file using copy
            if (copy($video->getRealPath(), $fullPath)) {
                $storedFiles['video'] = [
                    'path' => $relativePath,
                    'full_path' => $fullPath,
                    'original_name' => $video->getClientOriginalName(),
                    'mime_type' => $video->getClientMimeType(),
                    'size' => filesize($fullPath),
                ];
            }
        }

        return $storedFiles;
    }

    private function cleanupPublicFiles($storedFiles)
    {
    // Clean up photos
    foreach ($storedFiles['photos'] as $photo) {
        if (isset($photo['full_path']) && File::exists($photo['full_path'])) {
            File::delete($photo['full_path']);
        }
    }
    
    // Clean up video
    if (!empty($storedFiles['video']) && isset($storedFiles['video']['full_path']) && File::exists($storedFiles['video']['full_path'])) {
        File::delete($storedFiles['video']['full_path']);
    }
    
    // Remove the temporary directory if it exists and is empty
    if (!empty($storedFiles['photos']) || !empty($storedFiles['video'])) {
        $dirPath = dirname(
            $storedFiles['photos'][0]['full_path'] ?? 
            $storedFiles['video']['full_path'] ?? ''
        );
        
        if (File::isDirectory($dirPath) && count(File::files($dirPath)) === 0) {
            File::deleteDirectory($dirPath);
        }
    }
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
        $cacheKey = 'host_homes_and_ids_user_' . $hostId;
        $cacheDuration = 600; // Cache duration in seconds (10 minutes)

        // Check if the data is already cached
        if (Cache::has($cacheKey)) {
            // Retrieve and return the cached data
            return response()->json(Cache::get($cacheKey));
        }

        // Retrieve host homes owned by the authenticated user
        $userOwnedHostHomes = HostHome::where("user_id", $hostId)
            ->whereNull('banned')
            ->whereNull('suspend')
            ->get();

        // Retrieve co-hosted homes where the authenticated user is a co-host
        $userCohostedHomes = Hosthomecohost::where('user_id', $hostId)
            ->with('hosthome')
            ->get()
            ->map(function ($cohost) {
                return HostHome::find($cohost->host_home_id);
            })
            ->flatten();

        // Combine both sets of homes
        $userHostHomes = $userOwnedHostHomes->merge($userCohostedHomes);

        // Use unique to remove potential duplicates
        $userHostHomes = $userHostHomes->unique('id');

        // Transform the data using the resource and serialize it
        $transformedData = GetHostHomeAndIdResource::collection($userHostHomes)->response()->getData(true);

        // Cache the transformed and serialized data
        Cache::put($cacheKey, $transformedData, $cacheDuration);

        // Return the serialized data
        return response()->json($transformedData);
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

        $user = User::find(auth()->id());
        $host = User::find($hostHome->user_id);
        
        if (!isset($data['dates'])) {
            $hostHome->update([
                'actualPrice' => $price,
            ]);
            
            Cache::flush();
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

        $cohost = Cohost::where('user_id',$user->id)->first();
        if ($cohost) {
            $destination = "https://shortletbooking.com/Scheduler";
            Mail::to($host->email)->queue(
                (new CohostUpdateForHost($hostHome,$host,$user,$destination))->onQueue('emails')
            );
        }

        Cache::flush();
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

        // Update prices for the specified date range
        ReservedPricesForCertainDay::where('host_home_id', $hostHomeId)
            ->whereBetween('date', [$startDate, $endDate])
            ->update(['price' => $newPrice]);

        $user = User::find(auth()->id());
        $host = User::find($hostHome->user_id);
        $cohost = Cohost::where('user_id',$user->id)->first();
        if ($cohost) {
            $destination = "https://shortletbooking.com/Scheduler";
            Mail::to($host->email)->queue(
                (new CohostUpdateForHost($hostHome,$host,$user,$destination))->onQueue('emails')
            );
        }
        
        Cache::flush();
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
        $cohost = Cohost::where('user_id',$user->id)->first();
        if ($cohost) {
            $destination = "https://shortletbooking.com/Scheduler";
            Mail::to($host->email)->queue(
                (new CohostUpdateForHost($hostHome,$host,$user,$destination))->onQueue('emails')
            );
        }

        Cache::flush();
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
        $cohost = Cohost::where('user_id',$user->id)->first();
        if ($cohost) {
            $destination = "https://shortletbooking.com/Scheduler";
            Mail::to($host->email)->queue(
                (new CohostUpdateForHost($hostHome,$host,$user,$destination))->onQueue('emails')
            );
        }

        
        Cache::flush();
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
        $cohost = Cohost::where('user_id',$user->id)->first();
        if ($cohost) {
            $destination = "https://shortletbooking.com/Scheduler";
            Mail::to($host->email)->queue(
                (new CohostUpdateForHost($hostHome,$host,$user,$destination))->onQueue('emails')
            );
        }
        
        Cache::flush();
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
        $cohost = Cohost::where('user_id',$user->id)->first();
        if ($cohost) {
            $destination = "https://shortletbooking.com/Scheduler";
            Mail::to($host->email)->queue(
                (new CohostUpdateForHost($hostHome,$host,$user,$destination))->onQueue('emails')
            );
        }
        
        Cache::flush();
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
        $cohost = Cohost::where('user_id',$user->id)->first();
        if ($cohost) {
            $destination = "https://shortletbooking.com/Scheduler";
            Mail::to($host->email)->queue(
                (new CohostUpdateForHost($hostHome,$host,$user,$destination))->onQueue('emails')
            );
        }
        
        Cache::flush();
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
        $cohost = Cohost::where('user_id',$user->id)->first();
        if ($cohost) {
            $destination = "https://shortletbooking.com/Scheduler";
            Mail::to($host->email)->queue(
                (new CohostUpdateForHost($hostHome,$host,$user,$destination))->onQueue('emails')
            );
        }

        Cache::flush();
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
        $cohost = Cohost::where('user_id',$user->id)->first();
        if ($cohost) {
            $destination = "https://shortletbooking.com/Scheduler";
            Mail::to($host->email)->queue(
                (new CohostUpdateForHost($hostHome,$host,$user,$destination))->onQueue('emails')
            );
        }

        Cache::flush();
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
        $cohost = Cohost::where('user_id',$user->id)->first();
        if ($cohost) {
            $destination = "https://shortletbooking.com/Scheduler";
            Mail::to($host->email)->queue(
                (new CohostUpdateForHost($hostHome,$host,$user,$destination))->onQueue('emails')
            );
        }

        
        Cache::flush();
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
            $cohost = Cohost::where('user_id',$user->id)->first();
            if ($cohost) {
                $destination = "https://shortletbooking.com/Scheduler";
                Mail::to($host->email)->queue(
                    (new CohostUpdateForHost($hostHome,$host,$user,$destination))->onQueue('emails')
                );
            }
            
            Cache::flush();
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
                Mail::to($data['email'])->queue(
                    (new CoHostInvitationForNonUsers($host->remember_token, $data['email'], $host->id))->onQueue('emails')
                );
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
        
        return view('/');

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

            $cohost = User::find(auth()->id());

            if ($cohost->co_host == true) {
                abort(404, "Cohosts can't remove other cohosts");
            }

            // Find the user
            $user = User::findOrFail($userId);

            $user->forceDelete();
            
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
        $cacheKey = 'host_home_' . $hostHomeId . '_user_' . auth()->id();
        $cacheDuration = 600; // Cache duration in seconds (10 minutes)

        // Check if the data is already cached
        if (Cache::has($cacheKey)) {
            // Retrieve and return the cached data
            return response()->json(Cache::get($cacheKey));
        }

        // If not cached, proceed to fetch and process the data
        $hostHome = HostHome::with(['hosthomereviews', 'hosthomephotos', 'hosthomedescriptions'])
        ->find($hostHomeId);
        $user = Auth::user();

        if ($hostHome && ($user->adminStatus != null || $user->hosthomes->contains('id', $hostHomeId) || $user->cohosthomes->contains('host_home_id', $hostHomeId))) {
            // Transform the data using the resource and serialize it to an array
            $hostHomeResourceArray = (new HostHomeResource($hostHome))->response()->getData(true);

            // Wrap the data in a 'data' key
            $wrappedData = $hostHomeResourceArray;

            // Cache the wrapped and serialized data
            Cache::put($cacheKey, $wrappedData, $cacheDuration);

            // Return the serialized data
            return response()->json($wrappedData);
        } else {
            abort(403, 'Unauthorized Access');
        }
    }

    

    /**
     * @lrd:start
     * Display a specific home to a guest based on the provided home ID.
     *
     * This method is designed to allow guests (non-authenticated users) and authenticated users to view the details 
     * of a home based on a provided `hostHomeId`. The method caches the response to optimize performance, reducing 
     * the load on the database for subsequent requests for the same home from the same user or IP address.
     *
     * The method works as follows:
     * - It first identifies the user making the request. If the user is authenticated, their user ID is used;
     *   otherwise, the user's IP address is used as a unique identifier.
     * - It then constructs a unique cache key based on the `hostHomeId` and the user's ID or IP.
     * - If the data is not already cached, it queries the `HostHome` model to fetch the home details, ensuring 
     *   that only verified, non-disapproved, non-banned, and non-suspended homes are returned.
     * - The resulting home data is then wrapped in a `HostHomeResource` for consistent API responses and is cached 
     *   for one hour.
     * - Additionally, an object named `bookingCount` represents the number of times the apartment has been booked for the 
     *   20% New listing promotion, 
     *   which should be included in the `HostHomeResource` output.
     *
     * @param  int  $hostHomeId  The ID of the home to be displayed.
     * @lrd:end
     */
    public function showGuestHome($hostHomeId)
    {
        if (!HostHome::find($hostHomeId)) {
            abort(404, "Hosthome not found");
        }
    
        $user = request()->user();

        $userIdOrUniqueId = $user ? $user->id : request()->ip();

        $cacheKey = "showGuestHome_".$hostHomeId . "_user_id_" . $userIdOrUniqueId;
        
        return Cache::remember( $cacheKey , now()->addHour() ,function () use ($hostHomeId){
            $hostHome = HostHome::whereId($hostHomeId)
                        ->where('verified', 1)
                        ->where('disapproved',null)
                        ->whereNull('banned')
                        ->whereNull('suspend')->first();
            return (new HostHomeResource($hostHome))->response()->getData(true);
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
        
        $user = User::find($hostHome->user_id);
        
        $hostHome->update([
            "verified" => 1,
        ]);


        $message = "Your home listing has been approved!.";
        $title = "Home Listing Approved";
        $notification = new Notification();
        $notification->user_id = $user->id;  // Assuming you want to save the user ID
        $notification->Message = $message;
        $notification->save();
        // Broadcast the NewNotificationEvent to notify the WebSocket clients
        event(new NewNotificationEvent($notification, $notification->id, $user->id));
        Mail::to($user->email)->queue(
            (new ListingApproved($user, $hostHome, $title))->onQueue('emails')
        );
    
        Cache::flush();
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

        $hostHome = HostHome::find($hosthomeid);

        $title = "Your home $hostHome->title was not approved";

        $notify = new Notification();
        $notify->user_id = $user;
        $notify->Message = $data['message'];
        $notify->save();

        $tip = new Tip();
        $tip->user_id = $user;
        $tip->message = $data['message'];
        $tip->url = "listings";
        $tip->save();

        $user = User::find($user);

        $hostHome->update([
            'disapproved' => 'disapproved'
        ]);

        
        $notification = new Notification();
        $notification->user_id = $user->id;  // Assuming you want to save the user ID
        $notification->Message = $data['message'];
        $notification->save();
        // Broadcast the NewNotificationEvent to notify the WebSocket clients
        event(new NewNotificationEvent($notification, $notification->id, $user->id));

        Mail::to($user->email)->queue(
            (new DisapproveHostHome($user,$data['message'],$hostHome,$title))->onQueue('emails')
        );
        
        Cache::flush();
        return response()->json(['message'=>'disapproved'],200);
    }

    /**
     * @lrd:start
     * this is used to update the host home details the {hosthome} is the hosthome id the values are the same with the post except you dont have to include the arrays but if you want to update it overide all the other data
     * @lrd:end
     */
    public function update(UpdateHostHomeRequest $request, $hostHomeId)
    {
        // Validate and get data
        $data = $request->validated();

        // Find user
        $user = User::findOrFail(auth()->id());

        // Use a distributed lock for apartment updates
        $jobKey = "apartment_update_job_{$hostHomeId}";
        $lock = Cache::lock($jobKey, 15 * 60);

        if (!$lock->get()) {
            return response()->json([
                "error" => "An apartment update is already in progress for this listing."
            ], 409);
        }

        try {
            // Store any uploaded files
            $storedFiles = $this->storeFilesInPublic($request);
            
            // Include stored file paths in data
            $data['hosthomephotos'] = $storedFiles['photos'] ?? [];
            $data['hosthomevideo'] = $storedFiles['video'] ?? null;

            $lock->release();

            // Dispatch the update job with user and stored file info
            ProcessHostHomeUpdate::dispatch($data, $user, $hostHomeId, $lock);

            return response()->json([
                "ok" => "Update process started"
            ], 202);
            
        } catch (\Exception $e) {
            $lock->release();
            
            // Clean up files if the dispatch fails
            if (isset($storedFiles)) {
                $this->cleanupPublicFiles($storedFiles);
            }

            return response()->json([
                "error" => "An error occurred while processing your request."
            ], 500);
        } finally {
            // Always release the lock in the end
            $lock->release();
        }
    }

    
    public function approveHomeForHost($hostid, $hosthomeid)
    {
        // Find the host home
        $hostHome = HostHome::findOrFail($hosthomeid);
        
        // Update the approval status
        $hostHome->approvedByHost = true;
        $hostHome->needApproval = false;
        $hostHome->save();
    
        $host = User::find($hostid);
        
        // Set flash message for approval
        Session::flash('status', 'Apartment has been approved successfully.');
    
        $chunkSize = 100;

        $title = "New Apartment Created: Admin Action Required";

        // Process admins in chunks
        User::whereNotNull('adminStatus')->chunk($chunkSize, function ($admins) use ($hostHome, $title, $host) {
            try {
                // Dispatch the notification job for the current chunk of admins
                NotifyAdmins::dispatch($admins, $hostHome, $host, $title);
            } catch (\Exception $e) {
                // Optionally log any errors during the dispatch
                Log::error("Failed to dispatch NotifyAdmins job: " . $e->getMessage());
            }
        });
    
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
     * This method is used to delete the host home details. The `{hosthome}` parameter 
     * represents the ID of the host home that is to be deleted.
     * 
     * The method returns the following status codes:
     * - `200 OK`: If the host home is successfully deleted.
     * - `403 Forbidden`: If the host home cannot be deleted due to active bookings 
     *   that do not meet the necessary conditions, such as pending wallet deposits 
     *   or unresolved security deposits.
     * 
     * Note: The host home cannot be deleted if there are certain active bookings 
     * associated with it that do not meet specific conditions.
     * @lrd:end
     */
    public function destroy($id)
    {
        
        $user = User::find(auth()->id());

        $hostHome = HostHome::find($id); 
        $host = User::find($hostHome->user_id);

        // Get the current date and time
        $currentDateTime = Carbon::now();

        // Check if the user is currently hosting and has a non-null checkOutNotification
        $isHosting = Booking::where('host_home_id', $id)
                            ->where('paymentStatus', 'success')
                            ->where('check_in', '<=', $currentDateTime->format('Y-m-d'))
                            ->where('check_out', '>=', $currentDateTime->format('Y-m-d'))
                            ->whereNotNull('checkOutNotification')
                            ->exists();

        // Check if the user is currently staying and has a non-null checkOutNotification
        $isStaying = Booking::where('host_home_id', $id)
                            ->where('paymentStatus', 'success')
                            ->where('check_in', '<=', $currentDateTime->format('Y-m-d'))
                            ->where('check_out', '>=', $currentDateTime->format('Y-m-d'))
                            ->whereNotNull('checkOutNotification')
                            ->exists();

        // If the user is either hosting or staying, and checkOutNotification is set, prevent the ban
        if ($isHosting || $isStaying) {
            return response()->json([
                'message' => 'The host home cannot be deleted because there is an ongoing stay or hosting activity. Please wait until the current booking is completed.'
            ], 403);
        }

        // Efficiently check for conditions on active bookings
        $activeBooking = Booking::where('host_home_id', $id)
        ->where('paymentStatus', 'success')
        ->where(function ($query) {
            $query->whereNull('addedToHostWallet')
                ->orWhere(function ($query) {
                    $query->whereNotNull('pauseSecurityDepositToGuest')
                            ->whereNull('securityDepositToGuest')
                            ->orWhereNull('securityDepositToHost')
                            ->orWhereNotNull('securityDepositToHost')
                            ->whereNull('securityDepositToHostWallet');
                });
        })
        ->first();

        // If an active booking violates any condition, return an appropriate error message
        if ($activeBooking) {
            if ($activeBooking->addedToHostWallet === null) {
                return response()->json([
                    'message' => 'The host home cannot be deleted because the booking funds have not yet been added to the host\'s wallet.'
                ], 403);
            }

            if ($activeBooking->addedToGuestWallet === null) {
                if ($activeBooking->pauseSecurityDepositToGuest !== null && 
                ($activeBooking->securityDepositToGuest === null || $activeBooking->securityDepositToHost === null)) {
                    return response()->json([
                        'message' => 'The host home cannot be deleted because the security deposit is paused and has not yet been released to the guest or host.'
                    ], 403);
                }

                if ($activeBooking->securityDepositToHost !== null && $activeBooking->securityDepositToHostWallet === null) {
                    return response()->json([
                    'message' => 'The host home cannot be deleted because the security deposit has been released to the host but has not yet been added to the host\'s wallet.'
                    ], 403);
                }
            }
        }

        if ($user->co_host == true) {
            
            $hostHome->update([
                'approvedByHost' => false,
                'needApproval' => true
            ]);
            Mail::to($host->email)->queue(
                (new ApartmentDeleteApprovalRequest($hostHome,$host,$user))->onQueue('emails')
            );
            $this->clearCacheForAllUsers();
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
            
            $this->clearCacheForAllUsers();
        }

        
    }
    

    private function clearCacheForAllUsers()
    {
        Cache::flush();
    }
}
