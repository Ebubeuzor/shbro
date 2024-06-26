<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StartConversationRequest extends FormRequest
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
            'message' => 'nullable',
            'image' => 'nullable',
            'status' => 'nullable',
            'recipient_id' => 'nullable',
            'chat_session_id' => 'nullable',
            'email' => 'nullable',
            'name' => 'nullable',
            'token' => 'nullable',
        ];
    }
}
