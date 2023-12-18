<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class SoftDeletedUser implements Rule
{
    public function passes($attribute, $value)
    {
        $user = User::withTrashed()->where('email', $value)->first();

        if ($user) {
            return !$user->trashed();
        } else {
            
            return true; 
        }
    }

    public function message()
    {
        return 'Your account is temporarily suspended.';
    }
}
