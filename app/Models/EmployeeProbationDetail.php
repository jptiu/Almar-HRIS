<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeProbationDetail extends Model
{
    protected $table = 'employee_probation_details';

    protected $fillable = [
        'employee_id',
        'probation_start_date',
        'probation_end_date',
        'performance_criteria',
        'probation_status',
        'probation_notes',
    ];

    protected $casts = [
        'probation_start_date' => 'date',
        'probation_end_date' => 'date',
    ];

    /**
     * Probation status constants
     */
    public const STATUS_PENDING = 'pending';
    public const STATUS_IN_PROGRESS = 'in_progress';
    public const STATUS_PASSED = 'passed';
    public const STATUS_FAILED = 'failed';
    public const STATUS_EXTENDED = 'extended';

    /**
     * Get all probation statuses as an array
     */
    public static function getStatuses(): array
    {
        return [
            self::STATUS_PENDING,
            self::STATUS_IN_PROGRESS,
            self::STATUS_PASSED,
            self::STATUS_FAILED,
            self::STATUS_EXTENDED,
        ];
    }

    /**
     * Get the employee that owns the probation details.
     */
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}

