<?php

use App\Events\NewEvent;
use App\Http\Controllers\Api\BookingsController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ForgotPassword;
use App\Http\Controllers\Api\HostHomeController;
use App\Http\Controllers\VerificationController;
use App\Mail\NotificationMail;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::get('/event', function () {
    NewEvent::dispatch(request()->msg);

    return 'Message sent!';
});

Route::get('/test', function () {
    return view('test');
});

Route::get('/admin', function () {
    return view('admin');
});

Route::get('/guest', function () {
    return view('guest');
});

Route::get('/payment/callback', [BookingsController::class, 'callback'])->name('callback');

Route::get('/verify/{token}/{mobileRequest?}', [VerificationController::class, 'verifyEmail'])->name('verifyEmailOrActivateAccount');

Route::get('/becomeACoHost/{userId}/{hostid}', [HostHomeController::class, 'becomeACoHost'])->name('becomeACoHost');
Route::get('/approveHomeForHost/{hostid}/{hosthomeid}', [HostHomeController::class, 'approveHomeForHost'])->name('approveHomeForHost');
Route::get('/disapproveHomeForHost/{hostid}/{hosthomeid}', [HostHomeController::class, 'disapproveHomeForHost'])->name('disapproveHomeForHost');

Route::get('/approveDeleteHomeForHost/{hostid}/{hosthomeid}', [HostHomeController::class, 'approveDeleteHomeForHost'])->name('approveDeleteHomeForHost');
Route::get('/disapproveDeleteHomeForHost', [HostHomeController::class, 'disapproveDeleteHomeForHost'])->name('disapproveDeleteHomeForHost');

Route::get('/email/verify', function () {
    return view('auth.verify-email');
})->name('verification.notice');

Route::get('/reset-password', [ForgotPassword::class, 'returnView'])->name('password.reset');

Route::post('/resetPassword', [ForgotPassword::class, 'resetPassword'])->name('changePassword'); 

Route::get('/successful', [BookingsController::class, 'successful'])->name('successPage');
Route::get('/cancelled', [BookingsController::class, 'cancelled'])->name('cancelledPage');
Route::get('/failed', [BookingsController::class, 'failed'])->name('failedPage');

Route::get('myjsfile', function () {
    $file = public_path('build/assets/app-c0a5b4ad.js');
    
    // Set the headers
    $headers = [
        'Content-Type' => 'application/javascript',
        'Access-Control-Allow-Origin' => '*', // Adjust this according to your needs
        'Access-Control-Allow-Methods' => 'GET, POST', // Adjust this according to your needs
        'Access-Control-Allow-Headers' => 'Content-Type', // Adjust this according to your needs
    ];

    // Open the file for reading
    $handle = fopen($file, 'rb');

    // Return the response with streamed content and headers
    return response()->stream(
        function () use ($handle) {
            fpassthru($handle);
        },
        200,
        $headers
    );
})->name('javascript.file');


Route::get('/send-test-email', function () {
    $recipient = 'nctest@namecheap.com';
    $subject = 'Test Email';
    $message = 'This is a test email.';

    Mail::raw($message, function ($mail) use ($recipient, $subject) {
        $mail->to($recipient)->subject($subject);
    });

    return 'Test email sent!';
});


Route::get('/{any}', function () {
    return file_get_contents(public_path('index.html'));
})->where('any', '.*');