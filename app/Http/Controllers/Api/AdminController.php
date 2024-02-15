<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AllBookingsResource;
use App\Http\Resources\AllReviewssResource;
use App\Http\Resources\CancelTripsResource;
use App\Http\Resources\GuestsResource;
use App\Mail\NotificationMail;
use App\Models\Booking;
use App\Models\Canceltrip;
use App\Models\HostHome;
use App\Models\Review;
use App\Models\User;
use App\Models\Visitor;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;

class AdminController extends Controller
{

    
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
            Canceltrip::all()
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
     * this gets all the bookings that has been checked out for the admin
     * @lrd:end
     */
    public function receivablePayable() {

        $bookings = Booking::where('paymentStatus', 'success')
        
        ->get();

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
            $user->profilePicture = URL::to($user->profilePicture);
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
            ->groupBy('hostId')
            ->count();

        // Count the total number of unique guests with successful bookings
        $guestsCount = Booking::select([
            'user_id',
            DB::raw('COUNT(DISTINCT user_id) as total_guests_count'),
        ])
            ->where('paymentStatus', '=', 'success')
            ->groupBy('user_id')
            ->count();

        // Sum of total amounts from successful bookings
        $totalAmount = Booking::where('paymentStatus', '=', 'success')->sum('totalamount');

        // Count the total number of confirmed bookings
        $confirmBookings = Booking::where('paymentStatus', '=', 'success')->count();

        // Count the total number of verified homes
        $verifiedHomesCount = HostHome::where('verified', 1)->count();

        // Count the total number of visitors
        $visitors = Visitor::find(1);

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
            'visitors' => $visitors->views ?? 0,
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
        Mail::to($user->email)->send(new NotificationMail($user,$data['message'], $title));
        
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
        Mail::to($user->email)->send(new NotificationMail($user, $data['message'], $title));

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
        Mail::to($user->email)->send(new NotificationMail($user, $data['message'], $title));

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
        Mail::to($user->email)->send(new NotificationMail($user,$data['message'], $title));
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
                Mail::to($user->email)->send(new NotificationMail($user,$data['message'], $title));

            }
            return response("Ok",200);
        } 

        elseif($userType == "Guest" || $userType == "All") {
            $users = User::all();
            foreach($users as $user){
                $title = "A message for every one";
                Mail::to($user->email)->send(new NotificationMail($user,$data['message'], $title));
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
