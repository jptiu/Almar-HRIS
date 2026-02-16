<?php

namespace App\Models;

use App\Traits\HasSearchFilter;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasSearchFilter;

    protected $fillable = [
        'user_id',
        'created_by',
        'company_id',
        'branch_id',
        'position_id',
        'department_id',
        'manager_id',
        'employee_status_id',
        'first_name',
        'last_name',
        'middle_name',
        'address_line_1',
        'address_line_2',
        'city',
        'state',
        'postal_code',
        'country',
        'phone',
        'hire_date',
        'birthdate',
        'base_salary',
    ];

    protected $casts = [
        'hire_date' => 'date',
        'birthdate' => 'date',
        'base_salary' => 'decimal:2',
    ];

    /**
     * Fields used for global search
     */
    public array $searchable = [
        'first_name',
        'last_name',
        'middle_name',
        'user.email',
        'company.name',
        'branch.name',
        'department.name',
        'position.title',
        'leaveCredits.year',       // searchable by year
        'leaveCredits.total_days', // searchable by total days
        'leaveCredits.used_days',  // searchable by used days
        'leaveCredits.remaining_days', // searchable by remaining days
    ];

    /**
     * Allowed filters (must match your SearchFilter helper logic)
     */
    public array $allowedFilters = [
        'department_id',
        'branch_id',
        'company_id',
        'position_id',
        'employee_status_id',

        // range filters (your helper supports _from/_to and _min/_max)
        'hire_date_from',
        'hire_date_to',
        'birthdate_from',
        'birthdate_to',
        'base_salary_min',
        'base_salary_max',

        // relation filters
        'department.name',
        'branch.name',
        'company.name',
        'position.title',
        'user.email',
        'leaveCredits.year',       // filter by year
        'leaveCredits.total_days', // filter by total days
        'leaveCredits.used_days',  // filter by used days
        'leaveCredits.remaining_days', // filter by remaining days
    ];

    /**
     * Allowed sorting columns
     */
    public array $allowedSorts = [
        'created_at',
        'first_name',
        'last_name',
        'hire_date',
        'base_salary',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function position()
    {
        return $this->belongsTo(Position::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function manager()
    {
        return $this->belongsTo(Employee::class, 'manager_id');
    }

    public function subordinates()
    {
        return $this->hasMany(Employee::class, 'manager_id');
    }

    public function status()
    {
        return $this->belongsTo(EmployeeStatus::class, 'employee_status_id');
    }

    public function documents()
    {
        return $this->hasMany(EmployeeDocument::class);
    }

    /**
     * 🔥 Needed for your leave credits endpoint
     */
    public function leaveCredits()
    {
        return $this->hasMany(LeaveCredit::class);
    }
}
