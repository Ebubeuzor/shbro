<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FilterHostHomesDatesRequest extends FormRequest
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
            'allow_pets' => 'nullable|string|in:allow_pets,no_pets', // Update this line
        ];
    }
}
