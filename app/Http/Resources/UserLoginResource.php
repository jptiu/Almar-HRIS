<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserLoginResource extends JsonResource
{
    public function toArray($request)
    {
        $employee = $this->employee;

        return [
            'id' => $this->id,
            'email' => $this->email,
            'roles' => $this->roles->pluck('name'),

            // Basic employee info only (no sensitive data like address, salary, phone)
            'employee_id' => $employee?->id,
            'first_name' => $employee?->first_name,
            'middle_name' => $employee?->middle_name,
            'last_name' => $employee?->last_name,
            'full_name' => $employee
                ? trim($employee->first_name . ' ' . ($employee->middle_name ? $employee->middle_name . ' ' : '') . $employee->last_name)
                : null,

            // Job details only (no personal info)
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

