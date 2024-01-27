<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingsController;
use App\Http\Controllers\Api\ChatController;
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


Route::middleware('auth:sanctum')->group(function(){

    Route::get('/user', [UserController::class, 'getUserInfo']); 

    Route::apiResource('/userDetail', UserController::class);
    
    Route::get('notification', [NotifyController::class, 'index']);
    
    Route::get('sendNotificationToUser', [NotifyController::class, 'sendNotificationToUser']);
    
    Route::delete('notification/{notification}', [NotifyController::class, 'destroy']);
    
    Route::get('logout', [AuthController::class, 'logout']);

    Route::post('createCard/{id}', [UserController::class, 'createCard']);
    Route::post('createUserBankinfo/{id}', [UserController::class, 'createUserBankinfo']);

    Route::delete('deleteUserCard/{userCardId}/{userid}', [UserController::class, 'deleteUserCard']);
    Route::delete('removeFromWishlist/{hostHomeId}', [UserController::class, 'removeFromWishlist']);
    Route::get('selectCard/{userCardId}/{userid}', [UserController::class, 'selectCard']);
    Route::get('selectBankInfo/{userbankinfoId}/{userid}', [UserController::class, 'selectBankInfo']);
    Route::get('getUserCards/{userid}', [UserController::class, 'getUserCards']);
    Route::get('getWishlistContainerItems/{userid}', [UserController::class, 'getWishlistContainerItems']);
    Route::get('getUserBankInfos/{userid}', [UserController::class, 'getUserBankInfos']);
    Route::get('getUserWishlistContainers', [UserController::class, 'getUserWishlistContainers']);
    Route::get('upcomingReservation', [UserController::class, 'upcomingReservation']);
    Route::get('arrivingSoon', [UserController::class, 'arrivingSoon']);
    Route::get('checkingOut', [UserController::class, 'checkingOut']);
    Route::get('currentlyHosting', [UserController::class, 'currentlyHosting']);
    Route::get('userTrips', [UserController::class, 'userTrips']);
    Route::delete('deleteUserWishlistContainers', [UserController::class, 'deleteUserWishlistContainers']);
    
    Route::middleware('googleSignup')->group(function(){

        Route::post('changePassword', [AuthController::class, 'changePassword']);
        
    });
    


    Route::apiResource('hosthomes',HostHomeController::class);
    
    Route::middleware('role:admin')->group(function(){
        Route::post('homepage', [HomepageController::class, 'store']);
        Route::post("sendEmail", [AdminController::class, 'sendEmail']);
        
        
        Route::get('notVerified', [HostHomeController::class, 'notVerified']);
        
        Route::get('allHomes', [HostHomeController::class, 'allHomes']);
        
        Route::get('approveHome/{id}', [HostHomeController::class, 'approveHome']);
        Route::put('disapproveHome/{user}/{hosthomeid}', [HostHomeController::class, 'disapproveHome']);
        Route::get('guests', [AdminController::class, 'guests']);
        Route::get('hosts', [AdminController::class, 'hosts']);
        
        Route::put('editUserWishlistContainerName/{id}', [UserController::class, 'editUserWishlistContainerName']);
        Route::delete('deleteUserWishlistContainer/{id}', [UserController::class, 'deleteUserWishlistContainer']);
        Route::put('banGuest/{id}', [AdminController::class, 'banGuest']);
        Route::put('unbanGuest/{id}', [AdminController::class, 'unbanGuest']);
        Route::put('unsuspendGuest/{id}', [AdminController::class, 'unsuspendGuest']);
        Route::put('suspendGuest/{id}', [AdminController::class, 'suspendGuest']);
        Route::delete('deleteGuest/{id}', [AdminController::class, 'deleteGuest']);

    });
    
    
    Route::post('createWishlist/{userid}', [UserController::class, 'createWishlist']);
    Route::get('userTips', [UserController::class, 'userTips']);
    Route::get('deactivateAccount', [UserController::class, 'deactivateAccount']);
    Route::get('getUserWishlistContainersAndItems', [UserController::class, 'getUserWishlistContainersAndItems']);


    
    Route::post('/payment/initiate-multiple/{hosthomeid}/{userid}', [BookingsController::class, 'bookApartment']);
    Route::group(['prefix' => 'chat','as' => 'chat.'], function(){
        Route::get('/{receiverId?}', [ChatController::class, 'index'])->name('index');
        Route::post('/{receiverId?}', [ChatController::class, 'store'])->name('store');
    });
});

Route::get('homepage', [HomepageController::class, 'index']);

Route::post('signup', [AuthController::class, 'signup']);
Route::post('login', [AuthController::class, 'login']);
Route::get('auth', [AuthController::class, 'redirectToAuth']);
Route::get('auth/callback', [AuthController::class, 'handleAuthCallback']);
Route::post('/password/reset', [ForgotPassword::class, 'sendPasswordResetEmail']);

Route::get('/verify-tokens/{remToken}/{userToken}', [AuthController::class, 'authUserFromMain']);

Route::get('/view-count', [AuthController::class, 'registerVisitor']);

Route::get('/visitor', [AuthController::class, 'getVisitorInfo']);
Route::put('/reactivateAccount', [UserController::class, 'reactivateAccount']);
Route::post('/filterHomepage', [UserController::class, 'filterHomepage']);
