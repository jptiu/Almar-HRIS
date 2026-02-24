<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AttendanceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules for request body.
     */
    public function rules(): array
    {
        return [
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'notes' => 'nullable|string|max:1000',
        ];
    }

    /**
     * Validate required headers.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {

            $timezone = $this->header('X-Timezone');

            if (!$timezone) {
                $validator->errors()->add('timezone', 'X-Timezone header is required.');
                return;
            }

            if (!in_array($timezone, timezone_identifiers_list())) {
                $validator->errors()->add('timezone', 'Invalid timezone provided.');
            }
        });
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [
            'latitude.numeric' => 'Latitude must be a valid number.',
            'latitude.between' => 'Latitude must be between -90 and 90.',
            'longitude.numeric' => 'Longitude must be a valid number.',
            'longitude.between' => 'Longitude must be between -180 and 180.',
            'notes.string' => 'Notes must be a valid string.',
            'notes.max' => 'Notes cannot exceed 1000 characters.',
        ];
    }
}