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
        Position::updateOrCreate(
            ['title' => 'HR Manager', 'department_id' => 1],
            [
                'department_id' => 1,
                'title' => 'HR Manager',
                'level' => 'senior',
            ]
        );
    }
}

