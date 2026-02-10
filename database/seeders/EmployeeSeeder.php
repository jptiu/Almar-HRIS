<?php

namespace Database\Seeders;

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
        // Get the HR Manager position (created in PositionSeeder)
        $hrManagerPosition = Position::where('title', 'HR Manager')->first();
        
        // Get the permanent employee status
        $permanentStatus = EmployeeStatus::where('name', 'permanent')->first();

        // Create HR Manager employee for the HR user
        Employee::updateOrCreate(
            ['user_id' => 2],
            [
                'user_id' => 2,
                'created_by' => 1,
                'company_id' => 1,
                'branch_id' => 1,
                'position_id' => $hrManagerPosition?->id,
                'first_name' => 'HR',
                'middle_name' => 'A.',
                'last_name' => 'Manager',
                'hire_date' => now()->subMonths(6),
                'employee_status_id' => $permanentStatus?->id,
            ]
        );

        // Create another HR Manager employee
        Employee::updateOrCreate(
            ['user_id' => 3],
            [
                'user_id' => 3,
                'created_by' => 1,
                'company_id' => 1,
                'branch_id' => 1,
                'position_id' => null,
                'first_name' => 'John',
                'middle_name' => 'Michael',
                'last_name' => 'Smith',
                'hire_date' => now()->subMonths(3),
                'employee_status_id' => $permanentStatus?->id,
            ]
        );
    }
}

