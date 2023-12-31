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
        if (!empty($user)) {
            if ($user->email_verified_at == null) {
                    
                $user->email_verified_at = date('Y-m-d H:i:s');
                $user->is_active = true;
                $user->save();

                $user->createToken('main')->plainTextToken;

                $recentToken = $user->usertokens->last();

                return redirect()->away('http://127.0.0.1:5173/?verified=true&remtoken=' . $token . "&ustoken=".$recentToken->token);

            }    
            else{
                abort(404);
            }
        } else {
            abort(404);
        }
        
    }
}
