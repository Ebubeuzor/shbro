<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class PasswordRequirements implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        $uppercase = preg_match('/[A-Z]/', $value);
        $numeric = preg_match('/[0-9]/', $value);
        $specialChar = preg_match('/[^A-Za-z0-9]/', $value);

        return $uppercase && $numeric && $specialChar;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'The password must contain at least one uppercase letter, one numeric digit, and one special character.';
    }
}
