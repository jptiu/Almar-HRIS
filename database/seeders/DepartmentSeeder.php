<?php

namespace Database\Seeders;

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
        Department::updateOrCreate(
            ['name' => 'Human Resources'],
            [
                'name' => 'Human Resources',
                'description' => 'Responsible for recruitment, employee relations, training, and HR operations.',
                'created_by' => 1,
            ]
        );
    }
}

