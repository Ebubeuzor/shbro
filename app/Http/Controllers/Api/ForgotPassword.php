<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

class ForgotPassword extends Controller
{
    
    public function sendPasswordResetEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        return $status == Password::RESET_LINK_SENT
            ? response()->json(['message' => 'Password reset link sent'], 200)
            : response()->json(['message' => 'Unable to send reset link'], 500);
    }


    public function returnView(){
        return view('emails.password-reset');
    }

    public function resetPassword(Request $request)
    {
        $data = $request->validate([
            'password' => ['required', 'min:6', 'max:255'],
            'email' => 'exists:users,email'
        ]);
    
        $user = User::where('email', $data['email'])->first();
    
        if (!$user) {
            return view('SuccessfulPasswordFail');
        }
    
        $user->password = Hash::make($data['password']);
        $save = $user->save();
    
        return $save
            ? view('SuccessfulPasswordChange')
            : view('SuccessfulPasswordFail');
    }
}
//Blessingonyeagusi.12345