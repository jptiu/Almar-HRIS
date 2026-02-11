<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PositionLevel extends Model
{
    protected $fillable = [
        'name',
        'level_rank',
        'description',
    ];

    public function positions()
    {
        return $this->hasMany(Position::class);
    }
}

