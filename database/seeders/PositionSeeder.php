<?php

namespace Database\Seeders;

use App\Models\Position;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PositionSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Human Resources positions
        Position::updateOrCreate(
            ['title' => 'HR Manager', 'department_id' => 1],
            [
                'department_id' => 1,
                'title' => 'HR Manager',
                'position_level_id' => 6, // Manager level
                'created_by' => 1, // Admin user
            ]
        );

        Position::updateOrCreate(
            ['title' => 'HR Officer', 'department_id' => 1],
            [
                'department_id' => 1,
                'title' => 'HR Officer',
                'position_level_id' => 3, // Staff level
                'created_by' => 1, // Admin user
            ]
        );

        Position::updateOrCreate(
            ['title' => 'HR Specialist', 'department_id' => 1],
            [
                'department_id' => 1,
                'title' => 'HR Specialist',
                'position_level_id' => 4, // Senior level
                'created_by' => 1, // Admin user
            ]
        );

        // Information Technology positions
        Position::updateOrCreate(
            ['title' => 'IT Manager', 'department_id' => 2],
            [
                'department_id' => 2,
                'title' => 'IT Manager',
                'position_level_id' => 6, // Manager level
                'created_by' => 1, // Admin user
            ]
        );

        Position::updateOrCreate(
            ['title' => 'Software Developer', 'department_id' => 2],
            [
                'department_id' => 2,
                'title' => 'Software Developer',
                'position_level_id' => 3, // Staff level
                'created_by' => 1, // Admin user
            ]
        );

        Position::updateOrCreate(
            ['title' => 'Senior Developer', 'department_id' => 2],
            [
                'department_id' => 2,
                'title' => 'Senior Developer',
                'position_level_id' => 4, // Senior level
                'created_by' => 1, // Admin user
            ]
        );

        Position::updateOrCreate(
            ['title' => 'IT Support', 'department_id' => 2],
            [
                'department_id' => 2,
                'title' => 'IT Support',
                'position_level_id' => 2, // Junior level
                'created_by' => 1, // Admin user
            ]
        );

        // Finance positions
        Position::updateOrCreate(
            ['title' => 'Finance Manager', 'department_id' => 3],
            [
                'department_id' => 3,
                'title' => 'Finance Manager',
                'position_level_id' => 6, // Manager level
                'created_by' => 1, // Admin user
            ]
        );

        Position::updateOrCreate(
            ['title' => 'Senior Accountant', 'department_id' => 3],
            [
                'department_id' => 3,
                'title' => 'Senior Accountant',
                'position_level_id' => 4, // Senior level
                'created_by' => 1, // Admin user
            ]
        );

        Position::updateOrCreate(
            ['title' => 'Accountant', 'department_id' => 3],
            [
                'department_id' => 3,
                'title' => 'Accountant',
                'position_level_id' => 3, // Staff level
                'created_by' => 1, // Admin user
            ]
        );

        // Operations positions
        Position::updateOrCreate(
            ['title' => 'Operations Manager', 'department_id' => 4],
            [
                'department_id' => 4,
                'title' => 'Operations Manager',
                'position_level_id' => 6, // Manager level
                'created_by' => 1, // Admin user
            ]
        );

        Position::updateOrCreate(
            ['title' => 'Operations Supervisor', 'department_id' => 4],
            [
                'department_id' => 4,
                'title' => 'Operations Supervisor',
                'position_level_id' => 5, // Lead/Supervisor level
                'created_by' => 1, // Admin user
            ]
        );

        // Marketing positions
        Position::updateOrCreate(
            ['title' => 'Marketing Manager', 'department_id' => 5],
            [
                'department_id' => 5,
                'title' => 'Marketing Manager',
                'position_level_id' => 6, // Manager level
                'created_by' => 1, // Admin user
            ]
        );

        Position::updateOrCreate(
            ['title' => 'Marketing Specialist', 'department_id' => 5],
            [
                'department_id' => 5,
                'title' => 'Marketing Specialist',
                'position_level_id' => 4, // Senior level
                'created_by' => 1, // Admin user
            ]
        );
    }
}

