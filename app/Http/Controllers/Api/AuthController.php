<?php

namespace App\Http\Controllers\Api;

use App\Events\EmailVerified;
use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\Mail\VerifyYourEmail;
use App\Mail\WelcomeMail;
use App\Models\User;
use App\Rules\PasswordRequirements;
use Carbon\Carbon;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\MustVerifyEmail;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    use MustVerifyEmail;

    
    public function redirectToAuth(): JsonResponse
    {
        return response()->json([
            'url' => Socialite::driver('google')
                         ->stateless()
                         ->redirect()
                         ->getTargetUrl(),
        ]);
    }

    public function handleAuthCallback(): JsonResponse
    {
        try {   
            /** @var SocialiteUser $socialiteUser */
            $socialiteUser = Socialite::driver('google')->stateless()->user();
        } catch (ClientException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }

        $user = User::where('email', $socialiteUser->getEmail())->first();

        if (!$user) {
            $user = User::create([
                'name' => $socialiteUser->getName(),
                'email' => $socialiteUser->getEmail(),
                'google_id' => $socialiteUser->getId(),
            ]);

            Mail::to($user->email)->send(new WelcomeMail($user));
        }

        return response()->json([
            'user' => $user,
            'access_token' => $user->createToken('main')->plainTextToken,
            'token_type' => 'Bearer',
        ]);
    }

    public function signup(SignupRequest $request) {
        $data = $request->validated();
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'remember_token' => Str::random(40)
        ]);
    
        Mail::to($user->email)->send(new WelcomeMail($user));
        Mail::to($user->email)->send(new VerifyYourEmail($user));
    
        $routeLink = route('verification.notice');

        return response([
            'link' => $routeLink
        ]);
    }

    public function login(LoginRequest $request){
        $data = $request->validated();
        if (Auth::attempt($data)) {
            $user = Auth::user();
            $user->update(['last_login_at' => Carbon::now()]);
            /** @var User $user  */
            $token = $user->createToken('main')->plainTextToken;
            return response([
                'user' => $user,
                'token' => $token
            ]);
        }else{
            return response([
                'message' => 'Provided email address or password is incorrect'
            ],422);
        }
    }

    public function changePassword(Request $request){
        $data = $request->validate([
            'password' => 'required',
            'password_confirmation' => 'required',
            'newPassword' => ['required','min:6' ,'max:255', new PasswordRequirements],
        ]);
        $user = Auth::user();
        $updateUser = User::where('email', '=', $user->email)->first();
        if (Hash::check($data['password'],$updateUser->password)) {
            if ($data['newPassword'] == $data['password_confirmation']) {
                $updateUser->password = Hash::make($data['newPassword']);
                $updateUser->save();
            }else{
                return response([
                    'message' => 'New Password does not match'
                ],422);
            }
        }else{
            return response([
                'message' => 'Provided password is incorrect'
            ],422);
        }
    }

    public function logout(Request $request) {
        $user = $request->user();
        $user->currentAccessToken()->delete();
        return response('',204);
    }

}
