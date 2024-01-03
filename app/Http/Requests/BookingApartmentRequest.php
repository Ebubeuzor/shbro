<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BookingApartmentRequest extends FormRequest
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
            'adults' => 'required',
            'children' => 'required',
            'pets' => 'required',
            'infants' => 'required',
            'check_in' => 'required',
            'check_out' => 'required',
            'option' => 'required',
            'card_number' => 'number',
            'expiry_data' => 'number',
            'CVV' => 'number | min:4 | max:4',
        ];
    }
}
