<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray($request)
    {
        $employee = $this->employee;

        return [
            'id' => $this->id,
            'email' => $this->email,
            'is_active' => $this->is_active,
            'roles' => $this->roles->pluck('name'),

            // Employee details (flattened)
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

            // Relationships
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