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

    Route::get('selectCard/{userCardId}/{userid}', [UserController::class, 'selectCard']);
    Route::get('getUserCards/{userid}', [UserController::class, 'getUserCards']);
    Route::get('getUserWishlistContainers', [UserController::class, 'getUserWishlistContainers']);
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
        Route::put('suspendGuest/{id}', [AdminController::class, 'suspendGuest']);
        Route::put('deleteGuest/{id}', [AdminController::class, 'deleteGuest']);

    });
    
    
    Route::post('createWishlist/{userid}', [UserController::class, 'createWishlist']);
    Route::get('userTips', [UserController::class, 'userTips']);
    Route::get('deactivateAccount', [UserController::class, 'deactivateAccount']);


    Route::post('/payment/initiate-multiple/{hosthomeid}/{userid}', [BookingsController::class, 'bookApartment'])->name('pay');
       
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
Route::post('/reactivateAccount', [UserController::class, 'reactivateAccount']);
