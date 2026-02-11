<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DepartmentRequest extends FormRequest
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
        $departmentId = $this->route('id');
        
        return [
            'name' => [
                'required',
                'string',
                'max:150',
                Rule::unique('departments')->where(function ($query) {
                    return $query->whereRaw('LOWER(name) = ?', [strtolower($this->name)])
                        ->when($this->company_id, function ($q) {
                            return $q->where('company_id', $this->company_id);
                        });
                })->ignore($departmentId)
            ],
            'description' => 'nullable|string|max:1000',
            'company_id' => 'nullable|exists:companies,id',
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
            'name.required' => 'The department name is required.',
            'name.unique' => 'A department with this name already exists.',
            'name.max' => 'The department name cannot exceed 150 characters.',
        ];
    }
}

