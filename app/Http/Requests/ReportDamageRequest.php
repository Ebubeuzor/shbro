<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReportDamageRequest extends FormRequest
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
            "description" => 'required',
            "booking_number" => 'required',
            "photos" => 'required | array',
            "video" => 'required | array',
        ];
    }
}
