<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LeaveCreditResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->when($this->resource->id, $this->resource->id),
            'employee_id' => $this->when($this->resource->employee_id, $this->resource->employee_id),
            'leave_type_id' => $this->leave_type_id,
            'leave_type' => $this->leaveType ? [
                'id' => $this->leaveType->id,
                'name' => $this->leaveType->name,
            ] : null,
            'year' => $this->year,
            'total_days' => (float) $this->total_days,
            'used_days' => (float) $this->used_days,
            'remaining_days' => (float) $this->remaining_days,
            'notes' => $this->when($this->resource->notes, $this->resource->notes),
            'created_at' => $this->when($this->resource->created_at, $this->resource->created_at?->toISOString()),
            'updated_at' => $this->when($this->resource->updated_at, $this->resource->updated_at?->toISOString()),
        ];
    }
}

