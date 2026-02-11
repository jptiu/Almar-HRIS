<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Position extends Model
{

    protected $fillable = [
        'department_id',
        'title',
        'position_level_id',
        'created_by',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function positionLevel()
    {
        return $this->belongsTo(PositionLevel::class);
    }

    /**
     * Get the user who created this position.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the employees with this position.
     */
    public function employees()
    {
        return $this->hasMany(Employee::class);
    }
}
