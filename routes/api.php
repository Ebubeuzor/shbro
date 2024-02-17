<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingsController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\ForgotPassword;
use App\Http\Controllers\Api\HomepageController;
use App\Http\Controllers\Api\HostHomeController;
use App\Http\Controllers\Api\NotifyController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\ReviewController;
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
    Route::get('getWishlistContainerItems/{wishlistContainerId}', [UserController::class, 'getWishlistContainerItems']);
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

    // Delete discount by id
    Route::delete('/deleteDiscountById/{id}', [HostHomeController::class, 'deleteDiscountById'])
        ->name('deleteDiscountById');

    // Delete offer by id
    Route::delete('/deleteOfferById/{id}', [HostHomeController::class, 'deleteOfferById'])
        ->name('deleteOfferById');

    // Delete description by id
    Route::delete('/deleteDescriptionById/{id}', [HostHomeController::class, 'deleteDescriptionById'])
        ->name('deleteDescriptionById');

    // Delete reservation by id
    Route::delete('/deleteReservationById/{id}', [HostHomeController::class, 'deleteReservationById'])
        ->name('deleteReservationById');

    // Delete rule by id
    Route::delete('/deleteRuleById/{id}', [HostHomeController::class, 'deleteRuleById'])
        ->name('deleteRuleById');

    // Delete notice by id
    Route::delete('/deleteNoticeById/{id}', [HostHomeController::class, 'deleteNoticeById'])
        ->name('deleteNoticeById');

    Route::post('hosthomes', [HostHomeController::class, 'store']);
    Route::get('hosthomes/{hosthome}', [HostHomeController::class, 'show']);
    Route::put('hosthomes/{hosthome}', [HostHomeController::class, 'update']);
    Route::delete('hosthomes/{hosthome}', [HostHomeController::class, 'destroy']);
    
    Route::middleware('role:admin')->group(function(){
        Route::post('homepage', [HomepageController::class, 'store']);
        Route::post("sendEmail", [AdminController::class, 'sendEmail']);
        
        
        Route::get('notVerified', [HostHomeController::class, 'notVerified']);
        
        Route::get('allHomes', [HostHomeController::class, 'allHomes']);
        
        Route::get('approveHome/{id}', [HostHomeController::class, 'approveHome']);
        Route::put('disapproveHome/{user}/{hosthomeid}', [HostHomeController::class, 'disapproveHome']);
        Route::get('guests', [AdminController::class, 'guests']);
        Route::get('checkedOutBookings', [AdminController::class, 'checkedOutBookings']);
        Route::get('adminAnalytical', [AdminController::class, 'adminAnalytical']);
        Route::get('getReviews', [AdminController::class, 'getReviews']);
        Route::get('bookings', [AdminController::class, 'bookings']);
        Route::get('hosts', [AdminController::class, 'hosts']);
        Route::get('cancelledTrips', [AdminController::class, 'cancelledTrips']);
        
        Route::put('editUserWishlistContainerName/{id}', [UserController::class, 'editUserWishlistContainerName']);
        Route::delete('deleteUserWishlistContainer/{id}', [UserController::class, 'deleteUserWishlistContainer']);
        Route::put('banGuest/{id}', [AdminController::class, 'banGuest']);
        Route::put('unbanGuest/{id}', [AdminController::class, 'unbanGuest']);
        Route::put('unsuspendGuest/{id}', [AdminController::class, 'unsuspendGuest']);
        Route::put('suspendGuest/{id}', [AdminController::class, 'suspendGuest']);
        Route::delete('deleteGuest/{id}', [AdminController::class, 'deleteGuest']);
        
        Route::get('/reporthosthome', [ReportController::class, 'index']);
        Route::get('/getUsersReports', [ReportController::class, 'getUsersReports']);
        Route::delete('/reporthosthome/{id}', [ReportController::class, 'destroy']);
        Route::delete('/destroyReportUser/{id}', [ReportController::class, 'destroyReportUser']);
    });
    
    
    Route::post('/reporthosthome', [ReportController::class, 'store']);
    Route::post('/reportUser', [ReportController::class, 'reportUser']);
    
    
    Route::post('createWishlist/{userid}', [UserController::class, 'createWishlist']);
    Route::get('userTips', [UserController::class, 'userTips']);
    Route::put('sendOtpForPhoneNumberChange', [UserController::class, 'sendOtpForPhoneNumberChange']);
    Route::post('/otp/verify', [UserController::class, 'verifyOtp']);
    Route::post('/otp/resend', [UserController::class, 'resendOtp']);
    Route::get('hostReview/{hostId}', [UserController::class, 'hostReview']);
    Route::get('guestReview/{guestId}', [UserController::class, 'guestReview']);
    Route::get('deactivateAccount', [UserController::class, 'deactivateAccount']);
    Route::get('transactionHistory', [UserController::class, 'transactionHistory']);
    Route::get('getUserWishlistContainersAndItems', [UserController::class, 'getUserWishlistContainersAndItems']);
    Route::delete('/deleteHostHome/{hostHomeId}', [HostHomeController::class, 'deleteHostHome']);
    Route::get('/searchHomeByProperty_type/{property_type}', [HostHomeController::class, 'searchHomeByProperty_type']);
    Route::delete('/deleteHostHostHomeImages/{hostHomephotoId}', [HostHomeController::class, 'deleteHostHostHomeImages']);
    Route::delete('/deleteReviews/{reviewId}', [ReviewController::class, 'deleteReviews']);
    Route::delete('/deleteHostPendingReviews/{id}', [ReviewController::class, 'deleteHostPendingReviews']);
    Route::delete('/deletesHostPendingReviewsForGuest/{id}', [ReviewController::class, 'deletesHostPendingReviewsForGuest']);
    Route::get('/getUserHostHomes', [HostHomeController::class, 'getUserHostHomes']);

    
    
    Route::post('/payment/initiate-multiple/{hosthomeid}/{userid}', [BookingsController::class, 'bookApartment']);
    Route::post('/createCancelTrips', [BookingsController::class, 'createCancelTrips']);
    Route::get('/getAllBookingDates', [BookingsController::class, 'getAllBookingDates']);
    Route::get('/sendMoney', [BookingsController::class, 'sendMoney']);
    Route::get('/listBanks', [BookingsController::class, 'listBanks']);
    Route::get('/getUserInfoByAccountNumber/{accountnumber}/{bankName}', [BookingsController::class, 'getUserInfoByAccountNumber']);
    Route::get('/getPendingReviews', [ReviewController::class, 'getPendingReviews']);
    Route::get('/getHostReviews', [ReviewController::class, 'getHostReviews']);
    Route::get('/getHostPendingReviewsForGuest', [ReviewController::class, 'getHostPendingReviewsForGuest']);
    Route::get('/getHostPendingReviews', [ReviewController::class, 'getHostPendingReviews']);
    Route::group(['prefix' => 'chat','as' => 'chat.'], function(){
        Route::get('/{receiverId?}', [ChatController::class, 'index'])->name('index');
        Route::post('/{receiverId?}', [ChatController::class, 'store'])->name('store');
    });
    
    Route::post('/filterHomepageForAuthUser', [UserController::class, 'filterHomepage']);
    Route::get('/allReservation', [UserController::class, 'allReservation']);
    Route::post('/filterHostHomesDatesForAuthUser', [UserController::class, 'filterHostHomesDates']);
    Route::post('/createReviews', [ReviewController::class, 'createReviews']);
    Route::post('/createReviewsForguest', [ReviewController::class, 'createReviewsForguest']);
    Route::get('hosthomesForAuthUser', [HostHomeController::class, 'index']);
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

Route::get('showGuestHome/{id}', [HostHomeController::class, 'showGuestHome']);
Route::post('/filterHomepageForUnAuthUser', [UserController::class, 'filterHomepage']);
Route::post('/filterHostHomesDatesForUnAuthUser', [UserController::class, 'filterHostHomesDates']);
Route::get('hosthomesForUnAuthUser', [HostHomeController::class, 'index']);
