<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Company;
use App\Models\Department;
use App\Models\Employee;
use App\Models\EmployeeStatus;
use App\Models\Position;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class EmployeeSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $company = Company::first();
        $branch = Branch::first();

        $hrDepartment = Department::where('name', 'Human Resources')->first();
        $itDepartment = Department::where('name', 'Information Technology')->first();
        $financeDepartment = Department::where('name', 'Finance')->first();

        $permanentStatus = EmployeeStatus::where('name', 'permanent')->first();
        $probationaryStatus = EmployeeStatus::where('name', 'probationary')->first();

        $hrManagerPosition = Position::where('title', 'HR Manager')->first();
        $itManagerPosition = Position::where('title', 'IT Manager')->first();
        $financeManagerPosition = Position::where('title', 'Finance Manager')->first();
        $hrOfficerPosition = Position::where('title', 'HR Officer')->first();
        $developerPosition = Position::where('title', 'Software Developer')->first();
        $accountantPosition = Position::where('title', 'Senior Accountant')->first();

        $currentMonth = now()->month;
        $startDay = now()->day;

        $employees = [
            [
                'user_id' => 2,
                'created_by' => 1,
                'position_id' => $hrManagerPosition?->id,
                'department_id' => $hrDepartment?->id,
                'manager_id' => null,
                'employee_status_id' => $permanentStatus?->id,
                'first_name' => 'HR',
                'middle_name' => 'A.',
                'last_name' => 'Manager',
                'address_line_1' => '123 HR Street',
                'address_line_2' => 'Suite 100',
                'city' => 'Manila',
                'state' => 'Metro Manila',
                'postal_code' => '1001',
                'country' => 'Philippines',
                'phone' => '+63 912 345 6701',
                'hire_date' => now()->subMonths(12),
                'birthdate' => Carbon::createFromDate(1985, $currentMonth, $startDay),
                'base_salary' => 85000.00,
            ],
            [
                'user_id' => 3,
                'created_by' => 1,
                'position_id' => $itManagerPosition?->id,
                'department_id' => $itDepartment?->id,
                'manager_id' => null,
                'employee_status_id' => $permanentStatus?->id,
                'first_name' => 'John',
                'middle_name' => 'Michael',
                'last_name' => 'Smith',
                'address_line_1' => '456 Tech Avenue',
                'address_line_2' => '',
                'city' => 'Makati',
                'state' => 'Metro Manila',
                'postal_code' => '1200',
                'country' => 'Philippines',
                'phone' => '+63 912 345 6702',
                'hire_date' => now()->subMonths(10),
                'birthdate' => Carbon::createFromDate(1988, $currentMonth, $startDay + 1),
                'base_salary' => 95000.00,
            ],
            [
                'user_id' => 4,
                'created_by' => 1,
                'position_id' => $financeManagerPosition?->id,
                'department_id' => $financeDepartment?->id,
                'manager_id' => null,
                'employee_status_id' => $permanentStatus?->id,
                'first_name' => 'Sarah',
                'middle_name' => 'Lee',
                'last_name' => 'Johnson',
                'address_line_1' => '789 Finance Road',
                'address_line_2' => '',
                'city' => 'Quezon City',
                'state' => 'Metro Manila',
                'postal_code' => '1100',
                'country' => 'Philippines',
                'phone' => '+63 912 345 6703',
                'hire_date' => now()->subMonths(8),
                'birthdate' => Carbon::createFromDate(1982, $currentMonth, $startDay + 2),
                'base_salary' => 90000.00,
            ],
            [
                'user_id' => 5,
                'created_by' => 2,
                'position_id' => $hrOfficerPosition?->id,
                'department_id' => $hrDepartment?->id,
                'manager_id' => 2,
                'employee_status_id' => $permanentStatus?->id,
                'first_name' => 'Emily',
                'middle_name' => 'Rose',
                'last_name' => 'Davis',
                'address_line_1' => '234 Employee Lane',
                'address_line_2' => '',
                'city' => 'Taguig',
                'state' => 'Metro Manila',
                'postal_code' => '1630',
                'country' => 'Philippines',
                'phone' => '+63 912 345 6704',
                'hire_date' => now()->subMonths(6),
                'birthdate' => Carbon::createFromDate(1992, $currentMonth, $startDay + 3),
                'base_salary' => 45000.00,
            ],
            [
                'user_id' => 6,
                'created_by' => 3,
                'position_id' => $developerPosition?->id,
                'department_id' => $itDepartment?->id,
                'manager_id' => 3,
                'employee_status_id' => $probationaryStatus?->id,
                'first_name' => 'Michael',
                'middle_name' => 'James',
                'last_name' => 'Wilson',
                'address_line_1' => '567 Code Street',
                'address_line_2' => 'Unit 12B',
                'city' => 'Pasig',
                'state' => 'Metro Manila',
                'postal_code' => '1600',
                'country' => 'Philippines',
                'phone' => '+63 912 345 6705',
                'hire_date' => now()->subMonths(2),
                'birthdate' => Carbon::createFromDate(1995, $currentMonth, $startDay + 4),
                'base_salary' => 55000.00,
            ],
            [
                'user_id' => 7,
                'created_by' => 4,
                'position_id' => $accountantPosition?->id,
                'department_id' => $financeDepartment?->id,
                'manager_id' => null,
                'employee_status_id' => $permanentStatus?->id,
                'first_name' => 'Jennifer',
                'middle_name' => 'Ann',
                'last_name' => 'Martinez',
                'address_line_1' => '890 Account Street',
                'address_line_2' => '',
                'city' => 'Mandaluyong',
                'state' => 'Metro Manila',
                'postal_code' => '1550',
                'country' => 'Philippines',
                'phone' => '+63 912 345 6706',
                'hire_date' => now()->subMonths(4),
                'birthdate' => Carbon::createFromDate(1990, $currentMonth, $startDay + 5),
                'base_salary' => 65000.00,
            ],
        ];

        foreach ($employees as $data) {
            Employee::updateOrCreate(
                ['user_id' => $data['user_id']],
                array_merge($data, [
                    'company_id' => $company?->id,
                    'branch_id' => $branch?->id,
                ])
            );
        }
    }
}