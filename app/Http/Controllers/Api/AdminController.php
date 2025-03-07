<?php

namespace App\Http\Controllers\Api;

use App\Events\NewNotificationEvent;
use App\Http\Controllers\Controller;
use App\Http\Requests\AssignRolesToAdminRequest;
use App\Http\Requests\SignupRequest;
use App\Http\Requests\StoreSocialMediaLink;
use App\Http\Resources\AllBookingsResource;
use App\Http\Resources\AllReviewssResource;
use App\Http\Resources\CancelTripsResource;
use App\Http\Resources\GuestsResource;
use App\Jobs\PushNotification;
use App\Mail\AccountNotice;
use App\Mail\AdminToUsers;
use App\Mail\NotificationMail;
use App\Mail\PaymentRequestApproved;
use App\Mail\RevisedServiceCharges;
use App\Models\Adminrole;
use App\Models\Booking;
use App\Models\Canceltrip;
use App\Models\Cohost;
use App\Models\HostHome;
use App\Models\Notification;
use App\Models\Review;
use App\Models\Servicecharge;
use App\Models\SocialMedia;
use App\Models\User;
use App\Models\UserRequestPay;
use App\Models\UserWallet;
use App\Models\Visitor;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{

    /**
     * @lrd:start
     * View all payment requests awaiting approval.
     * @lrd:end
     */
    public function viewRequestsToApprove()
    {
        try {
            $paymentRequests = UserRequestPay::whereNull('approvedStatus')
                ->with('user:id,name,email')
                ->latest()
                ->get(['id', 'user_id', 'account_number', 'account_name', 'amount', 'bank_name','created_at']);

            return response()->json(['payment_requests' => $paymentRequests]);
        } catch (\Exception $e) {
            // Provide a response for other exceptions
            return response()->json([
                'message' => 'An error occurred while retrieving payment requests.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * @lrd:start
     * Approve a payment request.
     *
     * @param  int  $requestId
     * @lrd:end
     */
    public function approvePaymentRequest($requestId)
    {
        try {
            // Find the payment request
            $paymentRequest = UserRequestPay::findOrFail($requestId);

            // Update the approved status
            $paymentRequest->approvedStatus = 'approved';
            $paymentRequest->save();

            // Deduct the approved amount from the user's total balance
            $userId = $paymentRequest->user_id;
            $deductedAmount = $paymentRequest->amount;

            $userWallet = UserWallet::where('user_id', $userId)->first();
            $userWallet->totalbalance -= $deductedAmount;
            $userWallet->save();

            $user = User::find($userId);

            $title = "Payment successfully made";
            $notification = new Notification();
            $notification->user_id = $user->id;  
            $notification->Message = $title;
            $notification->save();
            
            event(new NewNotificationEvent($notification, $notification->id, $user->id));
            
            $formatedDate = $userWallet->updated_at->format('M j, Y h:ia');
            
            $deviceToken = $user->device_token;

            if ($deviceToken) {

                PushNotification::dispatch("Shrbo",$title,$deviceToken);

            }

            Mail::to($user->email)->queue(
                (new PaymentRequestApproved($user,$deductedAmount,$title,$formatedDate))->onQueue('emails')
            );

            return response()->json(['message' => 'Payment request approved successfully.']);
        } catch (\Exception $e) {
            // Provide a response for other exceptions
            return response()->json([
                'message' => 'An error occurred while approving the payment request.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    
    /**
     * @lrd:start
     * this gets all the registered users 
     * 
     * and use the query parameter per_page to determine the number of record needed ?per_page=(Number of record needed)
     * @lrd:end
     * 
     * @LRDparam per_page use|required |numeric to set how many items you want to get per page.
     * @LRDparam page use|optional|numeric Specifies the current page for pagination.
     */
    public function guests(Request $request)
    {
        // Set a default value for the number of items per page
        $perPage = $request->input('per_page', 10);

        $currentPage = $request->input('page', 1);

        // Generate a cache key based on the request parameters
        $cacheKey = 'guests_for_admin_' . $perPage. "page{$currentPage}";

        
        return Cache::remember($cacheKey, now()->addHour(), function () use ($perPage) {
            // Fetch the data with relationships

            return GuestsResource::collection(
                User::paginate($perPage)
            )->response()->getData(true);
        });

    }
    
    /**
     * @lrd:start
     * this gets all the cancelledTrips for the admin
     * @lrd:end
     */
    public function cancelledTrips() {

        return CancelTripsResource::collection(
            Canceltrip::latest()->get()
        );
 
    }
    

    /**
     * @lrd:start
     * this gets all the reviews for the admin
     * @lrd:end
     */
    public function getReviews() {

        return AllReviewssResource::collection(
            Review::all()
        );

    }
    

    /**
     * @lrd:start
     * Create a new admin user.
     *
     * This method creates a new admin user based on the provided data.
     * 
     * @return \Illuminate\Http\Response A response indicating the success of user creation.
     * @lrd:end
     */
    public function createAdmin(SignupRequest $request) {

        $data = $request->validated(); 
        
        $now = Carbon::now();

        $user = new User();
        $user->name = $data['name'];
        $user->email = $data['email'];
        $user->password = bcrypt($data['password']);
        $user->adminStatus = strtolower($data['role']);
        $user->verified = "Verified";
        $user->email_verified_at = $now;
        $user->remember_token = Str::random(40);
        $user->save();

        return response("User created successfully",201);

    }

    /**
     * @lrd:start
     * Update the admin status of a user.
     *
     * This method updates the admin status of a user based on the provided data.
     *
     * @param \Illuminate\Http\Request $request The HTTP request containing the updated admin status.
     * @param int $userId The ID of the user to update.
     * 
     * @return \Illuminate\Http\Response A response indicating the success of the admin status update.
     * @lrd:end
    */
    public function updateAdminStatus(Request $request, $userId)
    {
        $data = $request->validate([
            'adminStatus' => ['required', 'string', Rule::in(['admin', 'super admin'])],
        ]);

        try {
            // Find the user by ID
            $user = User::findOrFail($userId);

            // Update the admin status
            $user->update(['adminStatus' => strtolower($data['adminStatus'])]);

            return response("Admin status updated successfully", 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response("User not found", 404);
        }
    }

    
    /**
     * @lrd:start
     * 
     * This deletes an admin if the entered user id is correct
     *
     * @param \Illuminate\Http\Request $request
     * @param int $userid User Id
     * 
     * @lrd:end
    */
    public function deleteAdmin($userid)
    {
        $user = User::findOrFail($userid);
        $user->forceDelete();
        $user->hosthomes()->forceDelete();
    }
    
    /**
     * @lrd:start
     * Remove admin status from a user.
     *
     * This method removes the admin status for a user based on the provided user ID.
     *
     * @param int $userId The ID of the user to remove admin status from.
     * @return \Illuminate\Http\Response A response indicating the success of admin status removal.
     * @lrd:end
    */
    public function removeAdminStatus($userId)
    {
        // Find the user by ID
        $user = User::findOrFail($userId);

        // Check if the user exists
        if (!$user) {
            abort(404, "User not found");
        }

        // Remove admin status
        $user->adminStatus = null;
        $user->save();

        // Return success response
        return response("Admin status removed successfully", 200);
    }

    
    /**
     * @lrd:start
     * Get all users with admin or super admin status.
     * @lrd:end
     */
    public function getAllAdminUsers()
    {
        // Assuming 'admin' and 'super admin' are the values for adminStatus
        $adminUsers = User::whereIn('adminStatus', ['admin', 'super admin'])
            ->get(['id', 'name', 'adminStatus']);

        // Fetch admin roles for each admin user
        $adminUsersWithRoles = $adminUsers->map(function ($user) {
            $adminRoles = AdminRole::where('user_id', $user->id)->get(['rolePermission']);
            return $user->toArray() + ['adminRoles' => $adminRoles];
        });

        return response(['adminUsers' => $adminUsersWithRoles], 200);
    }
    
    /**
     * @lrd:start
     * Assign roles to an admin user based on provided permissions.
     *
     * This method takes a validated request containing a list of permissions and assigns
     * each permission to the specified admin user. The assigned roles are created using
     * the createAdminRoles method.
     *
     * @param  AssignRolesToAdminRequest $request The validated request containing permissions.
     * @param  int                      $userid  The ID of the admin user to assign roles.
     * @lrd:end
    */
    public function assignRolesToAdmin(AssignRolesToAdminRequest $request,$userid)
    {
        $data = $request->validated();

        $permissions = $data['permission'];

        foreach ($permissions as $permission) {
            $permissionData = ['rolePermission' => $permission, 'user_id' => $userid];
            $this->createAdminRoles($permissionData);
        }

        $cacheKey = "user_info_{$userid}";

        Cache::forget($cacheKey);

        return response("Done");
    }

    
    private function createAdminRoles($data)
    {
        // Validate the input data
        $validator = Validator::make($data, [
            'rolePermission' => 'string',
            'user_id' => 'exists:App\Models\User,id'
        ]);

        // Check for validation errors
        if ($validator->fails()) {
            // Handle validation errors, you can return a response or throw an exception
            return response(['error' => $validator->errors()], 422);
        }

        $data2 = $validator->validated();

        return Adminrole::create($data2);
        
    }

    /**
     * @lrd:start
     * Unassign roles from an admin user.
     *
     * This method takes a validated request containing a list of permissions and
     * unassigns each specified permission from the admin user.
     *
     * @param  UnassignRolesFromAdminRequest $request The validated request containing permissions to unassign.
     * @param  int                          $userId  The ID of the admin user to unassign roles.
     * @return \Illuminate\Http\Response A response indicating the success of roles unassignment.
     * @lrd:end
     * @LRDparam permission use|required
     */
    public function unassignRolesFromAdmin(Request $request, $userId)
    {
        $data = $request->validate([
            'permission' => 'required'
        ]);

        $permission = $data['permission'];

        Adminrole::where('user_id', $userId)
            ->where('rolePermission', $permission)
            ->delete();

        
        $cacheKey = "user_info_{$userId}";

        Cache::forget($cacheKey);

        return response("Roles unassigned successfully", 200);
    }

    /**
     * @lrd:start
     * this gets all the bookings that has not been checked out for the admin
     * @lrd:end
     */
    public function bookings() {

        // Get the current date and time
        $now = Carbon::now();
        $activeReservations = Booking::where(function ($query) use ($now) {
            $query->where('check_in', '<=', $now->toDateString()) // Check if check_in is on or before the current date
                ->orWhere(function ($subquery) use ($now) {
                    $subquery->where('check_in', '=', $now->toDateString()) // Check if check_in is on the current date
                        ->where('check_out_time', '>', $now->toTimeString()); // Check if check_out_time is after the current time
                });
        })
        ->where('check_out', '>', $now->toDateString()) // Check if check_out is after the current date
        ->where('paymentStatus', 'success')
        ->get();

        return AllBookingsResource::collection(
            $activeReservations
        );

    }
    /**
     * @lrd:start
     * this gets all the new bookings the admin
     * @lrd:end
     */
    public function newBookings() {

        // Get the current date and time
        $today = Carbon::today();
        $activeReservations = Booking::where('paymentStatus', 'success')
        ->whereDate('created_at', $today)
        ->get();

        return AllBookingsResource::collection(
            $activeReservations
        );

    }
    
    
    /**
     * @lrd:start
     * this is to create social media link and store them
     * @lrd:end
     */
    public function createSocialMediaLink(StoreSocialMediaLink $request) {

        $data = $request->validated();
        
        $socialLinks = [];
        $socialLinks['instagram_url'] = $data['instagram_url'];
        $socialLinks['twitter_url'] = $data['twitter_url'];
        $socialLinks['facebook_url'] = $data['facebook_url'];
        SocialMedia::updateOrCreate([], $socialLinks);
        $cacheKey = "socialLinks";
        Cache::forget( $cacheKey );
        return response("Links Saved", 200);

    }
    
    
    /**
     * @lrd:start
     * this is to return social media links
     * @lrd:end
     */
    public function returnSocialMediaLink() {

        $cacheKey = "socialLinks";

        return Cache::remember($cacheKey, 60, function () {
            return SocialMedia::all();
        });

    }
    
    
    /**
     * @lrd:start
     * this gets all the bookings that has been checked out for the admin
     * @lrd:end
     */
    public function checkedOutBookings() {

        // Get the current date and time
        $now = Carbon::now();

        $checkedOutBookings = Booking::whereNotNull('checkOutNotification')
            ->where('paymentStatus', 'success')
            ->get();

        return AllBookingsResource::collection($checkedOutBookings);


    }
    
    
    /**
     * @lrd:start
     * Get receivable and payable information for the admin.
     *
     * This method retrieves details such as Date, paymentId, Host Email, Total Amount,
     * Guest Service Charge, Host Service Charge, Net Profit, and Amount to Host for all
     * bookings that have been checked out and have a successful payment status.
     * @lrd:end
     */
    public function receivablePayable() {

        $bookings = Booking::where('paymentStatus', 'success')
        ->whereNull('paidHostStatus')
        ->get();

        // Prepare the data for response
        $responseData = $bookings->map(function ($booking) {
            return [
                'Date' => $booking->created_at->format('Y-m-d H:i:s'),
                'paymentId' => $booking->paymentId,
                'hostEmail' => optional(User::find($booking->hostId))->email,
                'totalAmount' => $booking->totalamount,
                'guestServiceCharge' => $booking->guest_service_charge,
                'hostServiceCharge' => $booking->host_service_charge,
                'netProfit' => $booking->profit,
                'amountToHost' => $booking->hostBalance,
            ];
        });

        // Return the response
        return response()->json(['data' => $responseData], 200);
    }
    
    /**
     * @lrd:start
     * Get details of paid payments for the admin.
     *
     * This method retrieves details such as paymentId, Host Email, status, paidHostdate,
     * and Amount to Host for all bookings with a successful payment status and a paid host status.
     *
     * @return \Illuminate\Http\JsonResponse
     * @lrd:end
    */
    public function paidPayments() {

        $userpays = UserRequestPay::whereNotNull('approvedStatus')->latest()->get();

        // Prepare the data for response
        $responseData = $userpays->map(function ($userpay) {
            return [
                'id' => $userpay->id,
                'userEmail' => User::find($userpay->user_id)->email,
                'userName' => User::find($userpay->user_id)->name,
                'status' => "Paid",
                'user_id' => $userpay->user_id,
                'account_number' => $userpay->account_number,
                'bank_name' => $userpay->bank_name,
                'account_name' => $userpay->account_name,
                'paiddate' => $userpay->created_at->format('M j, Y h:ia'),
                'amountPaid' => $userpay->amount,
            ];
        });

        // Return the response
        return response()->json(['data' => $responseData], 200);
    }
    
    
    /**
     * @lrd:start
     * this gets all the hosts
     * 
     * and use the query parameter per_page to determine the number of record needed ?per_page=(Number of record needed)
     * @lrd:end
     * 
     * @LRDparam per_page use|required |numeric to set how many items you want to get per page.
     * @LRDparam page use|optional|numeric Specifies the current page for pagination.
     */
    public function hosts(Request $request)
    {
        // Set a default value for the number of items per page
        $perPage = $request->input('per_page', 10);

        $currentPage = $request->input('page', 1);

        // Generate a cache key based on the request parameters
        $cacheKey = 'hosts_for_admin_' . $perPage. "page{$currentPage}";

        
        return Cache::remember($cacheKey, now()->addHour(), function () use ($perPage) {
            // Fetch the data with relationships

            $users = User::where('host', 1)->get();
        
            $responseData = [];
            foreach ($users as $user) {
                $user->profilePicture = $user->profilePicture != null ? URL::to($user->profilePicture) : null;
                $verifiedHomesCount = $user->hosthomes()->where('verified', 1)->count();
                $responseData[] = ['user' => $user, 'verified_homes_count' => $verifiedHomesCount];
            }
        
            return response()->json(['data' => $responseData]);
        });
    }
    

    /**
     * @lrd:start
     * Admin Analytical Dashboard.
     * This method provides analytical data for the admin dashboard.
     * @lrd:end
     */
    public function adminAnalytical() {
        // Count the total number of hosts
        $hosts = User::where('host', 1)->count();

        // Count the total number of guests
        $guests = User::count();

        // Count the total number of unique hosts with successful bookings
        $hostsCount = Booking::select([
            'hostId',
            DB::raw('COUNT(DISTINCT hostId) as total_hosts_count'),
        ])
            ->where('paymentStatus', '=', 'success')
            ->count();

        // Count the total number of unique guests with successful bookings
        $guestsCount = Booking::select([
            'user_id',
            DB::raw('COUNT(DISTINCT user_id) as total_guests_count'),
        ])
            ->where('paymentStatus', '=', 'success')
            ->count();

        // Sum of total amounts from successful bookings
        $totalAmount = Booking::where('paymentStatus', '=', 'success')->sum('totalamount');

        // Count the total number of confirmed bookings
        $confirmBookings = Booking::where('paymentStatus', '=', 'success')->count();

        // Count the total number of verified homes
        $verifiedHomesCount = HostHome::where('verified', 1)->count();

        // Count the total number of visitors
        $visitors = Visitor::all()->sum('views');

        // Get the current date
        $today = Carbon::now()->toDateString();

        // Count the total number of unapproved homes created today
        $unApprovedHomesCount = HostHome::whereDate('created_at', $today)
            ->where('verified', 0)
            ->whereNull('disapproved')
            ->whereNull('banned')
            ->whereNull('suspend')
            ->count();

        // Count the total number of users created today
        $userCountForPresentDay = User::whereDate('created_at', $today)->count();

        // Count the total number of unverified users created today
        $unVerifiedUserForPresentDay = User::whereDate('created_at', $today)
            ->where('verified', '!=', 'Verified')
            ->count();

        // Get the current date and time
        $now = Carbon::now();

        // Count the total number of active reservations
        $activeReservationsCount = Booking::where(function ($query) use ($now) {
            $query->where('check_in', '<=', $now->toDateString()) // Check if check_in is on or before the current date
                ->orWhere(function ($subquery) use ($now) {
                    $subquery->where('check_in', '=', $now->toDateString()) // Check if check_in is on the current date
                        ->where('check_out_time', '>', $now->toTimeString()); // Check if check_out_time is after the current time
                });
        })
        ->where('check_out', '>', $now->toDateString()) // Check if check_out is after the current date
        ->where('paymentStatus', 'success') // Optional: If you want to consider only successful bookings
        ->count();

        $activeReservations = Booking::where(function ($query) use ($now) {
            $query->where('check_in', '<=', $now->toDateString()) // Check if check_in is on or before the current date
                ->orWhere(function ($subquery) use ($now) {
                    $subquery->where('check_in', '=', $now->toDateString()) // Check if check_in is on the current date
                        ->where('check_out_time', '>', $now->toTimeString()); // Check if check_out_time is after the current time
                });
        })
        ->where('check_out', '>', $now->toDateString()) // Check if check_out is after the current date
        ->where('paymentStatus', 'success')
        ->get();

        $reservationData = [];

        foreach ($activeReservations as $activeReservation) {
            $hosthome = HostHome::find(intval($activeReservation['host_home_id']));
            $user = User::find(intval($activeReservation['user_id']));
            $reservationData[] = [
                "bookingId" => $activeReservation["id"],
                "guestName" => $user["name"],
                "homeTitle" => $hosthome->title,
                "status" => "Booked",
                'check_in' => Carbon::createFromFormat('Y-m-d', $activeReservation->check_in)->format('F j, Y'),
                'check_out' => Carbon::createFromFormat('Y-m-d', $activeReservation->check_out)->format('F j, Y'),
            ];
        }

        // Response data array
        $responseData = [
            'no_of_guests' => $guests ?? 0,
            'no_of_hosts' => $hosts ?? 0,
            'active_hosts' => $hostsCount ?? 0,
            'active_guests' => $guestsCount ?? 0,
            'propertyListings' => $verifiedHomesCount ?? 0,
            'revenue' => $totalAmount ?? 0,
            'visitors' => $visitors ?? 0,
            'userCountForPresentDay' => $userCountForPresentDay ?? 0,
            'unVerifiedUserForPresentDay' => $unVerifiedUserForPresentDay ?? 0,
            'unApprovedHomesCount' => $unApprovedHomesCount ?? 0,
            'confirmBookings' => $confirmBookings ?? 0,
            'activeReservationsCount' => $activeReservationsCount ?? 0,
            'reservationData' => $reservationData ?? [],
        ];

        // Return JSON response
        return response()->json(['data' => $responseData]);
    }
    

    /**
     * @lrd:start
     * Admin Analytical Dashboard.
     * This method provides analytical data for the admin dashboard.
     * @param string $range Filter range ('today', 'this_week', 'this_month', 'this_year', 'all_time')
     * @lrd:end
     */
    public function filterAnalyticalData($range = 'all_time') {
        $now = Carbon::now();
        $startDate = null;
        $endDate = null;
    
        switch ($range) {
            case 'today':
                $startDate = $now->startOfDay()->toDateTimeString();
                $endDate = $now->endOfDay()->toDateTimeString();
                break;
            case 'this_week':
                $startDate = $now->startOfWeek()->toDateTimeString();
                $endDate = $now->endOfWeek()->toDateTimeString();
                break;
            case 'this_month':
                $startDate = $now->startOfMonth()->toDateTimeString();
                $endDate = $now->endOfMonth()->toDateTimeString();
                break;
            case 'this_year':
                $startDate = $now->startOfYear()->toDateTimeString();
                $endDate = $now->endOfYear()->toDateTimeString();
                break;
            case 'all_time':
                // Set a distant past date as the start date for 'all_time'
                $startDate = '1900-01-01 00:00:00';
                $endDate = $now->endOfDay()->toDateTimeString();
                break;
        }
    
        info($startDate . " " . $endDate);

        $realnow = Carbon::now();
        // Count the total number of unapproved homes created based on date range
        $unApprovedHomesCount = HostHome::whereBetween('created_at', [$startDate, $endDate])
            ->orWhereBetween('updated_at', [$startDate, $endDate])
            ->where('verified', '!=', 1)
            ->count();
    
        // Count the total number of users created based on date range
        $userCountForPresentDay = User::whereBetween('created_at', [$startDate, $endDate])
            ->count();
    
        // Count the total number of unverified users created based on date range
        $unVerifiedUserForPresentDay = User::whereBetween('created_at', [$startDate, $endDate])
            ->where('verified', '!=', 'Verified')
            ->count();
    
        // Count the total number of active reservations based on date range
        $activeReservationsCount = Booking::where(function ($query) use ($realnow) {
            $query->where('check_in', '<=', $realnow->toDateString()) // Check if check_in is on or before the current date
                ->orWhere(function ($subquery) use ($realnow) {
                    $subquery->where('check_in', '=', $realnow->toDateString()) // Check if check_in is on the current date
                        ->where('check_out_time', '>', $realnow->toTimeString()); // Check if check_out_time is after the current time
                });
        })
        ->where('check_out', '>', $realnow->toDateString()) // Check if check_out is after the current date
        ->where('paymentStatus', 'success')
        ->whereBetween('created_at', [$startDate, $endDate])
        ->count();

        // Fetch active reservations based on date range
        $activeReservations = Booking::where(function ($query) use ($realnow) {
            $query->where('check_in', '<=', $realnow->toDateString()) // Check if check_in is on or before the current date
                ->orWhere(function ($subquery) use ($realnow) {
                    $subquery->where('check_in', '=', $realnow->toDateString()) // Check if check_in is on the current date
                        ->where('check_out_time', '>', $realnow->toTimeString()); // Check if check_out_time is after the current time
                });
        })
        ->where('check_out', '>', $realnow->toDateString()) // Check if check_out is after the current date
        ->where('paymentStatus', 'success')
        ->whereBetween('created_at', [$startDate, $endDate])
        ->get();

        $reservationData = [];

        foreach ($activeReservations as $activeReservation) {
        $hosthome = HostHome::find(intval($activeReservation['host_home_id']));
        $user = User::find(intval($activeReservation['user_id']));
        $reservationData[] = [
            "bookingId" => $activeReservation["id"],
            "guestName" => $user["name"],
            "homeTitle" => $hosthome->title,
            "status" => "Booked",
            'check_in' => Carbon::createFromFormat('Y-m-d', $activeReservation->check_in)->format('F j, Y'),
            'check_out' => Carbon::createFromFormat('Y-m-d', $activeReservation->check_out)->format('F j, Y'),
        ];
        }

    
        // Count the total number of hosts based on date range
        $hosts = User::where('host', 1)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();
    
        // Count the total number of guests based on date range
        $guests = User::whereBetween('created_at', [$startDate, $endDate])
            ->count();
    
        // Count the total number of unique hosts with successful bookings based on date range
        $hostsCount = Booking::select([
            'hostId',
            DB::raw('COUNT(DISTINCT hostId) as total_hosts_count'),
        ])
            ->where('paymentStatus', '=', 'success')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('hostId')
            ->count();
    
        // Count the total number of unique guests with successful bookings based on date range
        $guestsCount = Booking::select([
            'user_id',
            DB::raw('COUNT(DISTINCT user_id) as total_guests_count'),
        ])
            ->where('paymentStatus', '=', 'success')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('user_id')
            ->count();
    
        // Sum of total amounts from successful bookings based on date range
        $totalAmount = Booking::where('paymentStatus', '=', 'success')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('totalamount');
    
        // Count the total number of confirmed bookings based on date range
        $confirmBookings = Booking::where('paymentStatus', '=', 'success')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();
    
        // Count the total number of verified homes based on date range
        $verifiedHomesCount = HostHome::where('verified', 1)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();
    
        // Count the total number of visitors based on date range
        $visitors = Visitor::whereBetween('created_at', [$startDate, $endDate])
        ->sum('views');
    
        // Response data array
        $responseData = [
            'no_of_guests' => $guests ?? 0,
            'no_of_hosts' => $hosts ?? 0,
            'active_hosts' => $hostsCount ?? 0,
            'active_guests' => $guestsCount ?? 0,
            'propertyListings' => $verifiedHomesCount ?? 0,
            'revenue' => $totalAmount ?? 0,
            'visitors' => $visitors ?? 0,
            'userCountForPresentDay' => $userCountForPresentDay ?? 0,
            'unVerifiedUserForPresentDay' => $unVerifiedUserForPresentDay ?? 0,
            'unApprovedHomesCount' => $unApprovedHomesCount ?? 0,
            'confirmBookings' => $confirmBookings ?? 0,
            'activeReservationsCount' => $activeReservationsCount ?? 0,
            'reservationData' => $reservationData ?? [],
        ];
    
        // Return JSON response
        return response()->json(['data' => $responseData]);
    }
    
    
    
    
    /**
     * @lrd:start
     * 
     * Accepts the value of a user ID and a message. Sends an object that contains 
     * the message you want to send to a user.
     * The user cannot be banned if they are currently hosting or staying in an 
     * apartment based on their active bookings.
     * 
     * @lrd:end
     * @LRDparam message use|required
     */
    public function banGuest(Request $request, $id) {

        $data = $request->validate([
            "message" => "required"
        ]);

        $user = User::where('id', $id)->first();

        $currentDateTime = Carbon::now();
    
        // Check if the user is currently hosting
        $isHosting = Booking::where('hostId', $user->id)
            ->where('paymentStatus', 'success')
            ->where('check_in', '<=', $currentDateTime->format('Y-m-d'))
            ->where('check_out', '>=', $currentDateTime->format('Y-m-d'))
            ->exists();
    
            
        // Check if the user is currently staying
        $isStaying = Booking::where('user_id', $user->id)
            ->where('paymentStatus', 'success')
            ->where('check_in', '<=', $currentDateTime->format('Y-m-d'))
            ->where('check_out', '>=', $currentDateTime->format('Y-m-d'))
            ->exists();
    
        // Check for any upcoming bookings
        $upcomingBookings = Booking::where(function($query) use ($user, $currentDateTime) {
            $query->where('hostId', $user->id)
                  ->orWhere('user_id', $user->id);
        })
            ->where('paymentStatus', 'success')
            ->where('check_in', '>', $currentDateTime->format('Y-m-d'))
            ->exists();
    
        if ($isHosting || $isStaying || $upcomingBookings) {
            return response()->json([
                'message' => 'This user cannot be banned because they have active or upcoming bookings. Please wait until all bookings are completed.'
            ], 403);
        }

        $title = "Your account has been banned from shrbo";
        $viewToUse = 'emails.accountBanned';
        $formatedDate = now()->format('M j, Y h:ia');

        
        $deviceToken = $user->device_token;

        if ($deviceToken) {

            PushNotification::dispatch($title,$data['message'],$deviceToken);

        }

        Mail::to($user->email)->queue(
            (new AccountNotice($user,$data['message'], $title, $formatedDate,$viewToUse))->onQueue('emails')
        );
        
        $user->update([
            "banned" => "banned"
        ]);

        $user->hosthomes()->update([
            "banned" => "banned"
        ]);

        // Retrieve the cohosts linked to the user as a host
        $cohosts = Cohost::where('host_id', $user->id)->get();

        foreach ($cohosts as $cohost) {
            $cohostUser = $cohost->user;

            if ($cohostUser) {
                // Update the banned status of the cohost's user
                $cohostUser->update([
                    "banned" => "banned"
                ]);

                // Send the ban notification email to the cohost's user
                Mail::to($cohostUser->email)->queue(
                    (new AccountNotice($cohostUser, $data['message'], $title, $formatedDate, $viewToUse))->onQueue('emails')
                );
            }
        }

        Cache::flush();
        return response("Ok",200);
    }
    
    /**
     * @lrd:start
     * Update service charges.
     *
     * This method updates the guest and host service charges.
     *
     * @lrd:end
     * @LRDparam guest_services_charge use|required
     * @LRDparam host_services_charge use|required
     * @LRDparam tax use|required
     */
    public function updateServiceCharges(Request $request)
    {
        $request->validate([
            'guest_services_charge' => 'required|numeric',
            'host_services_charge' => 'required|numeric',
            'tax' => 'required|numeric',
        ]);
        
        // Divide the values by 100 before storing
        $guestCharge = $request->guest_services_charge / 100;
        $hostCharge = $request->host_services_charge / 100;
        $tax = $request->tax / 100;

        // Update or create the service charge record
        ServiceCharge::updateOrCreate(
            ['id' => 1], // Assuming the ID is 1 for the single record
            [
                'guest_services_charge' => $guestCharge,
                'host_services_charge' => $hostCharge,
                'tax' => $tax,
            ]
        );

        
        $formatedDate = now()->format('M j, Y h:ia');
        User::chunk(100, function ($users) use ($request, $formatedDate) {
            foreach ($users as $user) {
                $title = "A message for everyone";
                
                $fullMessage = "Hello " . $user->name . "! Our service charges have been updated to: Guest Services: " . 
                $request->guest_services_charge . "%, Host Services: " . $request->host_services_charge . 
                "%, Tax: " . $request->tax . "%. Effective " . $formatedDate;
                $deviceToken = $user->device_token;

                if ($deviceToken) {

                    PushNotification::dispatch($title,$fullMessage,$deviceToken);

                }
                Mail::to($user->email)->queue(
                    (new RevisedServiceCharges(
                        $user, 
                        $title, 
                        $request->guest_services_charge, 
                        $request->host_services_charge, 
                        $request->tax, 
                        $formatedDate
                    ))->onQueue('emails')
                );
            }
        });
        

        $this->clearAllCache();
        return response()->json(['message' => 'Service charges updated successfully']);
    }

    
    public function clearAllCache()
    {
        Cache::flush();
    }

    /**
     * @lrd:start
     * 
     * Get service charges.
     *
     * This method retrieves the guest and host service charges.
     *
     * @lrd:end
     */
    public function getServiceCharges()
    {
        // Retrieve the service charges (assuming there's only one row)
        $serviceCharges = Servicecharge::first();

        return response()->json(['data' => $serviceCharges]);
    }
    
    /**
     * @lrd:start
     * accept the value of a user id and message send an object that contains message which is the message you want to send a user
     * send this as object message use|required
     * 
     * The user cannot be suspended if they are currently hosting or staying in an 
     * apartment based on their active bookings.
     * 
     * @lrd:end
     * @LRDparam message use|required
    */
    public function suspendGuest(Request $request, $id) {

        $data = $request->validate([
            "message" => "required"
        ]);

        $user = User::where('id', $id)->first();

        $currentDateTime = Carbon::now();
    
        // Check if the user is currently hosting
        $isHosting = Booking::where('hostId', $user->id)
            ->where('paymentStatus', 'success')
            ->where('check_in', '<=', $currentDateTime->format('Y-m-d'))
            ->where('check_out', '>=', $currentDateTime->format('Y-m-d'))
            ->exists();
    
        // Check if the user is currently staying
        $isStaying = Booking::where('user_id', $user->id)
            ->where('paymentStatus', 'success')
            ->where('check_in', '<=', $currentDateTime->format('Y-m-d'))
            ->where('check_out', '>=', $currentDateTime->format('Y-m-d'))
            ->exists();
    
        // Check for any upcoming bookings
        $upcomingBookings = Booking::where(function($query) use ($user, $currentDateTime) {
            $query->where('hostId', $user->id)
                  ->orWhere('user_id', $user->id);
        })
            ->where('paymentStatus', 'success')
            ->where('check_in', '>', $currentDateTime->format('Y-m-d'))
            ->exists();
    
        if ($isHosting || $isStaying || $upcomingBookings) {
            return response()->json([
                'message' => 'This user cannot be suspended because they have active or upcoming bookings. Please wait until all bookings are completed.'
            ], 403);
        }

        $title = "Your account has been suspended from shrbo";
        
        $formatedDate = now()->format('M j, Y h:ia');
        $viewToUse = 'emails.accountSuspension';
        $deviceToken = $user->device_token;

        if ($deviceToken) {

            PushNotification::dispatch($title,$data['message'],$deviceToken);

        }
        
        Mail::to($user->email)->queue(
            (new AccountNotice($user,$data['message'], $title, $formatedDate,$viewToUse))->onQueue('emails')
        );
        
        $user->update([
            "suspend" => "suspend"
        ]);

        $user->hosthomes()->update([
            "suspend" => "suspend"
        ]);

        $cohosts = Cohost::where('host_id', $user->id)->get();

        foreach ($cohosts as $cohost) {
            $cohostUser = $cohost->user;

            if ($cohostUser) {
                // Update the banned status of the cohost's user
                $cohostUser->update([
                    "suspend" => "suspend"
                ]);

                // Send the ban notification email to the cohost's user
                Mail::to($cohostUser->email)->queue(
                    (new AccountNotice($cohostUser, $data['message'], $title, $formatedDate, $viewToUse))->onQueue('emails')
                );
            }
        }
        Cache::flush();
        return response("Ok",200);
    }
    
    /**
     * @lrd:start
     * Accept the value of a user id and message. Send an object that contains a message, which is the message you want to send to the user.
     * Send this as object message use|required
     * @lrd:end
     * @LRDparam message use|required
     */
    public function unbanGuest(Request $request, $id) {

        $data = $request->validate([
            "message" => "required"
        ]);

        $user = User::where('id', $id)->first();
        $title = "Your account has been unbanned";
        
        $viewToUse = 'emails.accountUnbanned';
        $formatedDate = now()->format('M j, Y h:ia');
        $deviceToken = $user->device_token;

        if ($deviceToken) {

            PushNotification::dispatch($title,$data['message'],$deviceToken);

        }

        Mail::to($user->email)->queue(
            (new AccountNotice($user,$data['message'], $title, $formatedDate,$viewToUse))->onQueue('emails')
        );
        $user->update([
            "banned" => null
        ]);

        $user->hosthomes()->update([
            "banned" => null
        ]);

        // Retrieve the cohosts linked to the user as a host
        $cohosts = Cohost::where('host_id', $user->id)->get();

        foreach ($cohosts as $cohost) {
            $cohostUser = $cohost->user;

            if ($cohostUser) {
                // Update the banned status of the cohost's user
                $cohostUser->update([
                    "banned" => null
                ]);

                // Send the ban notification email to the cohost's user
                Mail::to($cohostUser->email)->queue(
                    (new AccountNotice($cohostUser, $data['message'], $title, $formatedDate, $viewToUse))->onQueue('emails')
                );
            }
        }

        Cache::flush();
        return response("Ok", 200);
    }

    /**
     * @lrd:start
     * Accept the value of a user id and message. Send an object that contains a message, which is the message you want to send to the user.
     * Send this as object message use|required
     * @lrd:end
     * @LRDparam message use|required
     */
    public function unsuspendGuest(Request $request, $id) {

        $data = $request->validate([
            "message" => "required"
        ]);

        $user = User::where('id', $id)->first();
        $title = "Your account has been unsuspended";
        
        $viewToUse = 'emails.accountUnbanned';
        $formatedDate = now()->format('M j, Y h:ia');

        $deviceToken = $user->device_token;

        if ($deviceToken) {

            PushNotification::dispatch($title,$data['message'],$deviceToken);

        }
        Mail::to($user->email)->queue(
            (new AccountNotice($user,$data['message'], $title, $formatedDate,$viewToUse))->onQueue('emails')
        );
        
        $user->update([
            "suspend" => null
        ]);

        $user->hosthomes()->update([
            "suspend" => null
        ]);

        Cache::flush();
        return response("Ok", 200);
    }

    
    /**
     * @lrd:start
     * accept the value of a user id and message send an object that contains message which is the message you want to send a user
     * send this as object message use|required
     * @lrd:end
     * @LRDparam message use|required
     */
    public function deleteGuest(Request $request, $id) {
        $data = $request->validate([
            "message" => "required"
        ]);
    
        $user = User::where('id', $id)->first();
    
        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }
        
        $currentDateTime = Carbon::now();
    
        // Check if the user is currently hosting
        $isHosting = Booking::where('hostId', $user->id)
            ->where('paymentStatus', 'success')
            ->where('check_in', '<=', $currentDateTime->format('Y-m-d'))
            ->where('check_out', '>=', $currentDateTime->format('Y-m-d'))
            ->exists();
    
        // Check if the user is currently staying
        $isStaying = Booking::where('user_id', $user->id)
            ->where('paymentStatus', 'success')
            ->where('check_in', '<=', $currentDateTime->format('Y-m-d'))
            ->where('check_out', '>=', $currentDateTime->format('Y-m-d'))
            ->exists();
    
        // Check for any upcoming bookings
        $upcomingBookings = Booking::where(function($query) use ($user, $currentDateTime) {
            $query->where('hostId', $user->id)
                  ->orWhere('user_id', $user->id);
        })
            ->where('paymentStatus', 'success')
            ->where('check_in', '>', $currentDateTime->format('Y-m-d'))
            ->exists();
    
        if ($isHosting || $isStaying || $upcomingBookings) {
            return response()->json([
                'message' => 'This user cannot be deleted because they have active or upcoming bookings. Please wait until all bookings are completed.'
            ], 403);
        }
    
        // Check for any unresolved financial transactions
        $pendingBookings = Booking::where(function($query) use ($user) {
            $query->where('hostId', $user->id)
                  ->orWhere('user_id', $user->id);
        })
            ->where('paymentStatus', 'success')
            ->where(function ($query) {
                $query->whereNull('addedToHostWallet')
                      ->orWhereNull('addedToGuestWallet')
                      ->orWhereNotNull('pauseSecurityDepositToGuest');
            })
            ->exists();
    
        if ($pendingBookings) {
            return response()->json([
                'message' => 'This user cannot be deleted because they have pending financial transactions. Please resolve all payments first.'
            ], 403);
        }
    
        $title = "Your account has been terminated";
        $formatedDate = now()->format('M j, Y h:ia');
        $viewToUse = 'emails.accountDeletion';
        
        $deviceToken = $user->device_token;

        if ($deviceToken) {

            PushNotification::dispatch($title,$data['message'],$deviceToken);

        }
        
        Mail::to($user->email)->queue(
            (new AccountNotice($user, $data['message'], $title, $formatedDate, $viewToUse))->onQueue('emails')
        );
    
        $user->hosthomes()->forceDelete();
        $user->forceDelete();
        Cache::flush();
        
        return response("Ok", 200); 
    }

    /**
     * @lrd:start
     * this is used to Send an email to guest and host and all
     * usertype hould be Host || Guest || All
     * @lrd:end
     * @LRDparam message use|required
     * @LRDparam usertype use|required
     */
    public function sendEmail(Request $request) 
    {
        $data = $request->validate([
            "usertype" => "required",
            "message" => "required"
        ]);

        $userType = $data['usertype'];
        $title = "";

        // Define a closure to send emails, to avoid code repetition
        $sendEmails = function($users) use ($data, &$title) {
            foreach ($users as $user) {
                Mail::to($user->email)->queue(
                    (new AdminToUsers($user, $data['message'], $title))->onQueue('emails')
                );
            }
        };

        // Handling different user types
        if ($userType == "Host") {
            $title = "A message for every host";
            
            // Process hosts in chunks
            User::where('host', 1)->chunk(100, function($users) use ($sendEmails) {
                $sendEmails($users);
            });
            
            return response("Ok", 200);
        } 
        elseif ($userType == "Guest" || $userType == "All") {
            $title = "A message for every guest";

            // Process guests in chunks
            User::where('is_guest', null)->chunk(100, function($users) use ($sendEmails) {
                $sendEmails($users);
            });

            return response("Ok", 200);
        } else {
            return response([
                'error' => 'Invalid user type'
            ], 422);
        }
    }



    
}
