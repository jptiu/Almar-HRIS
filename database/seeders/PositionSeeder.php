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
        // Create HR Manager position under Human Resources department
        Position::create([
            'department_id' => 1, // Human Resources department
            'title' => 'HR Manager',
            'level' => 'senior',
        ]);
    }
}

