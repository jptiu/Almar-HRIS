<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LeaveRequestValidation extends FormRequest
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
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'nullable|string|max:1000',
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
            'start_date.required' => 'The start date is required.',
            'start_date.date' => 'Please provide a valid start date.',
            'start_date.after_or_equal' => 'Start date cannot be in the past.',
            'end_date.required' => 'The end date is required.',
            'end_date.date' => 'Please provide a valid end date.',
            'end_date.after_or_equal' => 'End date must be on or after the start date.',
            'reason.max' => 'Reason cannot exceed 1000 characters.',
        ];
    }

    /**
     * Configure the validator instance.
     */
    protected function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if ($this->has(['start_date', 'end_date'])) {
                $startDate = \Carbon\Carbon::parse($this->start_date);
                $endDate = \Carbon\Carbon::parse($this->end_date);
                $days = $endDate->diffInDays($startDate) + 1;

                if ($days > 365) {
                    $validator->errors()->add('end_date', 'Leave duration cannot exceed 365 days.');
                }
            }
        });
    }
}

