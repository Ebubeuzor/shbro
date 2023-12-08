<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserDetailsUpdateRequest extends FormRequest
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
            'firstName' => 'string',
            'lastName' => 'string',
            'phone' => 'string',
            'email' => 'unique:users,email',
            'government_id' => 'string',
            'live_photo' => 'string',
            'country' => 'string',
            'street' => 'string',
            'emergency_no' => 'string',
            'zipCode' => 'string',
            'state' => 'string',
            'city' => 'string',
            'status' => 'string',
        ];
    }
}
