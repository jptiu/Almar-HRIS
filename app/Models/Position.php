<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Position extends Model
{

    protected $fillable = [
        'department_id',
        'title',
        'position_level_id',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function positionLevel()
    {
        return $this->belongsTo(PositionLevel::class);
    }
}
