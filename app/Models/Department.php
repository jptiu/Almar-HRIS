<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{

    protected $fillable = [
        'name',
        'description',
        'company_id',
        'created_by',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function positions()
    {
        return $this->hasMany(Position::class);
    }

    /**
     * Get the employees in this department.
     */
    public function employees()
    {
        return $this->hasMany(Employee::class);
    }
}
