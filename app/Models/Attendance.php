<?php

namespace App\Models;

use App\Traits\HasSearchFilter;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasSearchFilter;

    protected $fillable = [
        'employee_id',
        'date',
        'clock_in',
        'clock_out',
        'clock_in_datetime',
        'clock_out_datetime',
        'status',
        'hours_worked',
        'notes',
        'clock_in_latitude',
        'clock_in_longitude',
        'clock_out_latitude',
        'clock_out_longitude',
        'clock_in_ip_address',
        'clock_out_ip_address',
        'leave_request_id',
    ];

    protected $casts = [
        'date' => 'date',
        'clock_in' => 'datetime:H:i:s',
        'clock_out' => 'datetime:H:i:s',
        'clock_in_datetime' => 'datetime',
        'clock_out_datetime' => 'datetime',
        'hours_worked' => 'decimal:2',
    ];

    /**
     * Status constants
     */
    public const STATUS_PRESENT = 'present';
    public const STATUS_LATE = 'late';
    public const STATUS_ABSENT = 'absent';
    public const STATUS_ON_LEAVE = 'on_leave';

    /**
     * Default work start time (9:00 AM)
     */
    public const DEFAULT_WORK_START = '09:00:00';

    /**
     * Searchable / filterable / sortable fields
     */
    public array $searchable = [
        'status',
        'employee.first_name',
        'employee.last_name',
    ];

    public array $allowedFilters = [
        'employee_id',
        'status',
        'date',
        'date_from',
        'date_to',
        'created_at_from',
        'created_at_to',
    ];

    public array $allowedSorts = [
        'created_at',
        'date',
        'clock_in',
        'clock_out',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    /**
     * Get the employee that owns this attendance.
     */
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Get the leave request if this attendance is on leave.
     */
    public function leaveRequest()
    {
        return $this->belongsTo(LeaveRequest::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */

    /**
     * Get attendance for a specific date.
     */
    public function scopeForDate($query, $date)
    {
        return $query->whereDate('date', $date);
    }

    /**
     * Get attendance for today.
     */
    public function scopeToday($query)
    {
        return $query->whereDate('date', now()->toDateString());
    }

    /**
     * Get attendance for a specific employee.
     */
    public function scopeForEmployee($query, int $employeeId)
    {
        return $query->where('employee_id', $employeeId);
    }

    /**
     * Get attendance for a date range.
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('date', [$startDate, $endDate]);
    }

    /**
     * Get attendance for current month.
     */
    public function scopeCurrentMonth($query)
    {
        return $query->whereMonth('date', now()->month)
            ->whereYear('date', now()->year);
    }

    /**
     * Get attendance for current year.
     */
    public function scopeCurrentYear($query)
    {
        return $query->whereYear('date', now()->year);
    }

    /**
     * Get pending attendance (no clock_out yet).
     */
    public function scopePending($query)
    {
        return $query->whereNull('clock_out');
    }

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    /**
     * Calculate hours worked based on clock_in and clock_out.
     */
    public function calculateHoursWorked(): ?float
    {
        if (!$this->clock_in_datetime || !$this->clock_out_datetime) {
            return null;
        }

        $clockIn = Carbon::parse($this->clock_in_datetime);
        $clockOut = Carbon::parse($this->clock_out_datetime);

        return round($clockOut->diffInMinutes($clockIn) / 60, 2);
    }

    /**
     * Check if the employee clocked in on time.
     * Default work start is 9:00 AM.
     */
    public function isOnTime(string $workStartTime = self::DEFAULT_WORK_START): bool
    {
        if (!$this->clock_in) {
            return false;
        }

        $clockInTime = Carbon::parse($this->clock_in)->format('H:i:s');
        return $clockInTime <= $workStartTime;
    }

    /**
     * Determine status based on clock-in time.
     */
    public function determineStatus(string $workStartTime = self::DEFAULT_WORK_START): string
    {
        if ($this->leaveRequest) {
            return self::STATUS_ON_LEAVE;
        }

        if (!$this->clock_in) {
            return self::STATUS_ABSENT;
        }

        return $this->isOnTime($workStartTime) ? self::STATUS_PRESENT : self::STATUS_LATE;
    }

    /**
     * Update hours worked automatically.
     */
    public function updateHoursWorked(): void
    {
        $hoursWorked = $this->calculateHoursWorked();
        if ($hoursWorked !== null) {
            $this->hours_worked = $hoursWorked;
            $this->save();
        }
    }

    /**
     * Check if the employee has already clocked in today.
     */
    public function hasClockedIn(): bool
    {
        return $this->clock_in !== null;
    }

    /**
     * Check if the employee has already clocked out today.
     */
    public function hasClockedOut(): bool
    {
        return $this->clock_out !== null;
    }

    /**
     * Get formatted hours worked.
     */
    public function getFormattedHoursWorkedAttribute(): string
    {
        if ($this->hours_worked === null) {
            return 'N/A';
        }

        $hours = floor($this->hours_worked);
        $minutes = round(($this->hours_worked - $hours) * 60);

        return "{$hours}h {$minutes}m";
    }

    /**
     * Get the late duration in minutes.
     */
    public function getLateDurationInMinutes(string $workStartTime = self::DEFAULT_WORK_START): ?int
    {
        if (!$this->clock_in || $this->isOnTime($workStartTime)) {
            return null;
        }

        $expectedTime = Carbon::parse($workStartTime);
        $actualTime = Carbon::parse($this->clock_in);

        return $expectedTime->diffInMinutes($actualTime);
    }
}

