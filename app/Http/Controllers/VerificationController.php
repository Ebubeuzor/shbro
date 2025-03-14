<?php

namespace App\Http\Controllers;

use App\Mail\EmailVerfied;
use App\Models\User;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Mail;

class VerificationController extends Controller
{
    public function verifyEmail($token,$mobileRequest = null)
    {
        $user = User::where('remember_token',$token)->first();
        if (!empty($user) || $user->is_active == false) {
            if ($user->email_verified_at == null || $user->is_active == false) {
                    
                $user->email_verified_at = date('Y-m-d H:i:s');
                $user->is_active = true;
                $user->save();

                Mail::to($user->email)->queue(
                    (new EmailVerfied($user))->onQueue('emails')
                );
                
                $recentToken = $user->createToken('main')->plainTextToken;

                
                if ($user->host) {
                    $softDeletedHostHomes = $user->hosthomes()->onlyTrashed()->get();
                    
                    foreach ($softDeletedHostHomes as $hostHome) {
                        $hostHome->restore();
                    }
                }
                
                $mobileRequest = $mobileRequest != "false" ? "true" : "false";
                if ($mobileRequest != "false") {
                    return redirect()->away('https://shortletbooking.com/EmailVerifyMobile/?verified=true&remtoken=' . $token . "&ustoken=".$recentToken . "&mobileRequest=" . $mobileRequest);
                }else{
                    return redirect()->away('https://shortletbooking.com/EmailVerify/?verified=true&remtoken=' . $token . "&ustoken=".$recentToken . "&mobileRequest=" . $mobileRequest);

                }

            }    
            else{
                abort(404);
            }
        } else {
            abort(404);
        }
        
    }
}
