<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PositionRequest extends FormRequest
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
        $positionId = $this->route('position')?->id;
        $departmentId = $this->input('department_id');
        
        return [
            'department_id' => 'required|exists:departments,id',
            'title' => [
                'required',
                'string',
                'max:150',
                Rule::unique('positions')->where(function ($query) use ($departmentId) {
                    return $query->where('department_id', $departmentId)
                        ->whereRaw('LOWER(title) = ?', [strtolower($this->title)]);
                })->ignore($positionId)
            ],
            'level' => 'nullable|string|max:50',
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
            'department_id.required' => 'The department ID is required.',
            'department_id.exists' => 'The specified department does not exist.',
            'title.required' => 'The position title is required.',
            'title.max' => 'The position title cannot exceed 150 characters.',
            'level.max' => 'The position level cannot exceed 50 characters.',
        ];
    }
}

