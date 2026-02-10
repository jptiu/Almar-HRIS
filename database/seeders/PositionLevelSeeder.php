<?php

namespace Database\Seeders;

use App\Models\PositionLevel;
use Illuminate\Database\Seeder;

class PositionLevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $levels = [
            [
                'name' => 'Intern / Trainee',
                'level_rank' => 1,
                'description' => 'Entry-level position for individuals gaining practical experience and training',
            ],
            [
                'name' => 'Junior / Associate',
                'level_rank' => 2,
                'description' => 'Early career position requiring foundational knowledge and skills',
            ],
            [
                'name' => 'Staff / Regular',
                'level_rank' => 3,
                'description' => 'Standard position with confirmed skills and independent work capability',
            ],
            [
                'name' => 'Senior',
                'level_rank' => 4,
                'description' => 'Experienced professional with advanced expertise and mentorship responsibilities',
            ],
            [
                'name' => 'Lead / Supervisor',
                'level_rank' => 5,
                'description' => 'Leadership role overseeing a team or function with direct supervisory duties',
            ],
            [
                'name' => 'Manager',
                'level_rank' => 6,
                'description' => 'Manages a department or team with responsibility for performance and results',
            ],
            [
                'name' => 'Senior Manager / Head',
                'level_rank' => 7,
                'description' => 'Senior leadership role managing multiple managers or major functions',
            ],
            [
                'name' => 'Director',
                'level_rank' => 8,
                'description' => 'Executive leadership position with strategic oversight of departments',
            ],
            [
                'name' => 'Executive',
                'level_rank' => 9,
                'description' => 'Top-level executive leadership (C-suite) with organization-wide responsibility',
            ],
        ];

        foreach ($levels as $level) {
            PositionLevel::updateOrCreate(
                ['level_rank' => $level['level_rank']],
                $level
            );
        }
    }
}

