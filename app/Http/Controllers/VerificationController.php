<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;

class VerificationController extends Controller
{
    public function verifyEmail($token)
    {
        $user = User::where('remember_token',$token)->first();
        if (!empty($user) || $user->is_active == false) {
            if ($user->email_verified_at == null || $user->is_active == false) {
                    
                $user->email_verified_at = date('Y-m-d H:i:s');
                $user->is_active = true;
                $user->save();

                $recentToken = $user->createToken('main')->plainTextToken;

                
                if ($user->host) {
                    $softDeletedHostHomes = $user->hosthomes()->onlyTrashed()->get();
                    
                    foreach ($softDeletedHostHomes as $hostHome) {
                        $hostHome->restore();
                    }
                }
                
                return redirect()->away('https://shortletbooking.com/?verified=true&remtoken=' . $token . "&ustoken=".$recentToken);

            }    
            else{
                abort(404);
            }
        } else {
            abort(404);
        }
        
    }
}
