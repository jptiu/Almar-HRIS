<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Admin User
        $admin = User::factory()->create([
            'email' => 'admin@almar.com',
            'is_active' => true,
        ]);
        $admin->roles()->attach(Role::where('name', 'admin')->first());

        // Create HR Manager User
        $hr = User::factory()->create([
            'email' => 'hr@almar.com',
            'is_active' => true,
        ]);
        $hr->roles()->attach(Role::where('name', 'hr_manager')->first());

        // Create Employee User
        $employee = User::factory()->create([
            'email' => 'employee@almar.com',
            'is_active' => true,
        ]);
        $employee->roles()->attach(Role::where('name', 'employee')->first());
    }
}

