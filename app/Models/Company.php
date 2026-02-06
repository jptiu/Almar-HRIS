<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{

    protected $fillable = [
        'name',
        'email',
        'phone',
    ];

    public function branches()
    {
        return $this->hasMany(Branch::class);
    }
}
