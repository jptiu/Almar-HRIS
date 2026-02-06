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
        $admin = User::firstOrCreate(
            ['email' => 'admin@almar.com'],
            [
                'email' => 'admin@almar.com',
                'password' => bcrypt('password'),
                'is_active' => true,
            ]
        );
        $adminRole = Role::where('name', 'admin')->first();
        if ($adminRole && !$admin->roles()->exists()) {
            $admin->roles()->attach($adminRole);
        }

        // Create HR Manager User
        $hr = User::firstOrCreate(
            ['email' => 'hr@almar.com'],
            [
                'email' => 'hr@almar.com',
                'password' => bcrypt('password'),
                'is_active' => true,
            ]
        );
        $hrRole = Role::where('name', 'hr_manager')->first();
        if ($hrRole && !$hr->roles()->exists()) {
            $hr->roles()->attach($hrRole);
        }

        // Create Employee User
        $employee = User::firstOrCreate(
            ['email' => 'employee@almar.com'],
            [
                'email' => 'employee@almar.com',
                'password' => bcrypt('password'),
                'is_active' => true,
            ]
        );
        $employeeRole = Role::where('name', 'employee')->first();
        if ($employeeRole && !$employee->roles()->exists()) {
            $employee->roles()->attach($employeeRole);
        }
    }
}

