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
            'property_type' => "required | max:255",
            'guest_choice' => "required | max:255",
            'address' => "required | max:255",
            'guest' => "required | max:255",
            'bedrooms' => "required | max:255",
            'beds' => "required | max:255",
            'bathrooms' => "required | max:255",
            'amenities' => "array",
            'hosthomephotos' => "nullable | array",
            'hosthomephotos.*' => 'file',
            'hosthomevideo' => "nullable | file",
            'title' => "required | max:255",
            'hosthomedescriptions' => "required | max:255 | array",
            'description' => "required | max:255",
            'reservation' => "required | max:255",
            'reservations' => "array",
            'price' => "nullable |numeric",
            'discounts' => "array",
            'rules' => "array",
            'additionalRules' => "string | max:255",
            'notice' => "array",
            'checkin' => "required ",
            'check_out_time' => "required ",
            'cancelPolicy' => "required | max:255",
            'securityDeposit' => "required",
        ];
    }

    
    protected function isArrayOfBase64Images($value)
    {
        // Define a regex pattern for the base64 data URI of images
        $pattern = '/^data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+\/=]+$/';

        // Ensure the value is an array
        if (!is_array($value)) {
            return false;
        }

        // Check for excessive sizes
        foreach ($value as $item) {
            if (strlen(base64_decode(substr($item, strpos($item, ',') + 1))) > 5 * 1024 * 1024) { // Example: 5 MB
                return false;
            }
        }

        // Validate each item in the array
        foreach ($value as $item) {
            if (!preg_match($pattern, $item)) {
                return false;
            }
        }

        return true;
    }
    
    protected function isBase64($value)
    {
        // Define a regex pattern for the base64 data URI
        $pattern = '/^data:video\/mp4;base64,[A-Za-z0-9+\/=]+$/';

        // Check if the value matches the pattern
        return preg_match($pattern, $value);
    }
}
