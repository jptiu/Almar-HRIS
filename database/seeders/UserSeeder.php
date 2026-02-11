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

        // Create additional employee users for seeding
        $hrManager = User::firstOrCreate(
            ['email' => 'hrmanager@almar.com'],
            [
                'email' => 'hrmanager@almar.com',
                'password' => bcrypt('password'),
                'is_active' => true,
            ]
        );
        if ($employeeRole && !$hrManager->roles()->exists()) {
            $hrManager->roles()->attach($employeeRole);
        }

        $itManager = User::firstOrCreate(
            ['email' => 'itmanager@almar.com'],
            [
                'email' => 'itmanager@almar.com',
                'password' => bcrypt('password'),
                'is_active' => true,
            ]
        );
        if ($employeeRole && !$itManager->roles()->exists()) {
            $itManager->roles()->attach($employeeRole);
        }

        $financeManager = User::firstOrCreate(
            ['email' => 'financemanager@almar.com'],
            [
                'email' => 'financemanager@almar.com',
                'password' => bcrypt('password'),
                'is_active' => true,
            ]
        );
        if ($employeeRole && !$financeManager->roles()->exists()) {
            $financeManager->roles()->attach($employeeRole);
        }

        $hrOfficer = User::firstOrCreate(
            ['email' => 'hrofficer@almar.com'],
            [
                'email' => 'hrofficer@almar.com',
                'password' => bcrypt('password'),
                'is_active' => true,
            ]
        );
        if ($employeeRole && !$hrOfficer->roles()->exists()) {
            $hrOfficer->roles()->attach($employeeRole);
        }

        $developer = User::firstOrCreate(
            ['email' => 'developer@almar.com'],
            [
                'email' => 'developer@almar.com',
                'password' => bcrypt('password'),
                'is_active' => true,
            ]
        );
        if ($employeeRole && !$developer->roles()->exists()) {
            $developer->roles()->attach($employeeRole);
        }

        $accountant = User::firstOrCreate(
            ['email' => 'accountant@almar.com'],
            [
                'email' => 'accountant@almar.com',
                'password' => bcrypt('password'),
                'is_active' => true,
            ]
        );
        if ($employeeRole && !$accountant->roles()->exists()) {
            $accountant->roles()->attach($employeeRole);
        }
    }
}

