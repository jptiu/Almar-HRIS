<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
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

    /**
     * Get the manager of this employee.
     */
    public function manager()
    {
        return $this->belongsTo(Employee::class, 'manager_id');
    }

    /**
     * Get the subordinates of this employee.
     */
    public function subordinates()
    {
        return $this->hasMany(Employee::class, 'manager_id');
    }

    /**
     * Get the employment status of this employee.
     */
    public function status()
    {
        return $this->belongsTo(EmployeeStatus::class, 'employee_status_id');
    }

    /**
     * Get the documents for this employee.
     */
    public function documents()
    {
        return $this->hasMany(EmployeeDocument::class);
    }

    /**
     * Get the department directly.
     */
    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
