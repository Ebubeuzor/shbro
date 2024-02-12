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
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\Request;
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
     * this gets all the bookings for the admin
     * @lrd:end
     */
    public function bookings() {

        return AllBookingsResource::collection(
            Booking::where('paymentStatus','success')->get()
        );

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
