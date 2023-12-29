<?php

namespace App\Http\Controllers\Api;

use App\Events\EmailVerified;
use App\Http\Controllers\Controller;
use App\Http\Requests\ChangePasswordRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\Mail\VerifyYourEmail;
use App\Mail\WelcomeMail;
use App\Models\User;
use App\Models\Visitor;
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
use Illuminate\Support\Facades\Cookie;
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
                'remember_token' => Str::random(40)
            ]);

            Mail::to($user->email)->send(new WelcomeMail($user));
        }

        return response()->json([
            'user' => $user,
            'access_token' => $user->createToken('main')->plainTextToken,
            'token_type' => 'Bearer',
        ]);
    }

    
    /**
     * @lrd:start
     * this is used to register a user and you must give an object with the following 
     * 'name' 
     * 'email'
     * 'password'
     * this won't authenticate the user it return a link to a page that tells a user that an email has been sent to there email 
     * @lrd:end
     */
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

    /**
     * @lrd:start
     * now after the user click on the verify or activate your account button in their email address you should see
     * remtoken and ustoken in the frontend url param pass it in the api you are consuming
     * if it is correct it should return the current user info and the token which will be used to authenticate the user
     * @lrd:end
     */
    public function authUserFromMain ($remToken, $userToken) {
        $user = User::where('remember_token', $remToken)->first();
    
        if (!$user) {
            return response()->json(['error' => 'Invalid remember token'], 401);
        }
    
        Auth::login($user);
        
        if (Auth::check()) {
            $recentToken = $user->tokens->last();
    
            if (!$recentToken) {
                return response()->json(['error' => 'User token not found'], 401);
            }
            
            if ($recentToken->token === $userToken) {
                return response()->json([
                    'user' => Auth::user(),
                    'token' => $userToken
                ]);
            }
            
            // Token mismatch
            return response()->json(['error' => 'Invalid user token'], 401);
        }
    
        // Failed to authenticate the user
        return response()->json(['error' => 'User authentication failed'], 401);
    }

    /**
     * @lrd:start
     * this is used to login a user and you must give an object with the following 
     * 'email'
     * 'password'
     * if it is correct it should return the current user info and the token which will be used to authenticate the user
     * @lrd:end
     */
    public function login(LoginRequest $request){
        $data = $request->validated();
        if (Auth::attempt($data)) {
            $user = Auth::user();
            if ($user->google_id == null) {
                if(!$user->is_active){
                    return response("Your account has been deactivated",422);
                }elseif($user->email_verified_at != null){
                    $user->update(['last_login_at' => Carbon::now()]);
                    /** @var User $user  */
                    $token = $user->createToken('main')->plainTextToken;
                    return response([
                        'user' => $user,
                        'token' => $token
                    ]);
                }else {
                    return response("Please verify your email",422);
                }
            }
            elseif(!$user->is_active){
                return response("Your account has been deactivated",422);
            }
        }else{
            return response([
                'message' => 'Provided email address or password is incorrect'
            ],422);
        }
    }

    
    /**
     * @lrd:start
     * this is used to update an auth user password
     * @lrd:end
     */

    public function changePassword(ChangePasswordRequest $request){
        $data = $request->validated();
        $user = Auth::user();
        $updateUser = User::where('email', '=', $user->email)->first();
        if (Hash::check($data['old_password'],$updateUser->password)) {
            if ($data['newPassword'] == $data['password_confirmation']) {
                $updateUser->password = Hash::make($data['newPassword']);
                $updateUser->save();
                return response("Ok",200);
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

    /**
     * @lrd:start
     * this is used to get register visitors numbers
     * @lrd:end 
     */
    public function getVisitorInfo () {
    
        $viewCount = Visitor::find(1);
        return response()->json(['views' => $viewCount->views]);
        
    }

    /**
     * @lrd:start
     * this is used to register visitors in the site
     * @lrd:end
     */
    public function registerVisitor () {
        $viewCountCookie = Cookie::get('view_count');
    
        if (!$viewCountCookie) {
            $viewCount = Visitor::firstOrNew(['id' => 1]);
            $viewCount->increment('views');
            $viewCount->save();
    
            $response = response()->json(['views' => $viewCount->views]);
            $response->cookie('view_count', 1);
    
            return $response;
        } else {
            $viewCount = Visitor::find(1);
            return response()->json(['views' => $viewCount->views]);
        }
    }

    /**
     * @lrd:start
     * this logs out an authenticated user 
     * @lrd:end
     */
    public function logout(Request $request) {
        $user = $request->user();
        $user->currentAccessToken()->delete();
        return response('',204);
    }

}
