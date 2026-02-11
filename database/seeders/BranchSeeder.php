<?php

namespace Database\Seeders;

use App\Models\Branch;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BranchSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Main Office - Headquarters
        Branch::updateOrCreate(
            ['name' => 'Main Office', 'company_id' => 1],
            [
                'company_id' => 1,
                'name' => 'Main Office',
                'address' => '123 Main Street, City',
            ]
        );

        // Tech Hub Branch
        Branch::updateOrCreate(
            ['name' => 'Tech Hub', 'company_id' => 1],
            [
                'company_id' => 1,
                'name' => 'Tech Hub',
                'address' => '456 Innovation Avenue, Makati City',
            ]
        );

        // Business Center Branch
        Branch::updateOrCreate(
            ['name' => 'Business Center', 'company_id' => 1],
            [
                'company_id' => 1,
                'name' => 'Business Center',
                'address' => '789 Commerce Street, Quezon City',
            ]
        );

        // Regional Office - North
        Branch::updateOrCreate(
            ['name' => 'Regional Office North', 'company_id' => 1],
            [
                'company_id' => 1,
                'name' => 'Regional Office North',
                'address' => '321 North Boulevard, Caloocan City',
            ]
        );

        // Regional Office - South
        Branch::updateOrCreate(
            ['name' => 'Regional Office South', 'company_id' => 1],
            [
                'company_id' => 1,
                'name' => 'Regional Office South',
                'address' => '654 South Road, Muntinlupa City',
            ]
        );
    }
}

