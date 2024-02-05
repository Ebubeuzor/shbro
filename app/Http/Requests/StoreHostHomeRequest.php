<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreHostHomeRequest extends FormRequest
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
            'property_type' => "required",
            'guest_choice' => "required",
            'address' => "required",
            'guest' => "required",
            'bedrooms' => "required",
            'beds' => "required",
            'bathrooms' => "required",
            'amenities' => "required | array",
            'hosthomephotos' => "required | array | min:5",
            'hosthomevideo' => [
                'required'],
            'title' => "required",
            'hosthomedescriptions' => "required|array| min:2",
            'description' => "required",
            'reservation' => "required",
            'reservations' => "required | array",
            'price' => "required|numeric",
            'discounts' => "required | array",
            'rules' => "required | array",
            'additionalRules' => "string",
            'host_type' => "required",
            'notice' => "required | array",
            'checkin' => "required ",
            'check_out_time' => "required ",
            'cancelPolicy' => "required",
            'securityDeposit' => "required|numeric",
        ];
    }
}
