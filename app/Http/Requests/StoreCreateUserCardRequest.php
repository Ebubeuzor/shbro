<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCreateUserCardRequest extends FormRequest
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
            "card_number" => 'required | unique:user_cards,card_number',
            "expiry_data" => 'required | min:4 | max:4',
            "CVV" => 'required | min:3 | max:3',
        ];
    }
}
