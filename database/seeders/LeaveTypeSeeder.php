<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LeaveType;

class LeaveTypeSeeder extends Seeder
{
    public function run(): void
    {
        $leaveTypes = [
            [
                'name' => 'Sick Leave',
                'description' => 'Leave for medical purposes',
                'default_days' => 10,
                'is_active' => true,
                'requires_approval' => true,
            ],
            [
                'name' => 'Vacation Leave',
                'description' => 'Annual vacation or personal leave',
                'default_days' => 15,
                'is_active' => true,
                'requires_approval' => true,
            ],
            [
                'name' => 'Personal Leave',
                'description' => 'Personal matters and emergencies',
                'default_days' => 5,
                'is_active' => true,
                'requires_approval' => true,
            ],
            [
                'name' => 'Parental Leave',
                'description' => 'Maternity or paternity leave',
                'default_days' => 60,
                'is_active' => true,
                'requires_approval' => true,
            ],
            [
                'name' => 'Bereavement Leave',
                'description' => 'Leave due to death of immediate family',
                'default_days' => 5,
                'is_active' => true,
                'requires_approval' => false,
            ],
            [
                'name' => 'Unpaid Leave',
                'description' => 'Leave without pay',
                'default_days' => 0,
                'is_active' => true,
                'requires_approval' => true,
            ],
            [
                'name' => 'Birthday Leave',
                'description' => 'Leave to celebrate employee’s birthday',
                'default_days' => 1,
                'is_active' => true,
                'requires_approval' => false,
            ],
        ];

        foreach ($leaveTypes as $type) {
            LeaveType::updateOrCreate(
                ['name' => $type['name']],
                $type
            );
        }
    }
}