<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request)
    {
        $employee = $this->employee;

        // Check if the user is an admin (has no employee record or has 'admin' role)
        $isAdmin = !$employee || $this->roles->contains('name', 'admin');

        if ($isAdmin) {
            // Static/default data for admin users
            return [
                'id' => $this->id,
                'email' => $this->email,
                'is_active' => $this->is_active,
                'roles' => $this->roles->pluck('name'),

                'employee_id' => null,
                'first_name' => 'Admin',
                'middle_name' => null,
                'last_name' => 'User',
                'full_name' => 'Admin User',
                'phone' => null,
                'address_line_1' => null,
                'address_line_2' => null,
                'city' => null,
                'state' => null,
                'postal_code' => null,
                'country' => null,
                'birthdate' => null,
                'hire_date' => null,
                'base_salary' => null,

                'position' => 'Administrator',
                'position_level' => null,
                'department' => null,
                'company' => 'Company Admin',
                'branch' => null,
                'manager_id' => null,
                'employee_status' => 'Active',
            ];
        }

        // Regular employee mapping
        return [
            'id' => $this->id,
            'email' => $this->email,
            'is_active' => $this->is_active,
            'roles' => $this->roles->pluck('name'),

            'employee_id' => $employee?->id,
            'first_name' => $employee?->first_name,
            'middle_name' => $employee?->middle_name,
            'last_name' => $employee?->last_name,
            'full_name' => $employee
                ? trim($employee->first_name . ' ' . ($employee->middle_name ? $employee->middle_name . ' ' : '') . $employee->last_name)
                : null,
            'phone' => $employee?->phone,
            'address_line_1' => $employee?->address_line_1,
            'address_line_2' => $employee?->address_line_2,
            'city' => $employee?->city,
            'state' => $employee?->state,
            'postal_code' => $employee?->postal_code,
            'country' => $employee?->country,
            'birthdate' => $employee?->birthdate,
            'hire_date' => $employee?->hire_date,
            'base_salary' => $employee?->base_salary,

            'position' => $employee?->position?->title,
            'position_level' => $employee?->position?->positionLevel?->name ?? null,
            'department' => $employee?->department?->name,
            'company' => $employee?->company?->name,
            'branch' => $employee?->branch?->name,
            'manager_id' => $employee?->manager_id,
            'employee_status' => $employee?->status?->name ?? null,
        ];
    }
}