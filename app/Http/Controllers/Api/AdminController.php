<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\GuestsResource;
use App\Mail\NotificationMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

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
     * this gets all the hosts
     * @lrd:end
     */
    public function hosts() {

        $user = User::where('host',1)->get();
        return response()->json(['users' => $user]);
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
