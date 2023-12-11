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

    Route::apiResource('/userDetail', UserController::class);
    
    Route::get('notification', [NotifyController::class, 'index']);
    
    Route::delete('notification/{notification}', [NotifyController::class, 'destroy']);
    
    Route::get('logout', [AuthController::class, 'logout']);

    
    Route::middleware('googleSignup')->group(function(){

        Route::post('changePassword', [AuthController::class, 'changePassword']);
        
    });
    
    Route::apiResource('hosthomes',HostHomeController::class);
    
    Route::middleware('role:admin')->group(function(){
        Route::post('homepage', [HomepageController::class, 'store']);
        Route::post("sendEmail", [AdminController::class, 'sendEmail']);
        
        
        Route::get('notVerified', [HostHomeController::class, 'notVerified']);
        // this gets all homes
        Route::get('allHomes', [HostHomeController::class, 'allHomes']);
        // this accept the value of unverified home id so that they can be verified
        Route::put('approveHome/{id}', [HostHomeController::class, 'approveHome']);
        Route::get('guests', [AdminController::class, 'guests']);
        Route::get('hosts', [AdminController::class, 'hosts']);
        
        Route::put('banGuest/{id}', [AdminController::class, 'banGuest']);
        Route::put('suspendGuest/{id}', [AdminController::class, 'suspendGuest']);
        Route::put('deleteGuest/{id}', [AdminController::class, 'deleteGuest']);

    });
    
    
    Route::post('createWishlist/{userid}', [UserController::class, 'createWishlist']);
    Route::get('createWishlistItem/{wishcontainerid}/{hosthomeid}', [UserController::class, 'createWishlistItem']);


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
