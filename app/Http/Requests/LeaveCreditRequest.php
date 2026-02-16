<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LeaveCreditRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'leave_type_id' => 'required|exists:leave_types,id',
            'year' => 'required|integer|min:2000|max:2100',
            'total_days' => 'required|numeric|min:0|max:365',
            'notes' => 'nullable|string|max:500',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'leave_type_id.required' => 'The leave type is required.',
            'leave_type_id.exists' => 'The selected leave type does not exist.',
            'year.required' => 'The year is required.',
            'year.integer' => 'The year must be a valid integer.',
            'total_days.required' => 'Total days is required.',
            'total_days.min' => 'Total days cannot be negative.',
            'total_days.max' => 'Total days cannot exceed 365.',
        ];
    }
}

