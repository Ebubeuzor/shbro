<?php

namespace App\Otp;

use SadiqSalau\LaravelOtp\Contracts\OtpInterface as Otp;

class PasswordResetOtp implements Otp
{
    /**
     * Constructs Otp class
     */
    public function __construct(
        private $email 
    )
    {
        //
    }

    /**
     * Processes the Otp
     *
     * @return mixed
     */
    public function process()
    {
        
    }
}
