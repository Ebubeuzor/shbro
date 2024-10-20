<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;

class StoreHostHomeRequest extends FormRequest
{
    protected $startTime;
    
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
            'hosthomevideo' => ['required', function ($attribute, $value, $fail) {
                if (!$this->isBase64($value)) {
                    $fail('The ' . $attribute . ' must be a valid base64 encoded value.');
                }
            }],
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
            'longitude' => "required",
            'latitude' => "required",
            'securityDeposit' => "required|numeric",
        ];
    }

    /**
     * Hook to be called before validation.
     */
    protected function prepareForValidation()
    {
        // Start timing
        $this->startTime = microtime(true);
    }

    /**
     * Hook to be called after validation.
     */
    protected function passedValidation()
    {
        // End timing and log duration
        $endTime = microtime(true);
        $executionTime = $endTime - $this->startTime;
        Log::info('Validation time for StoreHostHomeRequest: ' . $executionTime . ' seconds');
    }

    protected function isBase64($value)
    {
        // Define a regex pattern for the base64 data URI that accepts various video formats
        $pattern = '/^data:video\/(?:mp4|webm|hevc|ogg|avi|mov|quicktime|wmv|flv|mkv);base64,[A-Za-z0-9+\/=]+$/';
    
        // Check if the value matches the pattern
        return preg_match($pattern, $value) === 1;
    }
}
