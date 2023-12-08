<?php

namespace App\Http\Controllers\Auth;

use App\Events\EmailVerified;
use App\Http\Controllers\Controller;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;

class EmailVerificationController extends Controller
{
    public function verify(EmailVerificationRequest $request)
    {
        $request->fulfill();

        // Assuming you want to dispatch the EmailVerified event here
        event(new EmailVerified($request->user()));

        if ($response = $this->verified($request)) {
            return $response;
        }

        return redirect($this->redirectPath())->with('verified', true);
    }

    /**
     * The user has been successfully verified.
     *
     * @param \Illuminate\Http\Request $request
     * @return mixed
     */
    protected function verified(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            throw new AuthorizationException('Already verified.');
        }

        if ($request->user()->markEmailAsVerified()) {
            event(new Verified($request->user()));
        }

        return response(['message' => 'Email verified.']);
    }
}
