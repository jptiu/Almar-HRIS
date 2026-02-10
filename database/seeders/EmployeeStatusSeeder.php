<?php

namespace Database\Seeders;

use App\Models\EmployeeStatus;
use Illuminate\Database\Seeder;

class EmployeeStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [
            [
                'name' => 'Probationary',
                'description' => 'New employee on probation period',
            ],
            [
                'name' => 'Permanent',
                'description' => 'Regular permanent employee',
            ],
            [
                'name' => 'Contractual',
                'description' => 'Contract-based employee',
            ],
            [
                'name' => 'Terminated',
                'description' => 'Former employee whose contract has ended',
            ],
        ];

        foreach ($statuses as $status) {
            EmployeeStatus::updateOrCreate(
                ['name' => $status['name']],
                $status
            );
        }
    }
}

