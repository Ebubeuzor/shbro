<?php

namespace App\Http\Requests;

use App\Rules\BannedEmail;
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
            'name' => 'required',
            'email' => ['required ',' unique:users,email', new BannedEmail],
            'password' => ['required','min:6','max:255', new PasswordRequirements],
        ];
    }
}
