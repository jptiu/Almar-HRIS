<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeaveCredit extends Model
{
    protected $fillable = [
        'employee_id',
        'leave_type_id',
        'year',
        'total_days',
        'used_days',
        'remaining_days',
        'notes',
    ];

    protected $casts = [
        'total_days' => 'decimal:2',
        'used_days' => 'decimal:2',
        'remaining_days' => 'decimal:2',
    ];

    /**
     * Get the employee that owns these credits.
     */
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Get the leave type.
     */
    public function leaveType()
    {
        return $this->belongsTo(LeaveType::class);
    }

    /**
     * Get credits for a specific year.
     */
    public function scopeForYear($query, int $year)
    {
        return $query->where('year', $year);
    }

    /**
     * Get credits for current year.
     */
    public function scopeCurrentYear($query)
    {
        return $query->where('year', now()->year);
    }

    /**
     * Update used and remaining days.
     */
    public function useDays(float $days): void
    {
        $this->used_days = $this->used_days + $days;
        $this->remaining_days = $this->total_days - $this->used_days;
        $this->save();
    }

    /**
     * Restore days (when leave is cancelled).
     */
    public function restoreDays(float $days): void
    {
        $this->used_days = max(0, $this->used_days - $days);
        $this->remaining_days = $this->total_days - $this->used_days;
        $this->save();
    }
}