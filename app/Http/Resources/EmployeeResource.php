<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            /*
            |--------------------------------------------------------------------------
            | User Information
            |--------------------------------------------------------------------------
            */
            'id' => $this->user?->id,
            'email' => $this->user?->email,
            'is_active' => $this->user?->is_active,
            'roles' => $this->user?->roles?->pluck('name')->values() ?? [],

            /*
            |--------------------------------------------------------------------------
            | Employee Information
            |--------------------------------------------------------------------------
            */
            'employee_id' => $this->id,
            'first_name' => $this->first_name,
            'middle_name' => $this->middle_name,
            'last_name' => $this->last_name,

            'full_name' => trim(
                $this->first_name . ' ' .
                    ($this->middle_name ? $this->middle_name . ' ' : '') .
                    $this->last_name
            ),

            'phone' => $this->phone,
            'address_line_1' => $this->address_line_1,
            'address_line_2' => $this->address_line_2,
            'city' => $this->city,
            'state' => $this->state,
            'postal_code' => $this->postal_code,
            'country' => $this->country,
            'birthdate' => $this->birthdate,
            'hire_date' => $this->hire_date,
            'base_salary' => $this->base_salary,

            /*
            |--------------------------------------------------------------------------
            | Relations
            |--------------------------------------------------------------------------
            */
            'position' => $this->position?->title,
            'position_level' => $this->position?->positionLevel?->name,
            'department' => $this->department?->name,
            'company' => $this->company?->name,
            'branch' => $this->branch?->name,
            'manager_id' => $this->manager_id,
            'employee_status' => $this->status?->name,

            /*
            |--------------------------------------------------------------------------
            | Probation Details (only populated when status is Probationary)
            |--------------------------------------------------------------------------
            */
            'probation_detail' => $this->when($this->status?->name === 'Probationary', function () {
                return [
                    'probation_start_date' => $this->probationDetail?->probation_start_date,
                    'probation_end_date' => $this->probationDetail?->probation_end_date,
                    'performance_criteria' => $this->probationDetail?->performance_criteria,
                    'probation_status' => $this->probationDetail?->probation_status,
                    'probation_notes' => $this->probationDetail?->probation_notes,
                ];
            }),

            /*
            |--------------------------------------------------------------------------
            | Timestamps
            |--------------------------------------------------------------------------
            */
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
