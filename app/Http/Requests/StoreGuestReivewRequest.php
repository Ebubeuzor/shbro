<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreGuestReivewRequest extends FormRequest
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
            'pendingreviewid' => 'required',
            'ratings' => 'required',
            'bookingid' => 'required',
            'title' => 'required',
            'host_id' => 'required',
            'comment' => 'required',
            'guest_id' => 'required',
        ];
    }
}
