<?php

use App\Http\Controllers\Api\BookingsController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ForgotPassword;
use App\Http\Controllers\VerificationController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

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


// Route::match(['get', 'post'],'/rave/callback/{userid},{usertoken},{hosthomeid}', [BookingsController::class, 'callback'])->name('callback');

Route::get('/verify/{token}', [VerificationController::class, 'verifyEmail'])->name('verifyEmailOrActivateAccount');

Route::get('/email/verify', function () {
    return view('auth.verify-email');
})->name('verification.notice');

Route::get('/reset-password', [ForgotPassword::class, 'returnView'])->name('password.reset');

Route::post('/resetPassword', [ForgotPassword::class, 'resetPassword'])->name('changePassword'); 

