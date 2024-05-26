<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHostHomeRequest extends FormRequest
{
    
    public function authorize()
    {
        return true;
    }

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
            'amenities' => "array",
            'hosthomephotos' => "array",
            'hosthomevideo' => [
                'required'],
            'title' => "required",
            'hosthomedescriptions' => "required | array",
            'description' => "required",
            'reservation' => "required",
            'reservations' => "array",
            'price' => "nullable |numeric",
            'discounts' => "array",
            'rules' => "array",
            'additionalRules' => "string",
            'host_type' => "required",
            'notice' => "array",
            'checkin' => "required ",
            'check_out_time' => "required ",
            'cancelPolicy' => "required",
            'securityDeposit' => "required",
        ];
    }
}
