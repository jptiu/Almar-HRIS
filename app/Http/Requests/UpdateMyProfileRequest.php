<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMyProfileRequest extends FormRequest
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
        $user = $this->user();

        return [
            // Personal info
            'first_name' => 'nullable|string|max:100',
            'middle_name' => 'nullable|string|max:100',
            'last_name' => 'nullable|string|max:100',
            'phone' => 'nullable|string|max:20',

            // Address
            'address_line_1' => 'nullable|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',

            // User credentials
            'email' => [
                'nullable',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'password' => 'nullable|string|min:8',
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
            'first_name.max' => 'The first name cannot exceed 100 characters.',
            'last_name.max' => 'The last name cannot exceed 100 characters.',
            'middle_name.max' => 'The middle name cannot exceed 100 characters.',
            'address_line_1.max' => 'Address line 1 cannot exceed 255 characters.',
            'address_line_2.max' => 'Address line 2 cannot exceed 255 characters.',
            'city.max' => 'The city cannot exceed 100 characters.',
            'state.max' => 'The state cannot exceed 100 characters.',
            'postal_code.max' => 'The postal code cannot exceed 20 characters.',
            'country.max' => 'The country cannot exceed 100 characters.',
            'phone.max' => 'The phone number cannot exceed 20 characters.',
            'email.email' => 'Please provide a valid email address.',
            'email.unique' => 'This email is already taken.',
            'password.min' => 'The password must be at least 8 characters.',
        ];
    }
}

