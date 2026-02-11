<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CompanySeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Company::updateOrCreate(
            ['email' => 'contact@almar.com'],
            [
                'name' => 'Almar Corporation',
                'email' => 'contact@almar.com',
                'phone' => '+63 912 345 6789',
            ]
        );
    }
}
