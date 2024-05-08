<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AssignRolesToAdminRequest;
use App\Http\Requests\SignupRequest;
use App\Http\Resources\AllBookingsResource;
use App\Http\Resources\AllReviewssResource;
use App\Http\Resources\CancelTripsResource;
use App\Http\Resources\GuestsResource;
use App\Mail\NotificationMail;
use App\Models\Adminrole;
use App\Models\Booking;
use App\Models\Canceltrip;
use App\Models\HostHome;
use App\Models\Review;
use App\Models\Servicecharge;
use App\Models\User;
use App\Models\UserRequestPay;
use App\Models\UserWallet;
use App\Models\Visitor;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
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
                ->get(['id', 'user_id', 'account_number', 'account_name', 'amount', 'bank_name']);

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

            $title = "Payment successful";
            $message = "Your requested a pay of " . $deductedAmount . " from your account has been successfully sent to your bank account ";
            Mail::to($user->email)->send(new NotificationMail($user,$message,$title));

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
     * @lrd:end
     */
    public function guests() {

        return GuestsResource::collection(
            User::all()
        );

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
     * this gets all the bookings that has been checked out for the admin
     * @lrd:end
     */
    public function checkedOutBookings() {

        // Get the current date and time
        $now = Carbon::now();

        $checkedOutBookings = Booking::where('check_out', '>=', $now->toDateString())
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
     * @lrd:end
     */
    public function hosts() {
        $users = User::where('host', 1)->get();
    
        $responseData = [];
        foreach ($users as $user) {
            $user->profilePicture = $user->profilePicture != null ? URL::to($user->profilePicture) : null;
            $verifiedHomesCount = $user->hosthomes()->where('verified', 1)->count();
            $responseData[] = ['user' => $user, 'verified_homes_count' => $verifiedHomesCount];
        }
    
        return response()->json(['data' => $responseData]);
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
            ->orWhere('updated_at',$today)
            ->where('verified', '!=', 1)
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
     * accept the value of a user id and message send an object that contains message which is the message you want to send a user
     * send this as object message use|required
     * @lrd:end
     * @LRDparam message use|required
     */
    public function banGuest(Request $request, $id) {

        $data = $request->validate([
            "message" => "required"
        ]);

        $user = User::where('id', $id)->first();
        $title = "Your account has been banned from this company";
        Mail::to($user->email)->send(new NotificationMail($user,$data['message'], $title));
        
        $user->update([
            "banned" => "banned"
        ]);

        $user->hosthomes()->update([
            "banned" => "banned"
        ]);

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

        $users = User::all();
        foreach($users as $user){
            $title = "A message for every one";
            $message = "The service charges and guest service charge has been updated they are now $request->guest_services_charge% and $request->host_services_charge% of every booking 
            and vat is now $request->tax%";
            Mail::to($user->email)->queue(new NotificationMail($user,$message, $title));
        }

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
     * @lrd:end
     * @LRDparam message use|required
     */

    public function suspendGuest(Request $request, $id) {

        $data = $request->validate([
            "message" => "required"
        ]);

        $user = User::where('id', $id)->first();
        $title = "Your account has been suspended for 30 days";
        Mail::to($user->email)->queue(new NotificationMail($user,$data['message'], $title));
        
        $user->update([
            "suspend" => "suspend"
        ]);

        $user->hosthomes()->update([
            "suspend" => "suspend"
        ]);
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
        Mail::to($user->email)->queue(new NotificationMail($user, $data['message'], $title));

        $user->update([
            "banned" => null
        ]);

        $user->hosthomes()->update([
            "banned" => null
        ]);

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
        Mail::to($user->email)->queue(new NotificationMail($user, $data['message'], $title));

        $user->update([
            "suspend" => null
        ]);

        $user->hosthomes()->update([
            "suspend" => null
        ]);

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
        $title = "Your account has been terminated";
        Mail::to($user->email)->queue(new NotificationMail($user,$data['message'], $title));
        $user->forceDelete();
        $user->hosthomes()->forceDelete();
        return response("Ok",200); 
    }
    
    /**
     * @lrd:start
     * this is used to Send an email to guest and host and all
     * usertype hould be Host || Guest || All
     * @lrd:end
     * @LRDparam message use|required
     * @LRDparam usertype use|required
     */
    public function sendEmail(Request $request) {

        $data = $request->validate([ 
            "usertype" => "required",
            "message" => "required"
        ]);

        $userType = $data['usertype'];
        
        if ($userType == "Host") {
            $users = User::where('host', 1)->get();
            foreach($users as $user){

                $title = "A message for every host";
                Mail::to($user->email)->queue(new NotificationMail($user,$data['message'], $title));

            }
            return response("Ok",200);
        } 

        elseif($userType == "Guest" || $userType == "All") {
            $users = User::all();
            foreach($users as $user){
                if ($user->is_guest == null) {
                    $title = "A message for every one";
                    Mail::to($user->email)->queue(new NotificationMail($user,$data['message'], $title));
                }
            }
            return response("Ok",200);
        }
        
        else {
            return response([
                'error' => $data
            ],422);
        }
        
    }


    
}
