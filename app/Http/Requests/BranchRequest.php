<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BranchRequest extends FormRequest
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
        $branchId = $this->route('branch')?->id;
        $companyId = $this->input('company_id');
        
        return [
            'company_id' => 'required|exists:companies,id',
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('branches')->where(function ($query) use ($companyId) {
                    return $query->where('company_id', $companyId)
                        ->whereRaw('LOWER(name) = ?', [strtolower($this->name)]);
                })->ignore($branchId)
            ],
            'address' => 'required|string|max:500',
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
            'company_id.required' => 'The company ID is required.',
            'company_id.exists' => 'The specified company does not exist.',
            'name.required' => 'The branch name is required.',
            'address.required' => 'The branch address is required.',
        ];
    }
}

