<?php

namespace App\Models;

use App\Traits\HasSearchFilter;
use Illuminate\Database\Eloquent\Model;

class LeaveRequest extends Model
{
    use HasSearchFilter;

    protected $fillable = [
        'employee_id',
        'leave_type_id',
        'start_date',
        'end_date',
        'total_days',
        'reason',
        'status',
        'reviewed_by',
        'reviewed_at',
        'review_notes',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'total_days' => 'decimal:2',
        'reviewed_at' => 'datetime',
    ];

    /**
     * Searchable / filterable / sortable fields
     */
    public array $searchable = [
        'reason',
        'status',
        'employee.first_name',
        'employee.last_name',
        'leaveType.name',
    ];

    public array $allowedFilters = [
        'employee_id',
        'status',
        'leave_type_id',
        'start_date_from',
        'start_date_to',
        'end_date_from',
        'end_date_to',
        'created_at_from',
        'created_at_to',
    ];

    public array $allowedSorts = [
        'created_at',
        'start_date',
        'end_date',
        'status',
    ];

    /**
     * Status constants.
     */
    public const STATUS_PENDING = 'pending';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_REJECTED = 'rejected';
    public const STATUS_CANCELLED = 'cancelled';

    /**
     * Relationships
     */
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function leaveType()
    {
        return $this->belongsTo(LeaveType::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    /**
     * Scopes
     */
    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeApproved($query)
    {
        return $query->where('status', self::STATUS_APPROVED);
    }

    public function scopeForEmployee($query, int $employeeId)
    {
        return $query->where('employee_id', $employeeId);
    }

    /**
     * Approve the leave request.
     */
    public function approve(User $reviewer, ?string $notes = null): void
    {
        $this->update([
            'status' => self::STATUS_APPROVED,
            'reviewed_by' => $reviewer->id,
            'reviewed_at' => now(),
            'review_notes' => $notes,
        ]);

        $credit = LeaveCredit::where('employee_id', $this->employee_id)
            ->where('leave_type_id', $this->leave_type_id)
            ->where('year', $this->start_date->year)
            ->first();

        if ($credit) {
            $credit->useDays((float) $this->total_days);
        }
    }

    /**
     * Reject the leave request.
     */
    public function reject(User $reviewer, ?string $notes = null): void
    {
        $this->update([
            'status' => self::STATUS_REJECTED,
            'reviewed_by' => $reviewer->id,
            'reviewed_at' => now(),
            'review_notes' => $notes,
        ]);
    }

    /**
     * Cancel the leave request.
     */
    public function cancel(): void
    {
        // If already approved, restore the used days
        if ($this->status === self::STATUS_APPROVED) {
            $credit = LeaveCredit::where('employee_id', $this->employee_id)
                ->where('leave_type_id', $this->leave_type_id)
                ->where('year', $this->start_date->year)
                ->first();

            if ($credit) {
                $credit->restoreDays((float) $this->total_days);
            }
        }

        $this->update(['status' => self::STATUS_CANCELLED]);
    }
}
