<?php

namespace App\Otp;

use App\Models\User;
use SadiqSalau\LaravelOtp\Contracts\OtpInterface as Otp;

class UserUpdateNumberOtp implements Otp
{
    /**
     * Constructs Otp class
     */
    // protected string $name;
    // protected string $email;
    // protected string $password;
    public function __construct(
        protected string $id,
        protected string $phone_number
    )
    {
        
    }

    /**
     * Processes the Otp
     *
     * @return mixed
     */
    public function process()
    {
        $user = User::find($this->id);
        $user->update([
            'phone' => $this->phone_number
        ]);

        return response("OTP sent successfully");
    }
}
