<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReactivatingAccountRequest;
use App\Http\Requests\VerifyOtpRequestForReactivatingAccountRequest;
use App\Models\User;
use App\Otp\PasswordResetOtp;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\RateLimiter;
use SadiqSalau\LaravelOtp\Facades\Otp;

class ForgotPassword extends Controller
{
    
    
    /**
     * @lrd:start
     * is used to send password reset link to a user
     * @lrd:end
     * @LRDparam email use|required
     */
    public function sendPasswordResetEmail(Request $request)
    {
        $request->validate(['email' => 'required']);

        $user = User::whereEmail($request->email)->first();

        if (!$user) {
            abort(404, 'Not a user');
        }

        if ($user->google_id != null) {
            abort(400, "This account wasn't registered with a password");
        }

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

    /**
     * @lrd:start
     * Send an OTP to the user's email for password reset.
     *
     * This method sends a One-Time Password (OTP) to the user's registered email address for password reset purposes.
     * It includes throttling to prevent abuse and checks to ensure the user account is eligible for password reset.
     * 
     * @param ReactivatingAccountRequest $request The validated request containing the user's email.
     * 
     * @return \Illuminate\Http\Response A response indicating the status of the OTP sending process.
     * 
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException If the user is not found, inactive, suspended, banned, or hasn't verified their email.
     * @lrd:end
    */
    public function sendOtpForPasswordReset(ReactivatingAccountRequest $request)
    {
        $data = $request->validated();
        $userEmail = $data['email'];
        $throttleKey = Str::lower($userEmail) . '|VerifyingOtpForForgotPassword1|' . request()->ip();

        // Throttling to prevent too many attempts
        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            return response(['message' => 'Too many requests. Please try again later.'], 429);
        }

        $user = User::where('email', $userEmail)->firstOrFail();

        $this->checkUserEligibility($user);

        $identifier = $user->email . "|VerifyingOtpForForgotPassword|" . request()->ip();

        $otp = Otp::identifier($identifier)->send(
            new PasswordResetOtp($userEmail),
            Notification::route('mail', $user->email)
        );

        RateLimiter::hit($throttleKey);

        if ($otp['status'] !== Otp::OTP_SENT) {
            return response(['message' => 'Failed to send OTP. Please try again later.'], 500);
        }

        return response(['message' => 'OTP has been sent to this email.'], 200);
    }


    /**
     * @lrd:start
     * Verify the OTP for password reset.
     *
     * This method verifies the OTP provided by the user for password reset.
     * The OTP is validated against the identifier (user's email and IP address).
     * 
     * @param VerifyOtpRequestForReactivatingAccountRequest $request The validated request containing the user's email and OTP.
     * 
     * @return \Illuminate\Http\Response A response indicating the status of the OTP verification process.
     * 
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException If the OTP is invalid or expired, or if the user account is not eligible.
     * @lrd:end
    */
    public function verifyOtpForPasswordReset(VerifyOtpRequestForReactivatingAccountRequest $request)
    {
        $data = $request->validated();
        $userEmail = $data['email'];
        $throttleKey = Str::lower($userEmail) . '|VerifyingOtpForForgotPassword2|' . request()->ip();

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            return response(['message' => 'Too many requests. Please try again later.'], 429);
        }

        RateLimiter::hit($throttleKey, 60 * 60);

        $user = User::where('email', $userEmail)->firstOrFail();

        $this->checkUserEligibility($user);

        $identifier = $user->email . "|VerifyingOtpForForgotPassword|" . request()->ip();

        $otp = Otp::identifier($identifier)->attempt($data['otp_code']);

        if ($otp['status'] !== Otp::OTP_PROCESSED) {
            return response(['message' => 'Invalid or expired OTP.'], 403);
        }

        return response(['message' => 'OTP verified successfully.'], 200);
    }


    /**
     * @lrd:start
     * Resend the OTP for password reset.
     *
     * This method resends the OTP to the user's registered email address if the original OTP was lost or expired.
     * It includes throttling to prevent abuse and checks to ensure the user account is eligible for password reset.
     * 
     * @param ReactivatingAccountRequest $request The validated request containing the user's email.
     * 
     * @return \Illuminate\Http\Response A response indicating the status of the OTP resend process.
     * 
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException If the user is not found, inactive, suspended, banned, or hasn't verified their email.
     * @lrd:end
    */
    public function resendOtpForPasswordReset(ReactivatingAccountRequest $request)
    {
        $data = $request->validated();
        $userEmail = $data['email'];
        $throttleKey = Str::lower($userEmail) . '|VerifyingOtpForForgotPassword3|' . request()->ip();

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            return response(['message' => 'Too many requests. Please try again later.'], 429);
        }

        RateLimiter::hit($throttleKey, 60 * 60);

        $user = User::where('email', $userEmail)->firstOrFail();

        $this->checkUserEligibility($user);

        $identifier = $user->email . "|VerifyingOtpForForgotPassword|" . request()->ip();

        $otp = Otp::identifier($identifier)->update();

        if ($otp['status'] !== Otp::OTP_SENT) {
            return response(['message' => 'Failed to resend OTP. Please try again later.'], 500);
        }

        return response(['message' => 'OTP has been resent to this email.'], 200);
    }


    /**
     * Check if the user is eligible for password reset.
     *
     * This method checks if the user's account is active, verified, not suspended, and not registered via Google.
     * 
     * @param User $user The user instance to check.
     * 
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException If the user is not eligible.
     */
    protected function checkUserEligibility(User $user)
    {
        if (is_null($user->email_verified_at) && is_null($user->google_id)) {
            abort(403, "Please verify your email address first");
        }

        if (!is_null($user->google_id)) {
            abort(400, "This account wasn't registered with a password");
        }

        if (!$user->is_active) {
            abort(403, "This account has been deactivated");
        }

        if (!is_null($user->suspend)) {
            abort(403, "This account has been suspended");
        }

        if (!is_null($user->banned)) {
            abort(403, "This account has been banned");
        }
    }

}