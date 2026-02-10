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
        $positionId = $this->route('id');
        $departmentId = $this->input('department_id');
        $positionLevelId = $this->input('position_level_id');
        
        return [
            'department_id' => 'required|exists:departments,id',
            'title' => [
                'required',
                'string',
                'max:150',
                Rule::unique('positions')->where(function ($query) use ($departmentId, $positionLevelId) {
                    return $query->where('department_id', $departmentId)
                        ->whereRaw('LOWER(title) = ?', [strtolower($this->title)])
                        ->where('position_level_id', $positionLevelId);
                })->ignore($positionId)
            ],
            'position_level_id' => 'nullable|exists:position_levels,id',
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
            'position_level_id.exists' => 'The specified position level does not exist.',
        ];
    }
}


