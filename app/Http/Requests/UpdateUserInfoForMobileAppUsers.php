<?php

namespace App\Http\Requests;

use App\Rules\BannedEmail;
use App\Rules\EmailExistsAsGuest;
use Illuminate\Foundation\Http\FormRequest;

class UpdateUserInfoForMobileAppUsers extends FormRequest
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
                'nullable',
                function ($attribute, $value, $fail) {
                    $names = explode(' ', $value);
        
                    if (count($names) !== 2) {
                        $fail('The name field must contain two names separated by a space.
                        Your first and last name
                        ');
                    }
                },
            ],
            'email' => ['nullable', 'email', new BannedEmail, new EmailExistsAsGuest],
            'emergency_no' => 'nullable|string',
            'profilePicture' => 'nullable|string',
            'speaks' => 'nullable|string',
            'country' => 'nullable|string',
            'street' => 'nullable|string',
            'zipcode' => 'nullable|string',
            'state' => 'nullable|string',
            'city' => 'nullable|string',
            'occupation' => 'nullable|string',
        ];
    }
}
