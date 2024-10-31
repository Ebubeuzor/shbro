<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Exception;

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
        try {
            // You can add authorization logic here
            return true;
        } catch (Exception $e) {
            Log::error('Authorization failed in StoreHostHomeRequest: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        try {
            return [
                'property_type' => "required|string|max:255",
                'guest_choice' => "required|string|max:255",
                'address' => "required|string|max:255",
                'guest' => "required|integer|min:1",
                'bedrooms' => "required|integer|min:1",
                'beds' => "required|integer|min:1",
                'bathrooms' => "required|numeric|min:0.5",
                'amenities' => "required|array|min:1",
                'amenities.*' => "string|max:255",
                'hosthomephotos' => "required|array|min:5",
                'hosthomephotos.*' => 'file|mimes:jpeg,png,jpg,webp|max:10240', // 10MB max
                'hosthomevideo' => ['required', 'file', 'mimes:mp4,mov,avi|max:102400'], // 100MB max
                'title' => "required|string|max:255",
                'hosthomedescriptions' => "required|array|min:2",
                'hosthomedescriptions.*' => "string|max:1000",
                'description' => "required|string|max:5000",
                'reservation' => "required|string|max:255",
                'reservations' => "required|array",
                'reservations.*' => "string|max:255",
                'price' => "required|numeric|min:0",
                'discounts' => "required|array",
                'discounts.*' => "numeric|min:0|max:100",
                'rules' => "required|array",
                'rules.*' => "string|max:1000",
                'additionalRules' => "nullable|string|max:5000",
                'notice' => "required|array",
                'notice.*' => "string|max:255",
                'checkin' => "required|string",
                'check_out_time' => "required|string",
                'cancelPolicy' => "required|string|max:255",
                'longitude' => "required|numeric|between:-180,180",
                'latitude' => "required|numeric|between:-90,90",
                'securityDeposit' => "required|numeric|min:0",
            ];
        } catch (Exception $e) {
            Log::error('Error in rules method: ' . $e->getMessage());
            throw new HttpResponseException(response()->json([
                'message' => 'Error processing validation rules',
                'errors' => ['system' => ['An unexpected error occurred']]
            ], 500));
        }
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'hosthomephotos.min' => 'Please upload at least 5 photos of your property',
            'hosthomephotos.*.mimes' => 'Photos must be in JPEG, PNG, or JPG format',
            'hosthomephotos.*.max' => 'Each photo must not exceed 10MB',
            'hosthomevideo.required' => 'Please upload a video of your property',
            'hosthomevideo.mimes' => 'Video must be in MP4, MOV, or AVI format',
            'hosthomevideo.max' => 'Video must not exceed 100MB',
            'longitude.between' => 'Invalid longitude value',
            'latitude.between' => 'Invalid latitude value',
            // Add more custom messages as needed
        ];
    }

    /**
     * Configure the validator instance.
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    public function withValidator($validator)
    {
        try {
            $validator->after(function ($validator) {
                $this->validateFileTypes($validator);
                $this->validateFileContents($validator);
            });
        } catch (Exception $e) {
            Log::error('Error in withValidator: ' . $e->getMessage());
            throw new HttpResponseException(response()->json([
                'message' => 'Error processing validation',
                'errors' => ['system' => [$e->getMessage()]]
            ], 500));
        }
    }

    /**
     * Validate file types and sizes
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    protected function validateFileTypes($validator)
    {
        try {
            if ($this->hasFile('hosthomevideo')) {
                $video = $this->file('hosthomevideo');
                if (!in_array($video->getMimeType(), ['video/mp4', 'video/quicktime', 'video/x-msvideo'])) {
                    $validator->errors()->add('hosthomevideo', 'Invalid video format');
                }
            }

            if ($this->hasFile('hosthomephotos')) {
                foreach ($this->file('hosthomephotos') as $photo) {
                    if (!in_array($photo->getMimeType(), ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'])) {
                        $validator->errors()->add('hosthomephotos', 'Invalid image format detected');
                        break;
                    }
                }
            }
        } catch (Exception $e) {
            Log::error('Error validating file types: ' . $e->getMessage());
            throw new HttpResponseException(response()->json([
                'message' => 'Error validating files',
                'errors' => ['files' => [$e->getMessage()]]
            ], 422));
        }
    }

    /**
     * Additional validation for file contents
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    protected function validateFileContents($validator)
    {
        try {
            // Add any additional file content validation logic here
            // For example, checking image dimensions, video duration, etc.
        } catch (Exception $e) {
            Log::error('Error validating file contents: ' . $e->getMessage());
            throw new HttpResponseException(response()->json([
                'message' => 'Error validating file contents',
                'errors' => ['files' => [$e->getMessage()]]
            ], 422));
        }
    }

    /**
     * Hook to be called before validation.
     */
    protected function prepareForValidation()
    {
        try {
            $this->startTime = microtime(true);
            
            // Clean and prepare input data
            if ($this->has('price')) {
                $this->merge([
                    'price' => filter_var($this->input('price'), FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION)
                ]);
            }

            if ($this->has('securityDeposit')) {
                $this->merge([
                    'securityDeposit' => filter_var($this->input('securityDeposit'), FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION)
                ]);
            }
        } catch (Exception $e) {
            Log::error('Error in prepareForValidation: ' . $e->getMessage());
            throw new HttpResponseException(response()->json([
                'message' => 'Error preparing validation',
                'errors' => ['system' => [$e->getMessage()]]
            ], 500));
        }
    }

    /**
     * Hook to be called after validation.
     */
    protected function passedValidation()
    {
        try {
            $endTime = microtime(true);
            $executionTime = $endTime - $this->startTime;
            Log::info('Validation time for StoreHostHomeRequest: ' . $executionTime . ' seconds');
        } catch (Exception $e) {
            Log::error('Error in passedValidation: ' . $e->getMessage());
            // Don't throw exception here as validation has already passed
        }
    }

    /**
     * Handle a failed validation attempt.
     *
     * @param  \Illuminate\Contracts\Validation\Validator  $validator
     * @return void
     *
     * @throws \Illuminate\Validation\HttpResponseException
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'message' => 'Validation failed',
            'errors' => $validator->errors()
        ], 422));
    }
}