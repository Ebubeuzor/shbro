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
            'hosthomephotos' => ['array', 'min:5', function ($attribute, $value, $fail) {
                if (!$this->isArrayOfBase64Images($value)) {
                    $fail('The ' . $attribute . ' must be an array of valid base64 encoded images.');
                }
            }],
            'hosthomevideo' => ['nullable', function ($attribute, $value, $fail) {
                if (!$this->isBase64($value)) {
                    $fail('The ' . $attribute . ' must be a valid base64 encoded value.');
                }
            }],
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
