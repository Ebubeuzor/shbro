<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ForgotPassword;
use App\Http\Controllers\Api\HomepageController;
use App\Http\Controllers\Api\HostHomeController;
use App\Http\Controllers\Api\NotifyController;
use App\Http\Controllers\Api\UserController;
use App\Models\User;
use App\Models\Visitor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->group(function(){

    // This requests an authenticated user details
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    

    /**
     * Anytime you see apiResource 
     * just know that it contains 4 type od request
     * get , put/patch ,post and delete
     * 
     * get(/userDetail) get the details of every user that is not  verified
     * put(/userDetail/{value}) as you can see it accept a value in the url this value is an authenticated user id
     * and the values which you will send as object must be in the following object
     * firstName
        lastName
        phone
        email
        government_id
        country
        street
        emergency_no
        zipCode
        state
        city
        status
     * 
     */

    Route::apiResource('/userDetail', UserController::class);
    
    // this gets all an authenticated user notification
    Route::get('notification', [NotifyController::class, 'index']);
    // this deletes all an authenticated user notification and it accepts the notification id in the url 
    Route::delete('notification/{notification}', [NotifyController::class, 'destroy']);
    // this logs out an authenticated user 
    Route::get('logout', [AuthController::class, 'logout']);
    /**
     *  this is used to update the homepage
     *  
     * 
     *  */

    Route::post('homepage', [HomepageController::class, 'store']);
    Route::post('changePassword', [AuthController::class, 'changePassword']);
    /**
     * 
     * 
     * get(/hosthomes) get the details of every verified homes
     * post(/hosthomes) use this url to create a user home 
     * and the values which you will send as object must be in the following object
            'property_type' => "required",
            'guest_choice' => "required",
            'address' => "required",
            'guest' => "required",
            'bedrooms' => "required",
            'beds' => "required",
            'bathrooms' => "required",
            'amenities' => "required | array",
            'hosthomephotos' => "required | array | min:5",
            'hosthomevideo' => [
                'required'],
            'title' => "required",
            'hosthomedescriptions' => "required|array| min:2",
            'description' => "required",
            'reservation' => "required",
            'reservations' => "required | array",
            'price' => "required",
            'discounts' => "required | array",
            'rules' => "required | array",
            'additionalRules' => "string",
            'host_type' => "required",
            'notice' => "required | array",
            'checkin' => "required ",
            'cancelPolicy' => "required",
            'securityDeposit' => "required",

            amenities, hosthomephotos, hosthomedescriptions, reservations,discounts 
            rules,notice
            must be an array of values 

     *  get(hosthomes/{hosthome}) this is used to get the host home details the
     *  {hosthome} is the hosthome id 
     * 
     * 
     */
    Route::apiResource('hosthomes',HostHomeController::class);
    
    // this gets all unverified homes
    Route::get('notVerified', [HostHomeController::class, 'notVerified']);
    // this gets all homes
    Route::get('allHomes', [HostHomeController::class, 'allHomes']);
    // this accept the value of unverified home id so that they can be verified
    Route::put('approveHome/{id}', [HostHomeController::class, 'approveHome']);
    Route::get('guests', [AdminController::class, 'guests']);
    Route::get('hosts', [AdminController::class, 'hosts']);
    
    // this accept the value of a user id
    Route::put('banGuest/{id}', [AdminController::class, 'banGuest']);
    Route::put('suspendGuest/{id}', [AdminController::class, 'suspendGuest']);
    Route::put('deleteGuest/{id}', [AdminController::class, 'deleteGuest']);
    
});

Route::get('homepage', [HomepageController::class, 'index']);

Route::post('signup', [AuthController::class, 'signup']);
Route::post('login', [AuthController::class, 'login']);
Route::get('auth', [AuthController::class, 'redirectToAuth']);
Route::get('auth/callback', [AuthController::class, 'handleAuthCallback']);
Route::post('/password/reset', [ForgotPassword::class, 'sendPasswordResetEmail']);

Route::get('/verify-tokens/{remToken}/{userToken}', function ($remToken, $userToken) {
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
});

Route::get('/view-count', function () {
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
});

Route::get('/visitor', function () {
    
    $viewCount = Visitor::find(1);
    return response()->json(['views' => $viewCount->views]);
    
});
