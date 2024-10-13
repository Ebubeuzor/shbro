<?php

namespace App\Http\Controllers\Api;

use App\Events\EmailVerified;
use App\Http\Controllers\Controller;
use App\Http\Requests\ChangePasswordRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\Mail\CoHostInvitation;
use App\Mail\VerifyYourEmail;
use App\Mail\WelcomeMail;
use App\Models\Cohost;
use App\Models\HostHome;
use App\Models\Hosthomecohost;
use App\Models\User;
use App\Models\UserWallet;
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
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Redirect;

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
            do {
                $remember_token = Str::random(40);
            } while (User::where('remember_token', $remember_token)->exists());

            $user = User::create([
                'name' => $socialiteUser->getName(),
                'email' => $socialiteUser->getEmail(),
                'google_id' => $socialiteUser->getId(),
                'remember_token' => $remember_token
            ]);

            Mail::to($user->email)->queue(
                (new WelcomeMail($user))->onQueue('emails')
            );
        }elseif (!$user->is_active) {
            return response()->json(["message" => "Your account has been deactivated"], 422);
        }
        elseif ($user->suspend != null) {
            return response()->json(["message" => "Your account has been suspended"], 422);
        }

        return response()->json([
            'user' => $user,
            'access_token' => $user->createToken('main')->plainTextToken,
            'token_type' => 'Bearer',
        ]);
    }

    /**
     * 
     * @lrd:start
     * Verify Google Token and Authenticate User
     * 
     * This endpoint verifies the provided Google ID token and authenticates the user.
     * @title Verify Google Token
     * @description Verifies the Google ID token sent from the Flutter app and logs in or registers the user.
     * @auth false
     * @bodyParam token string required The Google ID token received after successful sign-in in the Flutter app. Example: "eyJhb..."
     * @response 200 {
     *   "user": {
     *     "id": 1,
     *     "name": "Ajanaku David",
     *     "email": "davidajanaku46163@gmail.com",
     *     "google_id": "110500601015550307317",
     *     "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6Ij..."
     *   }
     * }
     * @response 400 {
     *   "error": "Invalid or expired token"
     * }
     * @lrd:end
     * @LRDparam token use|required
     */
    public function verifyGoogleToken(Request $request)
    {
        $token = $request->validate([
            'token' => 'required|string',
        ]);

        try {
            // Verify the token with Google directly as a secondary check
            $response = Http::get('https://oauth2.googleapis.com/tokeninfo', [
                'id_token' => $token['token'],
            ]);

            if ($response->failed()) {
                return response()->json([
                    'error' => 'Invalid or expired token',
                ], 400);
            }

            $googleUser = $response->json();
            
            $user = User::where('email', $googleUser['email'])->first();

            if (!$user) {
                
                do {
                    $remember_token = Str::random(40);
                } while (User::where('remember_token', $remember_token)->exists());
                
                $user = User::create([
                    'name' => $googleUser['name'],
                    'email' => $googleUser['email'],
                    'google_id' => $googleUser['sub'],
                    'remember_token' => $remember_token
                ]);

                Mail::to($user->email)->queue(
                    (new WelcomeMail($user))->onQueue('emails')
                );
            }elseif (!$user->is_active) {
                return response("Your account has been deactivated", 422);
            }
            elseif ($user->suspend != null) {
                return response("Your account has been suspended", 422);
            }
            elseif ($user->banned != null) {
                return response("Your account has been suspended", 422);
            }

            return response()->json([
                'user' => $user,
                'token' => $user->createToken('main')->plainTextToken,
            ], 201);

        } catch (\Exception $e) {
            // Log the error for debugging
            info('Google Token Verification Failed', [
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'error' => 'An error occurred during token verification',
            ], 500);
        }
    }


    /**
     * @lrd:start
     * This function is used to register a new user. 
     *
     * **Required Parameters:**
     * - `name`: The user's name (string).
     * - `email`: The user's email address (string).
     * - `password`: The user's password (string).
     *
     * **Optional Parameters:**
     * - `hostremtoken`: A token used for host or co-host authorization (string).
     * - `hostid`: The ID of the user who invited you to be a co-host (integer).
     * - `encrptedCoHostemail`: The encrpted email of the cohost.
     *
     * **Behavior:**
     * - Validates required data (`name`, `email`, `password`) using the `SignupRequest` class.
     * - If all required data is valid, creates a new user and sends a welcome email as well as a verification email.
     * - Additionally, handles the optional co-host invitation scenario:
     *    - Checks if the provided `hostremtoken`, `hostid`, and `hosthomeid` are valid.
     *   - If valid, verifies the host or co-host authorization and creates the user as a co-host for the specified apartment.
     *   - Sends an invitation email to the new co-host.
     * - Returns a response containing a link to the verification page.
     *
     * **Error Handling:**
     * - Returns a 400 Bad Request response with an appropriate error message if:
     *    - Required data is missing or invalid.
     *    - Host or co-host authorization fails.
     *    - The provided apartment ID is not found.
     *    - Email did not match to make you a cohost
     * - Returns a 500 with an appropriate error message if:
     *    - A user tries to manipulate the encrptrd data 
     * 
     * @lrd:end
    */
    public function signup(SignupRequest $request) {
        $data = $request->validated();
        
        $user = null;

        $existingUser = User::where('email', $data['email'])->whereNotNull('is_guest')->first();

        if ($existingUser) {
            // Update the existing guest account to nullify the is_guest flag
            
            do {
                $remember_token = Str::random(40);
            } while (User::where('remember_token', $remember_token)->exists());
            
            $existingUser->update([
                'name' => $data['name'],
                'is_guest' => null,
                'password' => Hash::make($data['password']),
                'remember_token' => $remember_token
            ]);
    
            $user = $existingUser;
            
            UserWallet::create([
                'user_id' => $user->id,
                'totalbalance' => 0,
            ]);
        }elseif (!empty(isset($data['hostremtoken'])) || !empty(isset($data['hostid']))) {
            $decryptedCohostemail = Crypt::decryptString($data['encrptedCoHostemail']); 
            $decryptedHostremToken = $data['hostremtoken'];

            $oghost = User::where('remember_token', $decryptedHostremToken)->where('id', $data['hostid'])->first();
            if ($oghost) {
                        

                if ($decryptedCohostemail == $data['email']) {
                    
                    do {
                        $remember_token = Str::random(40);
                    } while (User::where('remember_token', $remember_token)->exists());
                    
                    $user = User::create([
                        'name' => $data['name'],
                        'email' => $data['email'],
                        'password' => Hash::make($data['password']),
                        'remember_token' => $remember_token,
                        'co_host' => 1
                    ]);

                    $this->becomeACoHost($user->id, $oghost->id);
                    $cacheKey = "hostCohost{$oghost->id}";
                    Cache::forget($cacheKey);
                }else {
                    abort(400, "Email did not match to make you a cohost");
                }

            }else {
                abort(400, "Invalid host or cohost authorization ");
            }
        }else {
            
            do {
                $remember_token = Str::random(40);
            } while (User::where('remember_token', $remember_token)->exists());
            
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'remember_token' => $remember_token
            ]);
    
            UserWallet::create([
                'user_id' => $user->id,
                'totalbalance' => 0,
            ]);
        }

        Mail::to($user->email)->queue(
            (new WelcomeMail($user))->onQueue('emails')
        );
        Mail::to($user->email)->queue(
            (new VerifyYourEmail($user))->onQueue('emails')
        );
    
        Cache::flush();
        $routeLink = route('verification.notice');

        return response([
            'link' => $routeLink
        ]);
    }

    
    public function becomeACoHost($userId,$hostid)
    {


        $existingCoHost = Cohost::where('user_id', $userId)->first();

        if (!$existingCoHost) {
            $cohost = new Cohost();
            $cohost->user_id = $userId;
            $cohost->host_id = $hostid;
            $cohost->save();
        
        
            $hostHomes = HostHome::where('user_id', $hostid)->get();
        
            // Iterate through each host home
            foreach ($hostHomes as $hostHome) {
            // Check if the user is already a co-host for this home
                $existingCoHost = Hosthomecohost::where('user_id', $userId)
                ->where('host_home_id', $hostHome->id)
                ->first();

                // If the user is not already a co-host, create a co-host entry
                if (!$existingCoHost) {
                    $hosthomeCoHost = new Hosthomecohost();
                    $hosthomeCoHost->user_id = $userId;
                    $hosthomeCoHost->host_id = $hostid;
                    $hosthomeCoHost->host_home_id = $hostHome->id;
                    $hosthomeCoHost->save();
                }
            }
            
            return Redirect::away('https://shortletbooking.com/');
        }else{
            abort(404);
        }

    }

    /**
     * @lrd:start
     * now after the user click on the verify or activate your account button in their email address you should see
     * remtoken and ustoken in the frontend url param pass it in the api you are consuming
     * if it is correct it should return the current user info and the token which will be used to authenticate the user
     * @lrd:end
     */
    public function authUserFromMain($remToken, $compositeToken) {
        // Step 1: Find the user by the remember token
        $user = User::where('remember_token', $remToken)->first();
    
        if (!$user) {
            return response()->json(['error' => 'Invalid remember token'], 401);
        }
    
        // Step 2: Split the composite token into ID and PlainTextToken
        $tokenParts = explode('|', $compositeToken);
    
        if (count($tokenParts) !== 2) {
            return response()->json(['error' => 'Invalid token format'], 400);
        }
    
        $tokenId = $tokenParts[0];
        $plainTextToken = $tokenParts[1];
    
        // Step 3: Retrieve the token record using the token ID
        $tokenRecord = $user->tokens()->where('id', $tokenId)->first();
    
        if (!$tokenRecord) {
            return response()->json(['error' => 'User token not found'], 404);
        }
    
        // Step 4: Hash the provided PlainTextToken to match the stored token hash
        $hashedPlainTextToken = hash('sha256', $plainTextToken);
    
        // Step 5: Validate the token hash against the stored token hash
        if (!hash_equals($tokenRecord->token, $hashedPlainTextToken)) {
            return response()->json(['error' => 'Invalid user token'], 403);
        }
    
        // Step 6: Log the user in
        Auth::login($user);
    
        // Step 7: Check if the user is authenticated
        if (Auth::check()) {
            return response()->json([
                'user' => Auth::user(),
                'token' => $compositeToken
            ]);
        }
    
        // Step 8: Handle authentication failure
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
    public function login(LoginRequest $request)
    {
        $data = $request->validated();
        $email = $data['email'];

        // Define the throttle key using the email or IP address
        $throttleKey = Str::lower($email) . '|' . request()->ip();

        // Check if the user is locked out due to too many login attempts
        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            return response([
                'message' => 'Too many login attempts. Please try again later.'
            ], 429);
        }

        if (Auth::attempt($data)) {
            $user = Auth::user();
            if ($user->google_id == null) {
                if (!$user->is_active) {
                    return response("Your account has been deactivated", 422);
                }
                if ($user->suspend != null) {
                    return response("Your account has been suspended", 422);
                }
                if ($user->banned != null) {
                    return response("Your account has been suspended", 422);
                }
                if ($user->email_verified_at != null) {
                    $user->update(['last_login_at' => Carbon::now()]);

                    // Clear the rate limit on successful login
                    RateLimiter::clear($throttleKey);

                    /** @var User $user  */
                    $token = $user->createToken('main')->plainTextToken;
                    return response([
                        'user' => $user,
                        'token' => $token
                    ]);
                } else {
                    return response("Please verify your email", 422);
                }
            } elseif (!$user->is_active) {
                return response("Your account has been deactivated", 422);
            } elseif ($user->suspend != null) {
                return response("Your account has been suspended", 422);
            }
        } else {
            // Increment the number of attempts on a failed login
            RateLimiter::hit($throttleKey, 60 * 60); // 1 hour lockout

            return response([
                'message' => 'Provided email address or password is incorrect'
            ], 422);
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
        
        $viewCount = new Visitor();
        $viewCount->views = 1;
        $viewCount->save();

        $response = response()->json(['views' => $viewCount->views]);
        $response->cookie('view_count', 1);

        return $response;

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
