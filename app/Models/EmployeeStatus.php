<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeStatus extends Model
{
    protected $fillable = [
        'name',
        'description',
    ];

    /**
     * Get the employees with this status.
     */
    public function employees()
    {
        return $this->hasMany(Employee::class);
    }
}

