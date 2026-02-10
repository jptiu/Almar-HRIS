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

        // Create Manager User
        $manager = User::firstOrCreate(
            ['email' => 'manager@almar.com'],
            [
                'email' => 'manager@almar.com',
                'password' => bcrypt('password'),
                'is_active' => true,
            ]
        );
        $managerRole = Role::where('name', 'manager')->first();
        if ($managerRole && !$manager->roles()->exists()) {
            $manager->roles()->attach($managerRole);
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

