<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FilterHomepageRequest extends FormRequest
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
            'address' => 'nullable|string',
            'start_date' => 'nullable|date_format:Y-m-d',
            'end_date' => 'nullable|date_format:Y-m-d',
            'guests' => 'nullable|integer|min:0',
            'allow_pets' => 'nullable|string|in:allow_pets,no_pets',
            'min_price' => 'nullable|numeric|min:0',
            'max_price' => 'nullable|numeric|min:0',
            'bedrooms' => 'nullable|integer|min:0',
            'beds' => 'nullable|integer|min:0',
            'bathrooms' => 'nullable|integer|min:0',
            'property_type' => 'nullable|array',
            'property_type.*' => 'string', // Ensure each property type is a string
            'amenities' => 'nullable|array',
            'amenities.*' => 'string'
        ];
    }
}
