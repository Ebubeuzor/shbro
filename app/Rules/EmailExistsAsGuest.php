<?php

namespace App\Rules;

use App\Models\User;
use Illuminate\Contracts\Validation\Rule;

class EmailExistsAsGuest implements Rule
{

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        $existingUserGuest = User::where('email', $value)->whereNotNull('is_guest')->exists();
        $existingUser = User::where('email', $value)->exists();
        if (!$existingUser) {
           return true;
        }elseif ($existingUserGuest) {
            return true;
        }else {
            return false;
        }
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'The provided email already exists';
    }
}
