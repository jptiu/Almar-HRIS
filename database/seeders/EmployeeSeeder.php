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

class EmployeeSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get common data
        $company = Company::first();
        $branch = Branch::first();
        $hrDepartment = Department::where('name', 'Human Resources')->first();
        $itDepartment = Department::where('name', 'Information Technology')->first();
        $financeDepartment = Department::where('name', 'Finance')->first();
        $permanentStatus = EmployeeStatus::where('name', 'permanent')->first();
        $probationaryStatus = EmployeeStatus::where('name', 'probationary')->first();

        // Get positions
        $hrManagerPosition = Position::where('title', 'HR Manager')->first();
        $itManagerPosition = Position::where('title', 'IT Manager')->first();
        $financeManagerPosition = Position::where('title', 'Finance Manager')->first();
        $hrOfficerPosition = Position::where('title', 'HR Officer')->first();
        $developerPosition = Position::where('title', 'Software Developer')->first();
        $accountantPosition = Position::where('title', 'Senior Accountant')->first();

        // Create HR Manager employee (for user_id 2)
        Employee::updateOrCreate(
            ['user_id' => 2],
            [
                'user_id' => 2,
                'created_by' => 1,
                'company_id' => $company?->id,
                'branch_id' => $branch?->id,
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
                'birthdate' => '1985-06-15',
                'base_salary' => 85000.00,
            ]
        );

        // Create IT Manager employee
        $itManager = Employee::updateOrCreate(
            ['user_id' => 3],
            [
                'user_id' => 3,
                'created_by' => 1,
                'company_id' => $company?->id,
                'branch_id' => $branch?->id,
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
                'birthdate' => '1988-03-22',
                'base_salary' => 95000.00,
            ]
        );

        // Create Finance Manager employee
        Employee::updateOrCreate(
            ['user_id' => 4],
            [
                'user_id' => 4,
                'created_by' => 1,
                'company_id' => $company?->id,
                'branch_id' => $branch?->id,
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
                'birthdate' => '1982-11-08',
                'base_salary' => 90000.00,
            ]
        );

        // Create HR Officer employee (reporting to HR Manager)
        Employee::updateOrCreate(
            ['user_id' => 5],
            [
                'user_id' => 5,
                'created_by' => 2,
                'company_id' => $company?->id,
                'branch_id' => $branch?->id,
                'position_id' => $hrOfficerPosition?->id,
                'department_id' => $hrDepartment?->id,
                'manager_id' => 2, // Reports to HR Manager
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
                'birthdate' => '1992-07-19',
                'base_salary' => 45000.00,
            ]
        );

        // Create Software Developer employee (reporting to IT Manager)
        Employee::updateOrCreate(
            ['user_id' => 6],
            [
                'user_id' => 6,
                'created_by' => 3,
                'company_id' => $company?->id,
                'branch_id' => $branch?->id,
                'position_id' => $developerPosition?->id,
                'department_id' => $itDepartment?->id,
                'manager_id' => $itManager?->id,
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
                'birthdate' => '1995-01-30',
                'base_salary' => 55000.00,
            ]
        );

        // Create Senior Accountant employee (reporting to Finance Manager)
        Employee::updateOrCreate(
            ['user_id' => 7],
            [
                'user_id' => 7,
                'created_by' => 4,
                'company_id' => $company?->id,
                'branch_id' => $branch?->id,
                'position_id' => $accountantPosition?->id,
                'department_id' => $financeDepartment?->id,
                'manager_id' => null, // Reports to Finance Manager (will need update)
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
                'birthdate' => '1990-09-14',
                'base_salary' => 65000.00,
            ]
        );
    }
}

