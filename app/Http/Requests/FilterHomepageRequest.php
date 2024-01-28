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
            'min_price' => 'required',
            'max_price' => 'required',
            'bedrooms' => 'nullable',
            'beds' => 'nullable',
            'bathrooms' => 'nullable',
            'property_type' => 'nullable | array',
            'amenities' => 'nullable | array',
        ];
    }
}
