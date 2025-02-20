<?php

namespace App\Http\Requests;

use App\Rules\BannedEmail;
use App\Rules\EmailExistsAsGuest;
use App\Rules\PasswordRequirements;
use App\Rules\SoftDeletedUser;
use Illuminate\Foundation\Http\FormRequest;

class SignupRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'name' => [
                'required',
                function ($attribute, $value, $fail) {
                    $names = explode(' ', $value);
        
                    if (count($names) !== 2) {
                        $fail('The name field must contain two names separated by a space.
                        Your first and last name
                        ');
                    }
                },
            ],
            'email' => ['required', 'email', new BannedEmail, new EmailExistsAsGuest],
            'password' => ['required','min:6','max:255', new PasswordRequirements],
            'role' => 'nullable',
            'hostremtoken' => 'nullable',
            'hostid' => 'nullable',
            'encrptedCoHostemail' => 'nullable',
            'mobileRequest' => 'nullable|boolean',
        ];
    }
}
