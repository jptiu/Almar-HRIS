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

    // Protected searchable fields for automatic global search
    protected $searchable = [
        'first_name',
        'last_name',
        'middle_name',
        'user.email',
        'company.name',
        'branch.name',
        'department.name',
        'position.title',
    ];

    // Relationships
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
}