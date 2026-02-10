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
        Branch::updateOrCreate(
            ['name' => 'Main Office', 'company_id' => 1],
            [
                'company_id' => 1,
                'name' => 'Main Office',
                'address' => '123 Main Street, City',
            ]
        );
    }
}

