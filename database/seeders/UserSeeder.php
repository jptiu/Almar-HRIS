<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Fetch roles once
        $adminRole    = Role::where('name', 'admin')->first();
        $managerRole  = Role::where('name', 'manager')->first();
        $employeeRole = Role::where('name', 'employee')->first();

        /*
        |--------------------------------------------------------------------------
        | Admin
        |--------------------------------------------------------------------------
        */
        $admin = User::firstOrCreate(
            ['email' => 'admin@almar.com'],
            [
                'password'  => Hash::make('password'),
                'is_active' => true,
            ]
        );

        if ($adminRole) {
            $admin->roles()->syncWithoutDetaching([$adminRole->id]);
        }

        /*
        |--------------------------------------------------------------------------
        | Manager (Manager + Employee)
        |--------------------------------------------------------------------------
        */
        $manager = User::firstOrCreate(
            ['email' => 'manager@almar.com'],
            [
                'password'  => Hash::make('password'),
                'is_active' => true,
            ]
        );

        if ($managerRole && $employeeRole) {
            $manager->roles()->syncWithoutDetaching([
                $managerRole->id,
                $employeeRole->id,
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Regular Employee
        |--------------------------------------------------------------------------
        */
        $employee = User::firstOrCreate(
            ['email' => 'employee@almar.com'],
            [
                'password'  => Hash::make('password'),
                'is_active' => true,
            ]
        );

        if ($employeeRole) {
            $employee->roles()->syncWithoutDetaching([$employeeRole->id]);
        }

        /*
        |--------------------------------------------------------------------------
        | Department Managers (Manager + Employee)
        |--------------------------------------------------------------------------
        */
        $departmentManagers = [
            'hrmanager@almar.com',
            'itmanager@almar.com',
            'financemanager@almar.com',
        ];

        foreach ($departmentManagers as $email) {
            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'password'  => Hash::make('password'),
                    'is_active' => true,
                ]
            );

            if ($managerRole && $employeeRole) {
                $user->roles()->syncWithoutDetaching([
                    $managerRole->id,
                    $employeeRole->id,
                ]);
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Other Employees
        |--------------------------------------------------------------------------
        */
        $employees = [
            'hrofficer@almar.com',
            'developer@almar.com',
            'accountant@almar.com',
        ];

        foreach ($employees as $email) {
            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'password'  => Hash::make('password'),
                    'is_active' => true,
                ]
            );

            if ($employeeRole) {
                $user->roles()->syncWithoutDetaching([$employeeRole->id]);
            }
        }
    }
}