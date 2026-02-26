<?php

namespace App\Http\Requests;

use App\Models\EmployeeProbationDetail;
use App\Models\EmployeeStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class EmployeeRequest extends FormRequest
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
        $employeeId = $this->route('id');
        
        return [
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'middle_name' => 'nullable|string|max:100',
            'address_line_1' => 'nullable|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'phone' => 'nullable|string|max:20',
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users')->ignore($employeeId ? DB::table('employees')->where('id', $employeeId)->value('user_id') : null),
            ],
            'password' => $this->isMethod('POST') ? 'nullable|string|min:8' : 'nullable|string|min:8',
            'company_id' => 'required|exists:companies,id',
            'branch_id' => 'nullable|exists:branches,id',
            'position_id' => 'nullable|exists:positions,id',
            'hire_date' => 'nullable|date',
            'birthdate' => 'nullable|date',
            'employee_status_id' => 'nullable|exists:employee_statuses,id',
            'base_salary' => 'nullable|numeric|min:0',
            'is_manager' => 'nullable|boolean',
            'manager_id' => 'nullable|exists:employees,id',

            // Probation details (conditionally required when status is Probationary)
            'probation_start_date' => 'nullable|date',
            'probation_end_date' => 'nullable|date|after_or_equal:probation_start_date',
            'performance_criteria' => 'nullable|string',
            'probation_status' => 'nullable|in:' . implode(',', EmployeeProbationDetail::getStatuses()),
            'probation_notes' => 'nullable|string',
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
            'first_name.required' => 'The first name is required.',
            'first_name.max' => 'The first name cannot exceed 100 characters.',
            'last_name.required' => 'The last name is required.',
            'last_name.max' => 'The last name cannot exceed 100 characters.',
            'address_line_1.max' => 'Address line 1 cannot exceed 255 characters.',
            'address_line_2.max' => 'Address line 2 cannot exceed 255 characters.',
            'city.max' => 'The city cannot exceed 100 characters.',
            'state.max' => 'The state cannot exceed 100 characters.',
            'postal_code.max' => 'The postal code cannot exceed 20 characters.',
            'country.max' => 'The country cannot exceed 100 characters.',
            'phone.max' => 'The phone number cannot exceed 20 characters.',
            'email.required' => 'The email address is required.',
            'email.email' => 'Please provide a valid email address.',
            'email.unique' => 'A user with this email already exists.',
            'password.required' => 'The password is required.',
            'password.min' => 'The password must be at least 8 characters.',
            'company_id.required' => 'The company ID is required.',
            'company_id.exists' => 'The specified company does not exist.',
            'branch_id.exists' => 'The specified branch does not exist.',
            'position_id.exists' => 'The specified position does not exist.',
            'hire_date.date' => 'Please provide a valid date for hire date.',
            'employee_status_id.exists' => 'The selected employee status does not exist.',
            'base_salary.numeric' => 'The base salary must be a number.',
            'base_salary.min' => 'The base salary must be at least 0.',
            'manager_id.exists' => 'The specified manager does not exist.',
        ];
    }

    /**
     * Configure the validator instance.
     */
    protected function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // Check branch belongs to company if both are provided
            if ($this->branch_id && $this->company_id) {
                $branchExists = DB::table('branches')
                    ->where('id', $this->branch_id)
                    ->where('company_id', $this->company_id)
                    ->exists();

                if (!$branchExists) {
                    $validator->errors()->add('branch_id', 'The selected branch does not belong to the specified company.');
                }
            }

            // Check if employee_status_id is Probationary and validate probation dates
            if ($this->employee_status_id) {
                $probationaryStatus = EmployeeStatus::find($this->employee_status_id);
                
                if ($probationaryStatus && $probationaryStatus->name === 'Probationary') {
                    // Probation start date is required when status is Probationary
                    if (!$this->probation_start_date) {
                        $validator->errors()->add('probation_start_date', 'Probation start date is required for Probationary employees.');
                    }
                    
                    // Probation end date is required when status is Probationary
                    if (!$this->probation_end_date) {
                        $validator->errors()->add('probation_end_date', 'Probation end date is required for Probationary employees.');
                    }
                }
            }
        });
    }
}

