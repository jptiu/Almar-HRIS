<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BirthdayResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'employee_id' => $this->id,
            'full_name' => trim(
                $this->first_name . ' ' .
                    ($this->middle_name ? $this->middle_name . ' ' : '') .
                    $this->last_name
            ),
            'birthdate' => $this->birthdate,
            'age' => $this->birthdate?->age,
            'company' => $this->company?->name,
            'branch' => $this->branch?->name,
            'department' => $this->department?->name,
            'position' => $this->position?->title,
        ];
    }
}
