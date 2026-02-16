<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeaveType extends Model
{
    protected $fillable = [
        'name',
        'description',
        'default_days',
        'is_active',
        'requires_approval',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'requires_approval' => 'boolean',
    ];

    /**
     * Get active leave types.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get leave credits for this type.
     */
    public function leaveCredits()
    {
        return $this->hasMany(LeaveCredit::class);
    }

    /**
     * Get leave requests for this type.
     */
    public function leaveRequests()
    {
        return $this->hasMany(LeaveRequest::class);
    }
}

