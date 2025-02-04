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
            'property_type' => "required | max:255",
            'guest_choice' => "required | max:255",
            'address' => "required | max:255",
            'guest' => "required | max:255",
            'bedrooms' => "required | max:255",
            'beds' => "required | max:255",
            'bathrooms' => "required | max:255",
            'amenities' => "required | array",
            'hosthomephotos' => "required | array | min:5",
            'hosthomephotos.*' => 'file',
            'hosthomevideo' => ['required', 'file'],
            'title' => "required | max:255",
            'hosthomedescriptions' => "required|array| min:2",
            'description' => "required",
            'reservation' => "required  | max:255",
            'reservations' => "required | array",
            'price' => "required|numeric",
            'discounts' => "required | array",
            'rules' => "required | array",
            'additionalRules' => "string",
            'notice' => "required | array",
            'checkin' => "required ",
            'check_out_time' => "required ",
            'cancelPolicy' => "required | max:255",
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

}
