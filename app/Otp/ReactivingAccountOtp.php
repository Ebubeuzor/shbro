<?php

namespace App\Otp;

use App\Models\User;
use SadiqSalau\LaravelOtp\Contracts\OtpInterface as Otp;

class ReactivingAccountOtp implements Otp
{
    /**
     * Constructs Otp class
     */
    public function __construct(
        protected string $email
    )
    {
        
    }

    public function process()
    {
        $user = User::where('email',$this->email)->first();
        $user->is_active = true;
        $user->save();

        if ($user->host) {
            $softDeletedHostHomes = $user->hosthomes()->onlyTrashed()->get();
            
            foreach ($softDeletedHostHomes as $hostHome) {
                $hostHome->restore();
            }
        }
    }
}
