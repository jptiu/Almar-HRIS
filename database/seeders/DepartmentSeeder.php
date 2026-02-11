<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Department;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $company = Company::first();

        Department::updateOrCreate(
            ['name' => 'Human Resources', 'company_id' => $company?->id],
            [
                'name' => 'Human Resources',
                'description' => 'Responsible for recruitment, employee relations, training, and HR operations.',
                'company_id' => $company?->id,
                'created_by' => 1,
            ]
        );

        Department::updateOrCreate(
            ['name' => 'Information Technology', 'company_id' => $company?->id],
            [
                'name' => 'Information Technology',
                'description' => 'Responsible for software development, infrastructure, and technical support.',
                'company_id' => $company?->id,
                'created_by' => 1,
            ]
        );

        Department::updateOrCreate(
            ['name' => 'Finance', 'company_id' => $company?->id],
            [
                'name' => 'Finance',
                'description' => 'Responsible for financial planning, accounting, and payroll.',
                'company_id' => $company?->id,
                'created_by' => 1,
            ]
        );

        Department::updateOrCreate(
            ['name' => 'Operations', 'company_id' => $company?->id],
            [
                'name' => 'Operations',
                'description' => 'Responsible for day-to-day business operations and logistics.',
                'company_id' => $company?->id,
                'created_by' => 1,
            ]
        );

        Department::updateOrCreate(
            ['name' => 'Marketing', 'company_id' => $company?->id],
            [
                'name' => 'Marketing',
                'description' => 'Responsible for brand management and marketing campaigns.',
                'company_id' => $company?->id,
                'created_by' => 1,
            ]
        );
    }
}

