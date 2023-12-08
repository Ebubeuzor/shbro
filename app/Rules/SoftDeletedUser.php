<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use App\Models\User;

class SoftDeletedUser implements Rule
{
    public function passes($attribute, $value)
    {
        return User::withTrashed()->where('email', $value)->exists();
    }

    public function message()
    {
        return 'Your account is temporarily suspended.';
    }
}
