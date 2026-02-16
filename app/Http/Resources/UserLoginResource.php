<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserLoginResource extends JsonResource
{
    public function toArray(Request $request)
    {
        $employee = $this->employee;

        $isAdmin = !$employee || $this->roles->contains('name', 'admin');

        if ($isAdmin) {
            // Static/default data for admin users
            return [
                'id' => $this->id,
                'email' => $this->email,
                'roles' => $this->roles->pluck('name'),

                'employee_id' => null,
                'first_name' => 'Admin',
                'middle_name' => null,
                'last_name' => 'User',
                'full_name' => 'Admin User',

                'position' => 'Administrator',
                'position_level' => null,
                'department' => null,
                'company' => 'Company Admin',
                'branch' => null,
                'manager_id' => null,
                'employee_status' => 'Active',
            ];
        }

        // Regular employee mapping (basic info only)
        return [
            'id' => $this->id,
            'email' => $this->email,
            'roles' => $this->roles->pluck('name'),

            'employee_id' => $employee?->id,
            'first_name' => $employee?->first_name,
            'middle_name' => $employee?->middle_name,
            'last_name' => $employee?->last_name,
            'full_name' => $employee
                ? trim($employee->first_name . ' ' . ($employee->middle_name ? $employee->middle_name . ' ' : '') . $employee->last_name)
                : null,

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