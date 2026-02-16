<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LeaveTypeRequest extends FormRequest
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
        $leaveTypeId = $this->route('leave_type');

        return [
            'name' => 'required|string|max:100|unique:leave_types,name,' . $leaveTypeId,
            'description' => 'nullable|string|max:500',
            'default_days' => 'required|integer|min:0|max:365',
            'is_active' => 'nullable|boolean',
            'requires_approval' => 'nullable|boolean',
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
            'name.required' => 'The leave type name is required.',
            'name.unique' => 'A leave type with this name already exists.',
            'default_days.required' => 'The default days is required.',
            'default_days.min' => 'Default days cannot be negative.',
            'default_days.max' => 'Default days cannot exceed 365.',
        ];
    }
}

