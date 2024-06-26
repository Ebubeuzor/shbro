<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreWishlistRequest extends FormRequest
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
            "containername" => 'nullable| string',
            'wishcontainerid' => 'nullable| exists:App\Models\Wishlistcontainer,id',
            'hosthomeid' => 'nullable| exists:App\Models\HostHome,id',
        ];
    }
}
