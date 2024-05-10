<?php

namespace App\Http\Controllers\Api;

use SadiqSalau\LaravelOtp\Facades\Otp;
use App\Http\Controllers\Controller;
use App\Http\Requests\CreateOrUpdateAboutUserRequest;
use App\Http\Requests\FilterHomepageLocationRequest;
use App\Http\Requests\FilterHomepageRequest;
use App\Http\Requests\FilterHostHomesDatesRequest;
use App\Http\Requests\RequestPayRequest;
use Illuminate\Support\Facades\Notification as UserNotification;
use App\Http\Requests\StoreCreateUserBankAccountRequest;
use App\Http\Requests\StoreCreateUserCardRequest;
use App\Http\Requests\StoreWishlistRequest;
use App\Http\Requests\UpdateUserNumberRequest;
use App\Http\Requests\UserDetailsUpdateRequest;
use App\Http\Requests\VerifyOtpRequest;
use App\Http\Resources\AllReservationsResource;
use App\Http\Resources\BookedResource;
use App\Http\Resources\GuestReviewsResource;
use App\Http\Resources\HostHomeEarningsResource;
use App\Http\Resources\HostHomeHostInfoResource;
use App\Http\Resources\HostHomeResource;
use App\Http\Resources\HostTransactionHistoryResource;
use App\Http\Resources\StoreWishlistResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\UserTransactionResource;
use App\Http\Resources\UserTripResource;
use App\Http\Resources\WishlistContainerItemResource;
use App\Jobs\RequestPay;
use App\Mail\ActivateAccount;
use App\Mail\NotificationMail;
use App\Mail\VerifyUser;
use App\Models\AboutUser;
use App\Models\Adminrole;
use App\Models\Booking;
use App\Models\Canceltrip;
use App\Models\HostHome;
use App\Models\Hosthomecohost;
use App\Models\HostView;
use App\Models\Notification;
use App\Models\Tip;
use App\Models\User;
use App\Models\Userbankinfo;
use App\Models\UserCard;
use App\Models\UserRequestPay;
use App\Models\UserTrip;
use App\Models\UserWallet;
use App\Models\Wishlistcontainer;
use App\Models\WishlistContainerItem;
use App\Models\WishlistControllerItem;
use App\Otp\UserUpdateNumberOtp;
use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Jlorente\Laravel\CreditCards\Facades\CreditCardValidator;

class UserController extends Controller
{
    /**
     * @lrd:start
     * this gets the details of every user that is not  verified so that they can be verified by the admin
     * @lrd:end
     */
    public function index()
    {
        return UserResource::collection(
            User::Where('verified' , "Not Verified")->distinct()->get()
        );
    }
    
    /**
     * @lrd:start
     * Get records of all the money that went into the user's wallet.
     *
     * @lrd:end
     */
    public function viewUserWalletRecords()
    {
        try {
            // Retrieve the authenticated user's ID
            $userId = auth()->id();

            // Retrieve records from bookings where the user is the host and addedToHostWallet is not null
            $bookingHostBalanceRecords = Booking::join('host_homes', 'bookings.host_home_id', '=', 'host_homes.id')
                ->where('bookings.hostId', $userId)
                ->whereNotNull('bookings.addedToHostWallet')
                ->select('bookings.id', 'bookings.hostBalance as amount', 'bookings.created_at', 'bookings.updated_at')
                ->selectRaw('host_homes.id AS hosthome_id, host_homes.title AS hosthome_title')
                ->get();

            // Retrieve records from cancel trips where the user is the host and addedToHostWallet is not null
            $cancelTripHostRefundRecords = Canceltrip::join('bookings', 'canceltrips.booking_id', '=', 'bookings.id')
            ->join('host_homes', 'bookings.host_home_id', '=', 'host_homes.id')
            ->where('canceltrips.host_id', $userId)
            ->whereNotNull('canceltrips.addedToHostWallet')
            ->select('canceltrips.id', 'canceltrips.host_refund as amount', 'canceltrips.created_at', 'canceltrips.updated_at')
            ->selectRaw('host_homes.id AS hosthome_id, host_homes.title AS hosthome_title')
            ->get();


            // Retrieve records from cancel trips where the user is the guest and addedToGuestWallet is not null
            $cancelTripGuestRefundRecords = CancelTrip::join('bookings', 'canceltrips.booking_id', '=', 'bookings.id')
            ->join('host_homes', 'bookings.host_home_id', '=', 'host_homes.id')
            ->where('canceltrips.user_id', $userId)
            ->whereNotNull('canceltrips.addedToGuestWallet')
            ->select('canceltrips.id', 'canceltrips.guest_refund as amount', 'canceltrips.created_at', 'canceltrips.updated_at')
            ->selectRaw('host_homes.id AS hosthome_id, host_homes.title AS hosthome_title')
            ->get();


            // Retrieve records from bookings where the user is the host and securityDepositToHost is not null
            $bookingSecurityDepositToHostRecords = Booking::join('host_homes', 'bookings.host_home_id', '=', 'host_homes.id')
            ->where('bookings.hostId', $userId)
            ->whereNotNull('bookings.securityDepositToHost')
            ->whereNotNull('bookings.pauseSecurityDepositToGuest')
            ->select('bookings.id', 'bookings.securityDeposit as amount', 'bookings.created_at', 'bookings.updated_at')
            ->selectRaw('host_homes.id AS hosthome_id, host_homes.title AS hosthome_title')
            ->get();

            // Retrieve records from bookings where the user is the guest and securityDepositToGuest is not null
            $bookingSecurityDepositToGuestRecords = Booking::join('host_homes', 'bookings.host_home_id', '=', 'host_homes.id')
            ->where('bookings.user_id', $userId)
            ->where(function ($query) {
                $query->whereNotNull('bookings.addedToGuestWallet')
                    ->orWhere(function ($query) {
                        $query->whereNotNull('bookings.securityDepositToGuest')
                            ->whereNotNull('bookings.pauseSecurityDepositToGuest');
                    });
            })
            ->select('bookings.id', 'bookings.securityDeposit as amount', 'bookings.created_at', 'bookings.updated_at')
            ->selectRaw('host_homes.id AS hosthome_id, host_homes.title AS hosthome_title')
            ->get();


            // Combine all records into a single collection with titles
            $walletRecords = collect([
                'Host Balance' => $bookingHostBalanceRecords,
                'Host Refund' => $cancelTripHostRefundRecords,
                'Guest Refund' => $cancelTripGuestRefundRecords,
                'Host Security Deposit' => $bookingSecurityDepositToHostRecords,
                'Guest Security Deposit' => $bookingSecurityDepositToGuestRecords,
            ])->map(function ($records, $title) {
                return [
                    'title' => $title,
                    'records' => $records,
                ];
            });

            return response()->json(['wallet_records' => $walletRecords]);
        } catch (\Exception $e) {
            // Provide a response for other exceptions
            return response()->json([
                'message' => 'An error occurred while retrieving user wallet records.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * @lrd:start
     * Create or update the about user details for the authenticated user.
     * @lrd:end
     */
    public function createOrUpdateAboutUser(CreateOrUpdateAboutUserRequest $request)
    {
        // Retrieve the authenticated user
        $user = $request->user();
        
        // Validate the incoming request data
        $data = $request->validated();

        // Retrieve the user's about user record, or create a new one if it doesn't exist
        $aboutUser = $user->aboutUser->first();
        
        if (!$aboutUser) {
            $aboutUser = new AboutUser();
            $user->aboutUser()->save($aboutUser);
        }

        // Fill the about user record with the validated data
        $aboutUser->fill($data);

        // Save the about user record to the database
        $aboutUser->save();

        // Return a JSON response indicating success
        return response()->json(['message' => 'Details saved successfully']);
    }
    
    /**
     * @lrd:start
     * this gets the details of every user that is verified 
     * @lrd:end
     */
    public function getVerifiedUsers()
    {
        return UserResource::collection(
            User::Where('verified' , "Verified")->distinct()->get()
        );
    }

    /**
     * @lrd:start
     * this gets the tips of an auth user
     * @lrd:end
     */
    public function userTips()
    {
        $user = Auth::user();
        $tips = $user->tips;
        return response($tips);
    }

    public function create()
    {
        //
    }

    /**
     * @lrd:start
     * This requests an authenticated user details this is a get request
     * @lrd:end
     */
    public function getUserInfo(Request $request)
    {
        // Get the authenticated user
        $user = $request->user();

        // Generate a unique cache key based on the user's ID
        $cacheKey = "user_info_{$user->id}";

        // Return cached data if available, otherwise fetch and cache the user info
        return Cache::remember($cacheKey, now()->addHour(), function () use ($user) {
            // Check if the user has adminStatus as 'admin' or 'super admin'
            if ($user->adminStatus === 'admin' || $user->adminStatus === 'super admin') {
                // Fetch the admin roles for the user
                $adminRoles = Adminrole::where('user_id', $user->id)->get(['rolePermission']);

                // Merge the admin roles with the user data
                $userDataWithRoles = $user->toArray() + ['adminRoles' => $adminRoles];

                return response()->json($userDataWithRoles, 200);
            }

            // If not an admin, return user data without admin roles
            return response()->json($user, 200);
        });
    }
    
    /**
     * @lrd:start
     * Gets an auth user token
     * @lrd:end
     */
    public function getUserToken($userId) {
        // Retrieve the user by ID
        $user = User::findOrFail($userId);
    
        // Check if the user has any personal access tokens
        if ($user->tokens->isEmpty()) {
            return response()->json(['error' => 'User does not have any personal access tokens'], 404);
        }

        $recentToken = $user->tokens->last();
        info($recentToken);
    
        // Return the token associated with the user
        return $recentToken->token;
    }

    /**
     * @lrd:start
     * Not in use
     * @lrd:end
     */
    public function store(Request $request)
    {
        //
    }
    
    /**
     * @lrd:start
     * Not in use
     * @lrd:end
     */
    public function show(User $user)
    {
        //
    }
    
    /**
     * @lrd:start
     * Not in use
     * @lrd:end
     */
    public function edit(User $user)
    {
        //
    }

    private function saveImage($image)
    {
        // Check if image is base64 string
        if (preg_match('/^data:image\/(\w+);base64,/', $image, $matches)) {
            $imageData = substr($image, strpos($image, ',') + 1);
            $imageType = strtolower($matches[1]);

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
     * This is a put request and it is used to update a user information as you can see it accept a value in the url this value is an authenticated user id
     * and also when the user google_id is null disable the input tag for the email the google_id is what tells you the user used google to sign up and userid is the auth user id
     * @lrd:end
     */

    public function update(UserDetailsUpdateRequest $request, $userDetail)
    {
        $user = User::whereId($userDetail)->first();
        $data = $request->validated();
        if (trim(! empty($data['firstName'])) || trim(! empty($data['lastName']))) {
            $user->update([
                'name' => $data['firstName'] . " " . $data['lastName']
            ]);
        }
        elseif(trim(! empty($data['email']))){
            $user->update([
                'email' => $data['email']
            ]);
        }
        elseif(trim(! empty($data['country'])) || trim(! empty($data['zipCode'])) || trim(! empty($data['street'])) || trim(! empty($data['city'])) || trim(! empty($data['state']))){
            $user->update([
                'country' => $data['country'],
                'street' => $data['street'],
                'state' => $data['state'],
                'city' => $data['city'],
                'zipcode' => $data['zipCode']
            ]);
        }elseif(trim(! empty($data['profilePicture']))){
            $user->update([
                'profilePicture' => $this->saveImage($data['profilePicture'])
            ]);
        }
        elseif(trim(! empty($data['emergency_no']))){
            $user->update([
                'emergency_no' => $data['emergency_no']
            ]);
        }
        elseif(trim(! empty($data['status']))){
            $user->update([
                'verified' => $data['status']
            ]);
            $notify = new Notification();
            $notify->user_id = $user->id;
            $notify->Message = "You Government id is " . $data['status'];
            $notify->save();
            
            if ($data['status'] != "Verified") {
                $tip = new Tip();
                $tip->user_id = $user;
                $tip->message = "You Government id is " . $data['status'];
                $tip->url = "/AddGovvernmentId";
                $tip->save();
            }
            
            Mail::to($user->email)->send(new VerifyUser($data['status']));

        }
        elseif(isset($data['government_id']) && isset($data['live_photo']) && isset($data['verification_type'])){
            $user->update([
                'verified' => "Not Verified",
                'verification_type' => $data['verification_type'],
                'government_id' => $this->saveImage($data['government_id']),
                'live_photo' => $this->saveImage($data['live_photo'])
            ]);
        }else{
            return response("Please fill out all fields",422);
        }
        
        $user->save();
        $cacheKey = "user_info_{$user->id}";
        Cache::forget($cacheKey);
        return response("Updated successfully");

    }

    /**
     * @lrd:start
     * Send OTP for changing the user's phone number.
     * This method is responsible for sending an OTP to the user's email for verifying a change in their phone number.
     * @lrd:end
     */
    public function sendOtpForPhoneNumberChange(UpdateUserNumberRequest $request)
    {
        $data = $request->validated();
        $userid = auth()->id();
        $user = User::find($userid);

        $otp = Otp::identifier($user->email)->send(
            new UserUpdateNumberOtp(
                id: $userid,
                phone_number: $data['new_number']
            ),
            UserNotification::route('mail', $user->email)
        );
    
        return __($otp['status']);
    }

    /**
     * @lrd:start
     * Verify the OTP provided by the user for changing their phone number.
     * This method verifies the OTP provided by the user for changing their phone number.
     * @lrd:end
     */
    public function verifyOtp(VerifyOtpRequest $request) {

        $data = $request->validated();
        $userid = auth()->id();
        $user = User::find($userid);
    
        $otp = Otp::identifier($user->email)->attempt($data['otp_code']);
    
        if($otp['status'] != Otp::OTP_PROCESSED)
        {
            abort(403, __($otp['status']));
        }
    
        return response("Phone number sucessfully Changed");
    }

    /**
     * @lrd:start
     * This retrieve all a guest Transaction (Booking)
     * @lrd:end
     */
    public function transactionHistory(Request $request) {

        $perPage = $request->input('per_page', 10);
        $bookings = Booking::where('user_id',auth()->id())
        ->where('paymentStatus', 'success')->latest()->paginate($perPage);

        return UserTransactionResource::collection($bookings);
    }

    /**
     * @lrd:start
     * Gets the transaction history for the paid authenticated host user.
     * @lrd:end
     * 
     * @LRDparam per_page use|required
     */
    public function hostTransactionHistory(Request $request) {

        $perPage = $request->input('per_page', 10);
        $bookings = Booking::where('hostId',auth()->id())
        ->where('paymentStatus', 'success')->latest()->paginate($perPage);

        return UserTransactionResource::collection($bookings);
    }
    
    /**
     * @lrd:start
     * This retrieve all a hostCompleted Payouts Transactions
     * @lrd:end
     * 
     * @LRDparam per_page use|required
     */
    public function hostCompletedPayoutsHistory(Request $request) {

        $perPage = $request->input('per_page', 10);
        $bookings = Booking::where('hostId',auth()->id())
        ->where('paymentStatus', 'success')
        ->whereNotNull('paidHostStatus')->latest()->paginate($perPage);

        return HostTransactionHistoryResource::collection($bookings);
    }

    /**
     * @lrd:start
     * 
     * This method is responsible for recording views on a specific host home by a host user.
     *
     * @param int $hosthomeid The ID of the host home for which the view is being registered.
     * @param int $hostid The ID of the host user registering the view.
     *
     * @return \Illuminate\Http\Response A response indicating the successful update of the host view.
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException If either the host home or host user is not found.
     * @lrd:end
     */
    public function hostHomeView($hosthomeid,$hostid) {
        
        $user = User::findOrFail($hostid);
        $hosthome = HostHome::findOrFail($hosthomeid);
        
        $hostView = new HostView();
        $hostView->host_home_id = $hosthome->id;
        $hostView->host_id = $user->id;
        $hostView->views = 1;
        $hostView->save();
        
        return response("Host view updated",200);
        
    }
    
    

    /**
     * @lrd:start
     * 
     * Get host analytics data for the past 30 days, including HostView count, new bookings count, and booking rate.
     *
     * @lrd:end
     */
    public function hostAnalytics()
    {   
        
        $hostId = null;

        $user = User::find(auth()->id());

        // If the authenticated user is a cohost, find the corresponding host
        if ($user->co_host == 1) {
            $cohostOgHost = Hosthomecohost::where('user_id', $user->id)->first();
            $hostId = $cohostOgHost->host_id;
        } else {
            $hostId = $user->id;
        }

        // Get the current date
        $now = Carbon::now();

        // Calculate the date 30 days ago
        $thirtyDaysAgo = $now->subDays(30);

        // Find the host user
        $host = User::findOrFail($hostId);

        // Get the HostView count for the past 30 days
        $hostViewCount = HostView::where('host_id', $host->id)
            ->whereDate('created_at', '>=', $thirtyDaysAgo)
            ->count();

        // Get the new bookings count for the past 30 days
        $newBookingsCount = Booking::where('hostId', $host->id)
            ->where('paymentStatus', 'success')
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->count();

        // Calculate the booking rate (percentage)
        $bookingRate = $newBookingsCount > 0 ? min(($newBookingsCount / 30) * 100, 100) : 0;

        // Prepare the response data
        $responseData = [
            'host_view_count_30_days' => $hostViewCount ?? 0,
            'new_bookings_count_30_days' => $newBookingsCount ?? 0,
            'booking_rate' => $bookingRate ?? 0,
        ];

        // Return the response
        return response()->json(['data' => $responseData]);
    }

    /**
     * @lrd:start
     * Get host analytics data for a specific month and year, including HostView count,
     * new bookings count, and booking rate.
     *
     * @param string $month The full month name in lowercase (e.g., "february").
     * @param int $year The year.
     * @return \Illuminate\Http\JsonResponse
     * @lrd:end
     */
    public function hostAnalyticsByMonthYear($month, $year)
    {   
        $hostId = null;

        $user = User::find(auth()->id());

        // If the authenticated user is a cohost, find the corresponding host
        if ($user->co_host) {
            $cohostOgHost = Hosthomecohost::where('user_id', $user->id)->first();
            $hostId = $cohostOgHost->host_id;
        } else {
            $hostId = $user->id;
        }

        // Validate the month input
        $validMonths = [
            'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'
        ];

        if (!in_array($month, $validMonths)) {
            return response()->json(['error' => 'Invalid month provided'], 400);
        }

        // Convert month name to numeric representation
        $numericMonth = date_parse($month)['month'];

        // Get the current date
        $now = Carbon::now();

        // Set the date to the first day of the specified month and year
        $startDate = Carbon::createFromDate($year, $numericMonth, 1)->startOfDay();

        // Set the date to the last day of the specified month and year
        $endDate = $startDate->copy()->endOfMonth();

        // Find the host user
        $host = User::findOrFail($hostId);

        // Get the HostView count for the specified month and year
        $hostViewCount = HostView::where('host_id', $host->id)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();

        // Get the new bookings count for the specified month and year
        $newBookingsCount = Booking::where('hostId', $host->id)
            ->where('paymentStatus', 'success')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();

        // Calculate the booking rate (percentage)
        $daysInMonth = $startDate->diffInDays($endDate) + 1;
        $bookingRate = $newBookingsCount > 0 ? min(($newBookingsCount / $daysInMonth) * 100, 100) : 0;

        // Prepare the response data
        $responseData = [
            'host_view_count' => $hostViewCount ?? 0,
            'new_bookings_count' => $newBookingsCount ?? 0,
            'booking_rate' => $bookingRate ?? 0,
        ];

        // Return the response
        return response()->json(['data' => $responseData]);
    }


    /**
     * @lrd:start
     * Resend the OTP for changing the user's phone number.
     * This method resends the OTP for changing the user's phone number.
     * @lrd:end
     */
    public function resendOtp() {

        $userid = auth()->id();
        $user = User::find($userid);
        
        $otp = Otp::identifier($user->email)->update();
    
        if($otp['status'] != Otp::OTP_SENT)
        {
            abort(403, __($otp['status']));
        }
        return __($otp['status']);
    }


    /**
     * @lrd:start
     * This is used to create a wishlistcontainer and wishlistitem
     * or use an existing wishlistcontainer and wishlistitem
     * and userid is an auth user id 
     * @lrd:end
     */
    public function createWishlist(StoreWishlistRequest $request, $id)
    {
        $data = $request->validated();
        $user = User::where('id', $id)->firstOrFail();

        if (isset($data['containername'])) {

            // Check if a wishlist container with the same name already exists for the user
            if ($user->wishlistcontainers()->where('name', $data['containername'])->exists()) {
                return response("Wishlist container with the same name already exists", 422);
            }

            $wishlistContainer = new Wishlistcontainer();
            $wishlistContainer->user_id = $user->id;
            $wishlistContainer->name = $data['containername'];
            $wishlistContainer->save();

            $hosthome = HostHome::where('id', $data['hosthomeid'])->firstOrFail();

            // Check if the combination already exists before saving
            if (!$wishlistContainer->items()->where('host_home_id', $hosthome->id)->exists()) {
                $wishlistContainerItem = new WishlistContainerItem();
                $wishlistContainerItem->wishlistcontainer_id = $wishlistContainer->id;
                $wishlistContainerItem->host_home_id = $hosthome->id;
                $wishlistContainerItem->save();

                $cacheKey = "userWishlistContainersAndItems{$user->id}";
                $cacheKey2 = "user_wishlist" . auth()->id();
                $cacheKey3 = "userWishlistContainerItems{$user->id}ContainerId{$wishlistContainer->id}";
                Cache::forget($cacheKey);
                Cache::forget($cacheKey2);
                Cache::forget($cacheKey3);
                return response("Ok", 201);

            } else {
                return response("Item already exists in the wishlist container", 422);
            }
        } elseif (isset($data['wishcontainerid']) && isset($data['hosthomeid'])) {
            $hosthome = HostHome::where('id', $data['hosthomeid'])->firstOrFail();
            $wishlistcontainer = Wishlistcontainer::where('id', $data['wishcontainerid'])->firstOrFail();

            // Check if the combination already exists before saving
            if (!$wishlistcontainer->items()->where('host_home_id', $hosthome->id)->exists()) {
                $wishlistContainerItem = new WishlistContainerItem();
                $wishlistContainerItem->wishlistcontainer_id = $wishlistcontainer->id;
                $wishlistContainerItem->host_home_id = $hosthome->id;
                $wishlistContainerItem->save();

                $cacheKey = "userWishlistContainersAndItems{$user->id}";
                $cacheKey2 = "userWishlistContainerItems{$user->id}ContainerId{$data['wishcontainerid']}";
                Cache::forget($cacheKey);
                Cache::forget($cacheKey2);
                return response("Ok", 201);

            } else {
                return response("Item already exists in the wishlist container", 422);
            }
        } else {
            return response("You are not setting it right", 422);
        }
    }

    /**
     * @lrd:start
     * Remove a HostHome from the user's wishlist.
     *
     * This endpoint allows authenticated users to remove a HostHome from their wishlist. 
     * 
     *
     * @param int $hostHomeId The ID of the HostHome to be removed from the wishlist.
     *
     * @return \Illuminate\Http\Response
     * 
     * - 200: Successfully removed the HostHome from the wishlist.
     * - 403: Unauthorized to remove the item (e.g., user does not own the HostHome in the wishlist).
     * - 404: HostHome not found.
     * 
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException If the HostHome with the given ID is not found.
     * 
     * Example Request:
     * ```
     * DELETE /api/wishlist/{hostHomeId}
     * ```
     * 
     * Example Response (Success):
     * ```
     * {
     *     "message": "HostHome successfully removed from the wishlist"
     * }
     * ```
     * 
     * Example Response (Unauthorized):
     * ```
     * {
     *     "error": "Unauthorized to remove the item"
     * }
     * ```
     * 
     * @lrd:end
     */

     public function removeFromWishlist($hostHomeId)
    {
        // Check if the authenticated user owns the HostHome in their wishlist
        $userId = auth()->id();
        
        // Retrieve the correct wishlist for the authenticated user and the specified host_home_id
        $wishlistItem = WishlistContainerItem::whereHas('wishlistcontainer', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })->where('host_home_id', $hostHomeId)->first();

        if ($wishlistItem) {
            // Remove the specific wishlist item associated with this HostHome
            $wishlistItem->delete();
            
            $cacheKey = "user_wishlist".auth()->id();
            $cacheKey2 = "userWishlistContainersAndItems{$userId}";
            $cacheKey3 = "userWishlistContainerItems{$userId}ContainerId{$wishlistItem->wishlistcontainer_id}";

            Cache::forget($cacheKey);
            Cache::forget($cacheKey2);
            Cache::forget($cacheKey3);
            return response("HostHome removed from the wishlist", 200);

        } else {
            return response("Item not found in the wishlist", 404);
        }
    }

    
    /**
     * @lrd:start
     * This is a get request and it is used to get users wishlistContainers
     * @lrd:end
     */
    public function getUserWishlistContainers()
    {
        
        $user = User::where('id', auth()->id())->firstOrFail();
        $cacheKey = "user_wishlist".auth()->id();
        return Cache::remember($cacheKey, now()->addWeek() ,function () use($user){
            $userWishlist = $user->wishlistcontainers()->distinct()->get();
            return response()->json(['userWishlist' => $userWishlist]);
        });
    }
    
    /**
     * @lrd:start
     * Get the user's wishlist containers and associated items.
     * This endpoint serves a GET request to retrieve the wishlist containers of the authenticated user.
     * Each wishlist container includes details about the container itself and its associated items.
     * @lrd:end
     */
    public function getUserWishlistContainersAndItems()
    {
        $user = User::where('id', auth()->id())->firstOrFail();
        $cacheKey = "userWishlistContainersAndItems{$user->id}";

        return Cache::remember($cacheKey, now()->addWeek() , function () use($user) {
            // Eager load wishlist containers with associated items and hosthomes
            $userWishlist = $user->wishlistcontainers()->with('items')->distinct()->get();

            // Transform the userWishlist to include hosthomes details without items
            $formattedWishlist = $userWishlist->map(function ($wishlistContainer) {
                return [
                    'wishlistContainer' => [
                        'id' => $wishlistContainer->id,
                        'user_id' => $wishlistContainer->user_id,
                        'name' => $wishlistContainer->name,
                        'created_at' => $wishlistContainer->created_at,
                        'updated_at' => $wishlistContainer->updated_at,
                    ],
                    'itemsLength' => count($wishlistContainer->items),
                    'items' => $wishlistContainer->items->map(function ($item) {
                        $hostHome = HostHome::find($item->host_home_id);
                        return [
                            'id' => $item->id,
                            'hosthomes' => [
                                'id' => $hostHome->id,
                                'hosthomephotos' => collect($hostHome->hosthomephotos)->map(function ($photo) {
                                    $photoData = json_decode($photo, true);
                                    return url($photoData['image']);
                                })->toArray(),
                            ],
                        ];
                    }),
                ];
            });

            return response()->json(['userWishlist' => $formattedWishlist]);
        });
    }
    
    /**
     * @lrd:start
     * Get all wishlist container items for a specific wishlist container.
     * @lrd:end
     */
    public function getWishlistContainerItems($wishlistContainerId)
    {
        $userId = auth()->id();
        $cacheKey = "userWishlistContainerItems{$userId}ContainerId{$wishlistContainerId}";
        return Cache::remember($cacheKey, now()->addWeek() , function() use($wishlistContainerId) {
            // Find the wishlist container
            $wishlistContainer = Wishlistcontainer::findOrFail($wishlistContainerId);

            // Retrieve all wishlist container items for the given wishlist container
            $wishlistContainerItems = $wishlistContainer->items;

            // Transform the wishlistContainerItems using the WishlistContainerItemResource
            $formattedItems = WishlistContainerItemResource::collection($wishlistContainerItems);

            return response()->json(['wishlistContainerItems' => $formattedItems]);
        });
        
    }


    /**
     * @lrd:start
     * 
     * Filter and retrieve host homes based on specified criteria.
     *
     * This method accepts a request containing filtering criteria such as address,
     * start and end dates  It then queries
     * the database to find host homes that match the criteria and returns the results.
     * 
     * @queryParam start_date string The start date of the desired booking period (Format: YYYY-MM-DD).
     * @queryParam end_date string The end date of the desired booking period (Format: YYYY-MM-DD).
     * `allow_pets` (string, optional): Specify whether pets are allowed or not. Accepted values: 'allow_pets' or 'no_pets'.
     * @param \App\Http\Requests\FilterHostHomesDatesRequest $request The incoming request with filtering criteria.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection A collection of filtered host homes.
     * 
     * @lrd:end
    */
    public function filterHostHomesDates(FilterHostHomesDatesRequest $request)
    {
        $data = $request->validated();

        // Define a unique cache key based on the request data
        $cacheKey = 'filtered_host_homes_dates_' . md5(json_encode($data));

        // Check if the data is already cached
        if (Cache::has($cacheKey)) {
            // If cached data exists, return it
            return Cache::get($cacheKey);
        }

        // If data is not cached, perform the filtering
        $address = $data['address'];
        $startDate = $data['start_date'];
        $endDate = $data['end_date'];
        $guests = $data['guests'];
        $allowPets = $data['allow_pets'];
        $per_page = $data['per_page'] ?? 10;

        $filteredHostHomes = HostHome::where('address', 'LIKE', "%{$address}%")
            ->whereDoesntHave('bookings', function ($query) use ($startDate, $endDate) {
                $query->where(function ($q) use ($startDate, $endDate) {
                    $q->whereBetween('check_in', [$startDate, $endDate])
                        ->orWhereBetween('check_out', [$startDate, $endDate])
                        ->orWhere(function ($q) use ($startDate, $endDate) {
                            $q->where('check_in', '<=', $startDate)
                                ->where('check_out', '>=', $endDate);
                        });
                });
            })
            ->where('guests', '>=', $guests)
            ->where('verified', 1)
            ->where('disapproved', null)
            ->whereNull('banned')
            ->whereNull('suspend');

        if ($allowPets === 'allow_pets') {
            $filteredHostHomes->whereDoesntHave('hosthomerules', function ($query) {
                $query->where('rule', 'No pets');
            });
        }

        $result = $filteredHostHomes->distinct()->paginate($per_page);

        // Cache the result with the defined cache key for future use
        Cache::put($cacheKey, $result, now()->addHours(1)); // Adjust cache expiry time as needed

        // Return the result
        return HostHomeResource::collection($result);
    }


    
    /**
     * @lrd:start
     * This is used to rename a wishlist container name
     * id is the id of UserWishlistContainer
     * @lrd:end
     * @LRDparam name use|required
     */
    public function editUserWishlistContainerName(Request $request,$id)
    {
        $data = $request->validate([
            'name' => 'required'
        ]);

        $user = User::where('id', auth()->id())->firstOrFail();
        if ($user) {
            $wishlistcontainer = Wishlistcontainer::where('id',$id)->where('user_id',auth()->id())->first();
            $wishlistcontainer->update([
                'name' => $data['name']
            ]);
        }
        return response()->json("Updated",200);
    }
    
    /**
     * @lrd:start
     * This is used to delete a user wishlist container 
     * id is the id of UserWishlistContainer
     * @lrd:end
     */
    public function deleteUserWishlistContainer($id)
    {
        $user = User::where('id', auth()->id())->firstOrFail();
        if ($user) {
            $wishlistcontainer = Wishlistcontainer::where('id',$id)->where('user_id',auth()->id())->first();
            $wishlistcontainer->items()->delete();
            $wishlistcontainer->delete();
        }
        return response()->json("Deleted",200);
    }
    
    
    /**
     * @lrd:start
     * This is a delete request and it is used to delete users wishlistContainers
     * @lrd:end
     */

    public function deleteUserWishlistContainers()
    {
        // Get the authenticated user
        $user = User::find(auth()->id());

        // Delete all wishlist containers and their items for the user
        if ($user) {
            // Use each to delete each container and its items
            $user->wishlistcontainers->each(function ($wishlistcontainer) {
                $wishlistcontainer->items()->delete();
                $wishlistcontainer->delete();
            });

            return response()->json(['message' => 'All wishlist containers and items deleted successfully']);
        }

        return response()->json(['message' => 'User not found'], 404);
    }
    
    
    /**
     * @lrd:start
     * Retrieve trips for the authenticated user.
    *
    * This endpoint allows an authenticated user to retrieve a list of their trips.
    *
    * @return \Illuminate\Http\Response
    * 
    * - 200: Successfully retrieved the user's trips.
    * - 404: User not found.
     * @lrd:end
     */
    public function userTrips()
    {
        $cacheKey = 'user_trips_' . auth()->id();
        $cacheDuration = 600; // Cache duration in seconds (10 minutes)
    
        $userTrips = Cache::remember($cacheKey, $cacheDuration, function () {
            // Get the authenticated user
            $user = User::find(auth()->id());
    
            if ($user) {
                return UserTripResource::collection(
                    UserTrip::where('user_id', $user->id)
                        ->distinct()
                        ->latest()
                        ->get()
                );
            }
    
            return null;
        });
    
        if ($userTrips) {
            return $userTrips;
        }
    
        return response()->json(['message' => 'User not found'], 404);
    }
    
    

    /**
     * @lrd:start
     * This is a post request and it is used to create a user card information as 
     * you can see it accept a value in the url this value is an authenticated user id
     * @lrd:end
     */
    public function createCard(StoreCreateUserCardRequest $request, $id)
    {
        $user =  User::where('id', $id)->first();
        $data = $request->validated();
        $cardtype = null;
        $cardNumber = $data['card_number'];
        if (CreditCardValidator::isMastercard($cardNumber)) {
            $cardtype = "Master";
        }elseif (CreditCardValidator::isVisa($cardNumber)) {
            $cardtype = "Visa";
        }elseif (strlen($cardNumber) >= 16 && Str::startsWith($cardNumber,'5')) {
            $cardtype = "Verve";
        }else {
            return response("Incorrect Card Number or Card Not Supported",422);
        }
        $userCard = new UserCard();
        $userCard->user_id = $user->id;
        $userCard->card_number = $cardNumber;
        $userCard->expiry_data = $data['expiry_data'];
        $userCard->CVV = $data['CVV'];
        $userCard->cardtype = $cardtype;
        $userCard->save();
        
        return response("OK",201);
    }
    
    /**
     * @lrd:start
     * Create a user's bank account information.
     *
     * This endpoint allows an authenticated user to create their bank account information.
     * 
     * @param \App\Http\Requests\StoreCreateUserBankAccountRequest $request The HTTP request containing the bank account information.
     * @param int $id The ID of the authenticated user.
     *
     * @return \Illuminate\Http\Response
     * 
     * - 201: Successfully created the user's bank account information.
     * 
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException If the user with the given ID is not found.
     * 
     * @lrd:end
     */
    public function createUserBankInfo(StoreCreateUserBankAccountRequest $request, $id)
    {
        try {
            // Retrieve the authenticated user
            $user = User::findOrFail($id);

            // Validate the request data
            $data = $request->validated();

            // Create and save the user's bank account information
            $userAccount = new Userbankinfo();
            $userAccount->user_id = $user->id;
            $userAccount->account_number = $data['account_number'];
            $userAccount->account_name = $data['account_name'];
            $userAccount->bank_name = $data['bank_name'];
            $userAccount->save();

            return response("OK", 201);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response("User not found", 404);
        }
    }


    /**
     * @lrd:start
     * Retrieve co-hosts associated with the authenticated host.
     *
     * This method retrieves co-hosts associated with the authenticated host and returns their unique details
     * including user ID, name, email, and profile picture.
     *
     * @return \Illuminate\Http\JsonResponse A JSON response containing details of co-hosts.
     * @lrd:end
     */
    public function hostcohosts()
    {
        // Get the authenticated host
        $host = User::find(auth()->id());

        $cohosts = $host->cohosts()->with('user')->get();

        // Filter out duplicate co-hosts based on email
        $uniqueCohosts = $cohosts->unique('user.email');

        // Transform the co-hosts data to the desired format
        $cohostData = $uniqueCohosts->map(function ($cohost) {
            return [
                'id' => $cohost->user->id,
                'name' => $cohost->user->name,
                'email' => $cohost->user->email,
                'profilePicture' => $cohost->user->profilePicture != null ? url($cohost->user->profilePicture) : null, // Assuming profile picture is stored in database
            ];
        });

        $cacheKey = "hostCohost{$host->id}";

        return Cache::remember($cacheKey, now()->addWeek(), function () use($cohostData) {
            return response()->json(['cohosts' => $cohostData ?? []], 200); 
        });
    }

    /**
     * @lrd:start
     * Delete a user's bank account information.
     *
     * This endpoint allows an authenticated user to delete their bank account information.
     *
     * @param int $userId The ID of the authenticated user.
     * @return \Illuminate\Http\Response
     *
     * - 204: Successfully deleted the user's bank account information.
     * - 404: User not found.
     * @lrd:end
    */
    public function deleteUserBankInfo($userId,$accountId)
    {
        try {
            // Retrieve the authenticated user
            $user = User::findOrFail($userId);

            // Find and delete the user's bank account information
            Userbankinfo::where('user_id', $user->id)
            ->where('id',$accountId)
            ->delete();

            return response("OK", 204);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response("User not found", 404);
        }
    }


    /**
     * @lrd:start
     * This is a get request and it is used to get users card
     * two values a value for the userCardId and a value in the url this value is an authenticated user id
     * @lrd:end
     */

    public function getUserCards($userid)
    {
        $user = User::where('id', $userid)->first();
            
        $userCard = UserCard::where('user_id', $user->id)->distinct()->get();

        return response([
            "data" => $userCard
        ],200);
    }


    /**
     * @lrd:start
     * Retrieve user's bank account information.
     *
     * This endpoint allows an authenticated user to retrieve their stored bank account information.
     * 
     * @param int $userid The ID of the authenticated user.
     *
     * @return \Illuminate\Http\Response
     * 
     * - 200: Successfully retrieved the user's bank account information.
     * - 404: User not found.
     * 
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException If the user with the given ID is not found.
     * 
     * @lrd:end
     */
    public function getUserBankInfos($userid)
    {
        try {
            // Retrieve the authenticated user
            $user = User::findOrFail($userid);
                
            // Retrieve the user's bank account information
            $userBankInfo = Userbankinfo::where('user_id', $user->id)->distinct()->get();

            return response([
                "data" => $userBankInfo
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response("User not found", 404);
        }
    }

    

    /**
     * @lrd:start
     * This is a get request and it is used to select a user card as you can see it accept 
     * two values a value for the userCardId and a value an authenticated user id
     * @lrd:end
     */
    public function selectCard($userCardId, $userid)
    {
        $user = User::where('id', $userid)->first();
        $userCard = UserCard::where('id', $userCardId)->first();

        if ($user && $userCard) {
            
            UserCard::where('user_id', $userid)->update(['Selected' => null]);

            $userCard->update([
                'Selected' => 'Selected'
            ]);
            return response("OK",200);
        }else {
            return response("This Card does not belong to this user.",403);
        }
    }

    /**
     * @lrd:start
     * Select a user's bank account information.
     *
     * This endpoint allows an authenticated user to select a specific bank account information from their stored options.
     * 
     * @param int $userbankinfoId The ID of the user bank account information to be selected.
     * @param int $userid The ID of the authenticated user.
     *
     * @return \Illuminate\Http\Response
     * 
     * - 200: Successfully selected the user's bank account information.
     * - 403: The specified bank account does not belong to the user.
     * 
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException If the user or bank account information with the given IDs is not found.
     * 
     * @lrd:end
     */
    public function selectBankInfo($userbankinfoId, $userid)
    {
        try {
            // Retrieve the authenticated user and user bank account information
            $user = User::findOrFail($userid);
            $userbankinfo = Userbankinfo::findOrFail($userbankinfoId);

            if ($user && $userbankinfo) {
                
                // Deselect all other bank account information for the user
                Userbankinfo::where('user_id', $userid)->update(['Selected' => null]);

                // Update the selected status for the specified bank account information
                $userbankinfo->update([
                    'Selected' => 'Selected'
                ]);

                return response("OK", 200);
            } else {
                return response("This bank account does not belong to this user.", 403);
            }
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response("User or bank account information not found", 404);
        }
    }

    /**
     * @lrd:start
     * This is to delete a user card as you can see it accept 
     * two values a value for the userCardId and a value an authenticated user id
     * @lrd:end
     */
    public function deleteUserCard($userCardId, $userid)
    {
        $user = User::where('id', $userid)->first();
        $userCard = UserCard::where('id', $userCardId)->first();

        if ($user && $userCard) {
            
            $usercardtodelete = UserCard::where('user_id', $userid);

            if ($usercardtodelete) {
                $userCard->delete();
            } else {
                return response("This Card does not belong to this user.",403);
            }
            
            return response("OK",200);
        }else {
            return response("This Card does not belong to this user.",403);
        }
    }
    
    /**
     * @lrd:start
     * This is a get request and it is used to deactivate an authenticated user
     * and delete his token if successful it should show 204
     * @lrd:end
     */
    public function deactivateAccount()
    {
        $user = Auth::user();

        if ($user) {
            /** @var User $user  */
            $currentAccessToken = $user->currentAccessToken();
            
            if ($currentAccessToken) {
                $currentAccessToken->delete();
            }

            // Deactivate the user's account
            $user->update([
                'is_active' => false,
            ]);

            $user->hosthomes()->delete();

            return response('', 204);
        }

        return response('User not found.', 404);
    }
    
    /**
     * @lrd:start
     * This is a put request and it is used to reactivate a user account
     * @lrd:end
     * @LRDparam email use|required
     */
    public function reactivateAccount(Request $request)
    {
        $user = User::where('email',$request->email)->first();

        if ($user) {
            
            Mail::to($user->email)->send(new ActivateAccount($user));
            
            return response('Mail sent',204);
        }else {
            return response('User not found.',422);
        }

    }

    /**
     * @lrd:start
     * Filters host homes based on specified criteria.
     * JSON response containing filtered host home data.
     * and if consumed will will return a 200 status code
     * @lrd:end
     */

     public function filterHomepage(FilterHomepageRequest $request)
    {
        try {
            $data = $request->validated();

            // Define a unique cache key based on the request data
            $cacheKey = 'filtered_host_homes_' . md5(json_encode($data));

            // Check if the data is already cached
            if (Cache::has($cacheKey)) {
                // If cached data exists, return it
                return Cache::get($cacheKey);
            }

            $propertyType = $data['property_type'];
            $minBedrooms = $data['bedrooms'];
            $minBeds = $data['beds'];
            $minBathrooms = $data['bathrooms'];
            $minPrice = $data['min_price'];
            $maxPrice = $data['max_price'];
            $amenities = $data['amenities'];
            $per_page = $data['per_page'] ?? 10;
    
            // Start with a base query for filtering host homes
            $query = HostHome::where('verified', 1)
                ->whereNull('disapproved')
                ->whereNull('banned')
                ->whereNull('suspend');
    
            // Additional filtering based on parameters
    
            if (!empty($propertyType) && is_array($propertyType)) {
                $query->whereIn('property_type', $propertyType);
            }
    
            // Check if "Any" is selected for Bedrooms and handle accordingly
            if (!empty($minBedrooms) && is_numeric($minBedrooms)) {
                $query->where('bedroom', '>=', $minBedrooms);
            }
    
            // Check if "Any" is selected for Beds and handle accordingly
            if (!empty($minBeds) && strtolower($minBeds) !== 'any' && is_numeric($minBeds)) {
                $query->where('beds', '>=', $minBeds);
            }
    
            // Check if "Any" is selected for Bathrooms and handle accordingly
            if (!empty($minBathrooms) && strtolower($minBathrooms) !== 'any' && is_numeric($minBathrooms)) {
                $query->where('bathrooms', '>=', $minBathrooms);
            }
    
            if (!empty($minPrice) && is_numeric($minPrice)) {
                $query->where('price', '>=', $minPrice);
            }
    
            if (!empty($maxPrice) && is_numeric($maxPrice)) {
                $query->where('price', '<=', $maxPrice);
            }
    
            if (!empty($amenities) && is_array($amenities)) {
                // Use whereHas to filter based on related offers
                $query->whereHas('hosthomeoffers', function ($q) use ($amenities) {
                    $q->whereIn('offer', $amenities);
                });
            }
    
            // Fetch the filtered results along with associated host home photos
            $result = $query->with('hosthomephotos')->distinct()->paginate($per_page);
    
            // Cache the result with the defined cache key for future use
            Cache::put($cacheKey, $result, now()->addHours(1));
            // Return the filtered data as JSON response
            return response()->json(['data' => HostHomeResource::collection($result)], 200);
        } catch (QueryException $e) {
            // Log the exception or handle it as needed
            return response()->json(['error' => 'An error occurred while processing your request.'], 500);
        } catch (\Exception $e) {
            // Log the exception or handle it as needed
            return response()->json(['error' => 'An unexpected error occurred.'], 500);
        }
    }
     
    
    public function filterHomepageLocation(FilterHomepageLocationRequest $request)
    {
        try {
            $data = $request->validated();
            $propertyType = $data['property_type'];
            $minBedrooms = $data['bedrooms'];
            $minBeds = $data['beds'];
            $minBathrooms = $data['bathrooms'];
            $minPrice = $data['min_price'];
            $maxPrice = $data['max_price'];
            $amenities = $data['amenities'];
            $per_page = $data['per_page'] ?? 10;

            $query = HostHome::where('verified', 1)
                            ->whereNull('disapproved')
                            ->whereNull('banned')
                            ->whereNull('suspend');

            if (!empty($propertyType) && is_array($propertyType)) {
                $query->whereIn('property_type', $propertyType);
            }

            if (!empty($minBedrooms) && is_numeric($minBedrooms)) {
                $query->where('bedroom', '>=', $minBedrooms);
            }

            if (!empty($minBeds) && is_numeric($minBeds)) {
                $query->where('beds', '>=', $minBeds);
            }

            if (!empty($minBathrooms) && is_numeric($minBathrooms)) {
                $query->where('bathrooms', '>=', $minBathrooms);
            }
            
            if (!empty($minPrice) && is_numeric($minPrice)) {
                $query->where('price', '>=', $minPrice);
            }
        
            if (!empty($maxPrice) && is_numeric($maxPrice)) {
                $query->where('price', '<=', $maxPrice);
            }

            if (!empty($amenities) && is_array($amenities)) {
                $query->whereHas('hosthomeoffers', function ($q) use ($amenities) {
                    $q->whereIn('offer', $amenities);
                });
            }

            $result = $query->with('hosthomephotos')->distinct()->paginate($per_page);

            return response()->json(['data' => HostHomeResource::collection($result)], 200);
        } catch (QueryException $e) {
            // Log the exception or handle it as needed
            return response()->json(['error' => 'An error occurred while processing your request.'], 500);
        } catch (\Exception $e) {
            // Log the exception or handle it as needed
            return response()->json(['error' => 'An unexpected error occurred.'], 500);
        }
    }

    
    /**
     * @lrd:start
     * Retrieve bookings for checking out.
     *
     * This endpoint allows a host to retrieve a list of bookings where guests are checking out.
     * Bookings are filtered based on the check_out date being greater than or equal to the present day,
     * successful payment status, the authenticated host's ID, and the check_out_time being greater than or equal to the current time.
     *
     * @return \Illuminate\Http\Response
     * 
     * - 200: Successfully retrieved the list of bookings for checking out.
     * 
     * @lrd:end
     */
    public function checkingOut()
    {
        $cacheKey = 'checking_out_' . auth()->id();
        $cacheDuration = 600; // Cache duration in seconds (10 minutes)

        $bookings = Cache::remember($cacheKey, $cacheDuration, function () {
            $hostId = null;

            $user = User::find(auth()->id());

            // If the authenticated user is a cohost, find the corresponding host
            if ($user->co_host) {
                $cohostOgHost = Hosthomecohost::where('user_id', $user->id)->first();
                $hostId = $cohostOgHost->host_id;
            } else {
                $hostId = $user->id;
            }

            // Get bookings for checking out
            $bookings = Booking::where('check_out', '=', Carbon::today()->toDateString())
                            ->where('paymentStatus', 'success')
                            ->where('hostId', $hostId)
                            ->where('check_out_time', '>=', Carbon::now()->format('g:i A'))
                            ->latest()
                            ->distinct()
                            ->get();
            
            return $bookings;
        });

        // Transform the bookings into the BookedResource
        $bookingsResource = BookedResource::collection($bookings);

        return response(['bookings' => $bookingsResource]);
    }



    /**
     * 
     * @lrd:start
     * Retrieve currently hosted bookings.
     *
     * This endpoint allows a host to retrieve a list of currently hosted bookings.
     * Bookings are filtered based on the check_out date being less than or equal to the present day,
     * the check_in date being greater than or equal to the present day,
     * successful payment status, the authenticated host's ID, and the check_out_time being less than or equal to the current time.
     *
     * @return \Illuminate\Http\Response
     * 
     * - 200: Successfully retrieved the list of currently hosted bookings.
     * 
     * 
     * @lrd:end
     */
    public function currentlyHosting()
    {
        $cacheKey = 'currently_hosting_' . auth()->id();
        $cacheDuration = 600; // Cache duration in seconds (10 minutes)

        $bookings = Cache::remember($cacheKey, $cacheDuration, function () {
            $now = Carbon::now();

            $hostId = null;

            $user = User::find(auth()->id());

            // If the authenticated user is a cohost, find the corresponding host
            if ($user->co_host) {
                $cohostOgHost = Hosthomecohost::where('user_id', $user->id)->first();
                $hostId = $cohostOgHost->host_id;
            } else {
                $hostId = $user->id;
            }

            $bookings = Booking::where('check_in', '<=', $now->toDateString())
                ->where('paymentStatus', 'success')
                ->where('hostId', $hostId)
                ->where(function ($query) use ($now) {
                    $query->where('check_out', '>', $now->toDateString()) // Check-out after today
                        ->orWhere(function ($innerQuery) use ($now) {
                            $innerQuery->where('check_out', '=', $now->toDateString()) // Check-out today
                                ->where('check_out_time', '>', $now->format('g:i A')); // Check-out time after current time
                        });
                })
                ->latest()
                ->distinct()
                ->get();

            return $bookings;
        });

        // Transform the bookings into the BookedResource
        $bookingsResource = BookedResource::collection($bookings);

        return response(['bookings' => $bookingsResource]);
    }




    /**
     * 
     * @lrd:start
     * Get earnings analysis for the host.
     *
     * This method retrieves earnings analysis for the currently hosted bookings of the authenticated host.
     * It considers bookings that have already checked in and have a payment status of 'success'.
     *
     * @return \Illuminate\Http\JsonResponse
     *
     * @response 200 {
     *     "bookings": [
     *         // Additional bookings details
     *     ]
     * }
     * 
     * @lrd:end
     */
    public function hostAnalysisEarnings()
    {
        // Get all hosted bookings (both paid and unpaid) using a join
        $bookings = Booking::where('paymentStatus', '=', 'success')
                        ->where('hostId', auth()->id())->distinct()->get();

        $cohostBookings = Hosthomecohost::where('user_id', auth()->id())->with('hosthome')->get()
        ->map(function ($cohost) {
            $cohostUser = HostHome::where('id', $cohost->host_home_id)->first();
            $cobookings = Booking::where('host_home_id', $cohostUser->id)
            ->where('paymentStatus', '=', 'success')
            ->distinct()->get();
            return $cobookings;
        })
        ->flatten();


        $allBookings = $bookings->merge($cohostBookings);


        $groupedSummedBookings = $allBookings->groupBy('host_home_id')->map(function ($bookings) {
            return $bookings->sum('hostBalance');
        });


        // Create a new collection with unique host_home_id and summed hostBalance
        $uniqueHostHomes = collect($groupedSummedBookings)->map(function ($summedBalance, $host_home_id) {
            return [
                'host_home_id' => $host_home_id,
                'summed_balance' => $summedBalance,
            ];
        });
        
        $bookingsResource = HostHomeEarningsResource::collection(
            $uniqueHostHomes->map(function ($item) {
                return new HostHomeEarningsResource(['host_home_id' => $item['host_home_id'], 'summed_balance' => $item['summed_balance']]);
            })
        );

        // Calculate total amount for paid bookings
        $totalAmountBookings = Booking::where('hostId', auth()->id())
            ->where('paymentStatus', '=', 'success')
            ->sum('hostBalance');

        $cohostTotalAmountBookings = Hosthomecohost::select(
            // No alias used
            DB::raw('SUM(bookings.hostBalance)')
            )
            ->join('bookings', function ($join) {
                $join->on('bookings.host_home_id', '=', 'hosthomecohosts.host_home_id')
                ->where('bookings.paymentStatus', '=', 'success');
            })
            ->where('hosthomecohosts.user_id', auth()->id())
            ->sum('bookings.hostBalance');

        
        $allTotals = $totalAmountBookings + $cohostTotalAmountBookings;

        // Calculate total amount for paid bookings
        $totalAmountPaidBookings = Booking::where('hostId', auth()->id())
            ->where('paymentStatus', '=', 'success')
            ->whereNotNull('paidHostStatus')
            ->sum('hostBalance');

        $cohostTotalAmountPaidBookings = Hosthomecohost::select(
            // No alias used
            DB::raw('SUM(bookings.hostBalance)')
            )
            ->join('bookings', function ($join) {
                $join->on('bookings.host_home_id', '=', 'hosthomecohosts.host_home_id')
                ->where('bookings.paymentStatus', '=', 'success')
                ->whereNotNull('paidHostStatus');
            })
            ->where('hosthomecohosts.user_id', auth()->id())
            ->sum('bookings.hostBalance');

        // Calculate total amount for paid bookings
        $totalAmountUnPaidBookings = Booking::where('hostId', auth()->id())
            ->where('paymentStatus', '=', 'success')
            ->whereNull('paidHostStatus')
            ->sum('hostBalance');

        $cohostTotalAmountUnPaidBookings = Hosthomecohost::select(
            // No alias used
            DB::raw('SUM(bookings.hostBalance)')
            )
            ->join('bookings', function ($join) {
                $join->on('bookings.host_home_id', '=', 'hosthomecohosts.host_home_id')
                ->where('bookings.paymentStatus', '=', 'success')
                ->whereNull('paidHostStatus');
            })
            ->where('hosthomecohosts.user_id', auth()->id())
            ->sum('bookings.hostBalance');

        $allPaid = $totalAmountPaidBookings + $cohostTotalAmountPaidBookings;
        $allUnPaid = $totalAmountUnPaidBookings + $cohostTotalAmountUnPaidBookings;

        $currentYear = now()->year;
        $monthlyEarnings = [];
    
        for ($month = 1; $month <= 12; $month++) {
            $startOfMonth = Carbon::createFromDate($currentYear, $month, 1)->startOfDay();
            $endOfMonth = $startOfMonth->copy()->endOfMonth();
    
            // Earnings for main host
            $earningsForMonth = $allBookings->filter(function ($booking) use ($startOfMonth, $endOfMonth) {
                return $booking->created_at >= $startOfMonth && $booking->created_at <= $endOfMonth;
            })->sum('hostBalance');
    
            // Earnings for cohosts
            $cohostEarningsForMonth = $cohostBookings->filter(function ($cobooking) use ($startOfMonth, $endOfMonth) {
                return $cobooking->created_at >= $startOfMonth && $cobooking->created_at <= $endOfMonth;
            })->sum('hostBalance');
    
            $totalEarningsForMonth = $earningsForMonth + $cohostEarningsForMonth;
    
            $monthlyEarnings[] = [
                'month' => $startOfMonth->format('F'),
                'earnings' => $totalEarningsForMonth,
            ];
        }

        // Add additional information to the response
        $response = [
            'graph' => $monthlyEarnings,
            'earnings' => $bookingsResource,
            'totalAmountAllBookings' => $allTotals,
            'totalAmountPaidBookings' => $allPaid,
            'totalAmountUnpaidBookings' => $allUnPaid,
        ];

        return response($response);
    }



    /**
     * @lrd:start
     * Get earnings analysis for the host by month and year.
     *
     * This method retrieves earnings analysis for the host based on new bookings
     * for the specified month and year with a payment status of 'success'.
     *
     * @param string $month The month in full (e.g., 'january').
     * @param int $year The year for which to retrieve earnings analysis.
     * @return \Illuminate\Http\JsonResponse
     *
     * @response 200 {
     *     "bookings": [
     *         // Additional bookings details
     *     ]
     * }
     *
     * @response 400 {
     *     "error": "Invalid month provided"
     * }
     * @lrd:end
    */
    public function hostAnalyticsEarningsByMonthYear($month, $year)
    {
        $hostId = auth()->id();

        // Validate the month input
        $validMonths = [
            'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'
        ];

        if (!in_array($month, $validMonths)) {
            return response()->json(['error' => 'Invalid month provided'], 400);
        }

        // Convert month name to numeric representation
        $numericMonth = date_parse($month)['month'];

        // Set the date to the first day of the specified month and year
        $startDate = Carbon::createFromDate($year, $numericMonth, 1)->startOfDay();

        // Set the date to the last day of the specified month and year
        $endDate = $startDate->copy()->endOfMonth();

        // Get all hosted bookings (both paid and unpaid) using a join for the specified month and year
        $bookings = Booking::where('hostId', $hostId)
            ->where('paymentStatus', 'success')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->distinct()
            ->get();

        $cohostBookings = Hosthomecohost::where('user_id', $hostId)
            ->with('hosthome')
            ->get()
            ->map(function ($cohost) use ($startDate, $endDate) {
                $cohostUser = HostHome::findOrFail($cohost->host_home_id);

                $cobookings = Booking::where('host_home_id', $cohostUser->id)
                    ->where('paymentStatus', 'success')
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->distinct()
                    ->get();

                return $cobookings;
            })
            ->flatten();

        $allBookings = $bookings->merge($cohostBookings);

        $groupedSummedBookings = $allBookings->groupBy('host_home_id')->map(function ($bookings) {
            return $bookings->sum('hostBalance');
        });

        // Create a new collection with unique host_home_id and summed hostBalance
        $uniqueHostHomes = collect($groupedSummedBookings)->map(function ($summedBalance, $host_home_id) {
            return [
                'host_home_id' => $host_home_id,
                'summed_balance' => $summedBalance,
            ];
        });

        $bookingsResource = HostHomeEarningsResource::collection(
            $uniqueHostHomes->map(function ($item) {
                return new HostHomeEarningsResource(['host_home_id' => $item['host_home_id'], 'summed_balance' => $item['summed_balance']]);
            })
        );

        // Calculate total amount for all bookings
        $totalAmountBookings = Booking::where('hostId', $hostId)
            ->where('paymentStatus', 'success')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('hostBalance');

        $cohostTotalAmountBookings = Hosthomecohost::select(
            // No alias used
            DB::raw('SUM(bookings.hostBalance)')
            )
            ->join('bookings', function ($join) use($startDate, $endDate){
                $join->on('bookings.host_home_id', '=', 'hosthomecohosts.host_home_id')
                ->where('bookings.paymentStatus', '=', 'success')
                ->whereBetween('bookings.created_at', [$startDate, $endDate]);
            })
            ->where('hosthomecohosts.user_id', auth()->id())
            ->sum('bookings.hostBalance');

        
        $allTotals = $totalAmountBookings + $cohostTotalAmountBookings;
        
        // Calculate total amount for paid bookings
        $totalAmountPaidBookings = Booking::where('hostId', auth()->id())
            ->where('paymentStatus', '=', 'success')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->whereNotNull('paidHostStatus')
            ->sum('hostBalance');

        $cohostTotalAmountPaidBookings = Hosthomecohost::select(
            // No alias used
            DB::raw('SUM(bookings.hostBalance)')
            )
            ->join('bookings', function ($join) use($startDate, $endDate){
                $join->on('bookings.host_home_id', '=', 'hosthomecohosts.host_home_id')
                ->where('bookings.paymentStatus', '=', 'success')
                ->whereNotNull('paidHostStatus')
                ->whereBetween('bookings.created_at', [$startDate, $endDate]);
            })
            ->where('hosthomecohosts.user_id', auth()->id())
            ->sum('bookings.hostBalance');

        // Calculate total amount for paid bookings
        $totalAmountUnPaidBookings = Booking::where('hostId', auth()->id())
            ->where('paymentStatus', '=', 'success')
            ->whereNull('paidHostStatus')
            ->sum('hostBalance');

        $cohostTotalAmountUnPaidBookings = Hosthomecohost::select(
            // No alias used
            DB::raw('SUM(bookings.hostBalance)')
            )
            ->join('bookings', function ($join) use($startDate, $endDate){
                $join->on('bookings.host_home_id', '=', 'hosthomecohosts.host_home_id')
                ->where('bookings.paymentStatus', '=', 'success')
                ->whereNull('paidHostStatus')
                ->whereBetween('bookings.created_at', [$startDate, $endDate]);
            })
            ->where('hosthomecohosts.user_id', auth()->id())
            ->sum('bookings.hostBalance');

        $allPaid = $totalAmountPaidBookings + $cohostTotalAmountPaidBookings;
        $allUnPaid = $totalAmountUnPaidBookings + $cohostTotalAmountUnPaidBookings;

        $currentYear = $year;
        $monthlyEarnings = [];
    
        for ($month = 1; $month <= 12; $month++) {
            $startOfMonth = Carbon::createFromDate($currentYear, $month, 1)->startOfDay();
            $endOfMonth = $startOfMonth->copy()->endOfMonth();
    
            // Earnings for main host
            $earningsForMonth = $allBookings->filter(function ($booking) use ($startOfMonth, $endOfMonth) {
                return $booking->created_at >= $startOfMonth && $booking->created_at <= $endOfMonth;
            })->sum('hostBalance');
    
            // Earnings for cohosts
            $cohostEarningsForMonth = $cohostBookings->filter(function ($cobooking) use ($startOfMonth, $endOfMonth) {
                return $cobooking->created_at >= $startOfMonth && $cobooking->created_at <= $endOfMonth;
            })->sum('hostBalance');
    
            $totalEarningsForMonth = $earningsForMonth + $cohostEarningsForMonth;
    
            $monthlyEarnings[] = [
                'month' => $startOfMonth->format('F'),
                'earnings' => $totalEarningsForMonth,
            ];
        }

        $response = [
            'graph' => $monthlyEarnings,
            'earnings' => $bookingsResource,
            'totalAmountAllBookings' => $allTotals,
            'totalAmountPaidBookings' => $allPaid,
            'totalAmountUnpaidBookings' => $allUnPaid,
        ];

        return response($response);
    }

    /**
     * @lrd:start 
     * Retrieve pending security deposits for successful bookings.
     * This method fetches all bookings with a null value for either securityDepositToGuest or securityDepositToHost and
     * paymentStatus set to 'success'. It compiles relevant information such as booking ID, security deposit, user name,
     * email, payment date, and status.
     * If the value of pauseSecurityDepositToGuest is not null, the status is set to 'Under Investigation';
     * otherwise, it is set to 'Pending'.
     * @return \Illuminate\Http\JsonResponse Returns a JSON response containing an array of pending security deposit information.
     * 
     * Implementation details:
     * Retrieve bookings where either securityDepositToGuest or securityDepositToHost is null and paymentStatus is 'success'.
     * Determine the status based on the value of pauseSecurityDepositToGuest.
     * Compile booking information including ID, security deposit, user name, email, and payment date.
     * @lrd:end
     */
    public function getPendingSecurityDeposits()
    {
        try {
            // Retrieve bookings with null security deposit and successful payment status
            $pendingBookings = Booking::where('paymentStatus', 'success')
                ->whereNotNull('checkOutNotification')
                ->whereNull('securityDepositToHostWallet')
                ->whereNull('addedToGuestWallet')
                ->latest()
                ->get();

            $result = [];

            // Iterate through each booking to extract and compile relevant information
            foreach ($pendingBookings as $booking) {
                // Find the associated user for the booking
                $user = User::find($booking->user_id);

                // Set the status based on the value of pauseSecurityDepositToGuest
                $status = $booking->pauseSecurityDepositToGuest ? 'Under Investigation' : 'Pending';

                // Add booking information to the result array
                $result[] = [
                    'id' => $booking->id,
                    'security_deposit' => $booking->securityDeposit,
                    'user_name' => $user->name,
                    'user_email' => $user->email,
                    'payment_date' => $booking->created_at->format('M j, Y'),
                    'status' => $status,
                ];
            }

            // Return the result as a JSON response
            return response()->json(['pending_security_deposits' => $result], 200);
        } catch (\Exception $e) {
            // Provide a response for other exceptions
            return response()->json([
                'message' => 'An error occurred while retrieving pending security deposits.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    /** 
     * @lrd:start 
     * Update the security deposit for a booking based on its ID.
     *
     * @param  int  $bookingId
     * @param  float  $newSecurityDeposit
     * @lrd:end
    */
    public function updateSecurityDepositById($bookingId, $newSecurityDeposit)
    {
        // Find the booking by ID
        $booking = Booking::find($bookingId);

        // Check if the booking exists
        if ($booking) {
            // Update the security deposit
            $booking->update(['securityDeposit' => $newSecurityDeposit]);

            // Return a success response
            return response(['message' => 'Security deposit updated successfully'], 200);
        } else {
            // Return an error response if the booking is not found
            return response(['error' => 'Booking not found'], 404);
        }
    }

    /**
     * @lrd:start
     * Retrieve bookings arriving soon.
     *
     * This endpoint allows a host to retrieve a list of bookings for the same day and before the check_in_time.
     * Bookings are filtered based on the check_in date being the present day,
     * successful payment status, the authenticated host's ID, and the check_in_time from the related HostHome model being greater than the current time.
     *
     * @return \Illuminate\Http\Response
     * 
     * - 200: Successfully retrieved the list of bookings arriving soon. 1:30 1:00
     * @lrd:end
     */
    public function arrivingSoon()
    {
        $cacheKey = 'arriving_soon_' . auth()->id();
        $cacheDuration = 600; // Cache duration in seconds (10 minutes)

        $bookings = Cache::remember($cacheKey, $cacheDuration, function () {
            $hostId = null;

            $user = User::find(auth()->id());

            // If the authenticated user is a cohost, find the corresponding host
            if ($user->co_host) {
                $cohostOgHost = Hosthomecohost::where('user_id', $user->id)->first();
                $hostId = $cohostOgHost->host_id;
            } else {
                $hostId = $user->id;
            }

            $bookings = Booking::whereDate('check_in', Carbon::today()->toDateString())
                        ->where('paymentStatus', 'success')
                        ->where('hostId', $hostId)
                        ->where('check_in_time', '>', Carbon::now()->format('g:i A'))
                        ->latest()
                        ->distinct()
                        ->get();
            
            return $bookings;
        });

        $bookingsResource = BookedResource::collection($bookings);

        return response(['bookings' => $bookingsResource]);
    }


    /**
     * @lrd:start
     * Retrieve upcoming reservations.
     * This endpoint allows a host to retrieve a list of upcoming reservations.
     * Reservations are filtered based on the check_in date being before or on the present day,
     * successful payment status, the authenticated host's ID, and the check_in_time from the related HostHome model
     * being less than the current time.
     *
     * @return \Illuminate\Http\Response
     * 
     * - 200: Successfully retrieved the list of upcoming reservations.
     * 
     * @lrd:end
     */
    public function upcomingReservation()
    {
        $cacheKey = 'upcoming_reservations_' . auth()->id();
        $cacheDuration = 600;

        $bookings = Cache::remember($cacheKey, $cacheDuration, function () {
            $hostId = null;

            $user = User::find(auth()->id());

            if ($user->co_host) {
                $cohostOgHost = Hosthomecohost::where('user_id', $user->id)->first();
                $hostId = $cohostOgHost->host_id;
            } else {
                $hostId = $user->id;
            }

            $bookings = Booking::whereDate('check_in', '>', Carbon::today())
                ->whereDate('check_in', '<=', Carbon::today()->addDays(3))
                ->where('paymentStatus', 'success')
                ->where('hostId', $hostId)
                ->latest()
                ->distinct()
                ->get();

            return $bookings;
        });

        // Transform the bookings into the BookedResource
        $bookingsResource = BookedResource::collection($bookings);

        return response(['bookings' => $bookingsResource]);
    }


    /**
     * @lrd:start
     * Retrieve all reservations.
     * This endpoint allows a host to retrieve a list of all reservations.
     *
     * @return \Illuminate\Http\Response
     * 
     * - 200: Successfully retrieved the list of all reservations.
     * 
     * @lrd:end
     */
    public function allReservation()
    {
        $hostId = null;

        $user = User::find(auth()->id());

        $cacheKey = "allHostReservation{$user->id}";
        return Cache::remember($cacheKey, now()->addWeek(), function() use($user, $hostId) {

            // If the authenticated user is a cohost, find the corresponding host
            if ($user->co_host) {
                $cohostOgHost = Hosthomecohost::where('user_id', $user->id)->first();
                $hostId = $cohostOgHost->host_id;
            } else {
                $hostId = $user->id;
            }
    
            // Get upcoming reservations for the authenticated user (host)
            $hostBookings = Booking::whereNotNull('paymentStatus')
                ->where('hostId', $hostId)
                ->latest()
                ->distinct()->get();
    
            $bookingsResource = AllReservationsResource::collection($hostBookings);
    
            return response(['bookings' => $bookingsResource]);

        });
    }




    /**
     * @lrd:start
     *  Retrieve all host info and reviews for a user(guests) to see.
     *
     * This endpoint fetches information about host homes and their reviews for a specific user.
     *
     * @lrd:end
     */
    public function hostReview($id)
    {
        $user = User::find($id);

        $hostId = $user->id;

        $cohost = Hosthomecohost::where('user_id',$hostId)->first();

        if ($cohost) {
            $hostId = $cohost->host_id;
        }

        $host = User::find(intval($hostId));

        $cacheKey = "hostReview{$hostId}";
        return Cache::remember($cacheKey, now()->addWeek() ,function() use($host) {
            return new HostHomeHostInfoResource($host);
        });
        
    }

    /**
     * @lrd:start
     *  Retrieve all guest info and reviews for a user(host) to see.
     *
     * This endpoint fetches information about host homes and their reviews for a specific user.
     *
     * @lrd:end
     */
    public function guestReview($id)
    {
        $user = User::find($id);
        return new GuestReviewsResource($user);
    }

    public function destroy(User $user)
    {
        $user->forceDelete();
        $user->hosthomes()->forceDelete();
    }

    /**
     * @lrd:start
     * 
     * Create a new payment request.
     * 
     * @lrd:end
     */
    public function requestPay(RequestPayRequest $request)
    {
        try {
            $data = $request->validated();

            // Convert the amount to an integer
            $amount = (int)$data['amount'];

            $user = User::findOrFail(auth()->id());

            if ($user->co_host) {
                abort(400, "Cohosts cant make pay requests");
            }

            // Check if the requested amount is negative
            if ($amount < 0) {
                return response()->json(['message' => 'Requested amount cannot be negative.'], 400);
            }
            
            // Check if the user has a pending payment request
            $existingRequest = UserRequestPay::where('user_id', auth()->id())
                ->whereNull('approvedStatus')
                ->first();

            if ($existingRequest) {
                return response()->json(['message' => 'You already have a pending payment request.'], 400);
            }

            // Check if the requested amount exceeds the user's total balance
            $userBalance = UserWallet::where('user_id', auth()->id())->value('totalbalance');

            if ($amount > $userBalance) {
                return response()->json(['message' => 'Requested amount exceeds your total balance.'], 400);
            }

            // Create a new payment request
            $paymentRequest = new UserRequestPay();
            $paymentRequest->user_id = auth()->id();
            $paymentRequest->account_number = $data['account_number'];
            $paymentRequest->account_name = $data['account_name'];
            $paymentRequest->amount = $amount;
            $paymentRequest->bank_name = $data['bank_name'];
            $paymentRequest->save();

            
            $title = "Withdrawal Requested";
            $message = "You have requested a pay of " . $amount . " from your account";
            Mail::to($user->email)->send(new NotificationMail($user,$message,$title));

            $admins = User::whereNotNull('adminStatus')->get();
            RequestPay::dispatch($admins);

            return response()->json(['message' => 'Payment request submitted successfully.']);
        } catch (\Exception $e) {
            // Provide a response for other exceptions
            return response()->json([
                'message' => 'An error occurred while processing the payment request.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * @lrd:start
     * 
     * Cancels and deletes payment request if it hasnt been approved and within 24 hrs.
     * 
     * @lrd:end
     */
    public function cancelPayRequest($requestId)
    {
        try {
            $request = UserRequestPay::findOrFail($requestId);

            // Check if the request belongs to the authenticated user
            if ($request->user_id !== auth()->id()) {
                return response()->json(['message' => 'You are not authorized to cancel this request.'], 403);
            }

            // Check if the request has already been approved
            if ($request->approvedStatus === 'approved') {
                return response()->json(['message' => 'This payment request has already been approved and cannot be canceled.'], 400);
            }

            // Check if the request is older than 24 hours
            $createdAt = Carbon::parse($request->created_at);
            $now = Carbon::now();

            if ($now->diffInHours($createdAt) >= 24) {
                return response()->json(['message' => 'This payment request cannot be canceled as it has exceeded 24 hours since it was created.'], 400);
            }

            // If all conditions are met, delete the request
            $request->delete();

            return response()->json(['message' => 'Payment request canceled successfully.']);
        } catch (\Exception $e) {
            // Provide a response for other exceptions
            return response()->json([
                'message' => 'An error occurred while canceling the payment request.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * View user's wallet and total balance.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function viewUserWallet()
    {
        try {
            // Retrieve the authenticated user's wallet
            $userId = auth()->id();
            $userWallet = UserWallet::where('user_id', $userId)->first();

            if (!$userWallet) {
                return response()->json(['message' => 'Wallet not found for the user.'], 404);
            }

            return response()->json([
                'total_balance' => $userWallet->totalbalance,
            ]);
        } catch (\Exception $e) {
            // Provide a response for other exceptions
            return response()->json([
                'message' => 'An error occurred while retrieving user wallet.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * @lrd:start
     * Get payment records for the authenticated user.
     *
     * @lrd:end
     */
    public function getUserPaymentRecords()
    {
        try {
            $userId = auth()->id();

            // Retrieve payment records for the user
            $paymentRecords = UserRequestPay::where('user_id', $userId)->get();

            return response()->json(['payment_records' => $paymentRecords]);
        } catch (\Exception $e) {
            // Provide a response for other exceptions
            return response()->json([
                'message' => 'An error occurred while retrieving payment records.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
