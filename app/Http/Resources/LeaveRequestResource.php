<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LeaveRequestResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'employee_id' => $this->employee_id,
            'employee' => $this->employee ? [
                'id' => $this->employee->id,
                'first_name' => $this->employee->first_name,
                'last_name' => $this->employee->last_name,
            ] : null,
            'leave_type_id' => $this->leave_type_id,
            'leave_type' => $this->leaveType ? [
                'id' => $this->leaveType->id,
                'name' => $this->leaveType->name,
            ] : null,
            'start_date' => $this->start_date?->toISOString(),
            'end_date' => $this->end_date?->toISOString(),
            'total_days' => (float) $this->total_days,
            'reason' => $this->reason,
            'status' => $this->status,
            'reviewed_by' => $this->reviewed_by,
            'reviewer' => $this->reviewer ? [
                'id' => $this->reviewer->id,
                'name' => $this->reviewer->employee ? 
                    $this->reviewer->employee->first_name . ' ' . $this->reviewer->employee->last_name 
                    : $this->reviewer->email,
            ] : null,
            'reviewed_at' => $this->reviewed_at?->toISOString(),
            'review_notes' => $this->review_notes,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}

