<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Facades\DB;

class SuspendEmail implements Rule
{
    
    public function passes($attribute, $value)
    {
        return !DB::table('users')->where('email', $value)->whereNotNull('suspend')->exists();
    }

    public function message()
    {
        return 'The provided email has been suspended.';
    }

}
