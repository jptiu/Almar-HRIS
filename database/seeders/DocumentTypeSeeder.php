<?php

namespace Database\Seeders;

use App\Models\DocumentType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DocumentTypeSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $documentTypes = [
            // Identification Documents
            [
                'slug' => 'government_id',
                'name' => 'Government ID',
                'description' => 'Any valid government-issued identification card',
                'sort_order' => 1,
            ],
            [
                'slug' => 'passport',
                'name' => 'Passport',
                'description' => 'Valid passport booklet',
                'sort_order' => 2,
            ],
            [
                'slug' => 'drivers_license',
                'name' => "Driver's License",
                'description' => 'Valid driver\'s license',
                'sort_order' => 3,
            ],

            // Social Security/Government IDs
            [
                'slug' => 'sss_id',
                'name' => 'SSS ID',
                'description' => 'Social Security System identification',
                'sort_order' => 4,
            ],
            [
                'slug' => 'philhealth_id',
                'name' => 'PhilHealth ID',
                'description' => 'PhilHealth insurance identification',
                'sort_order' => 5,
            ],
            [
                'slug' => 'pagibig_id',
                'name' => 'Pag-IBIG ID',
                'description' => 'Home Development Mutual Fund identification',
                'sort_order' => 6,
            ],
            [
                'slug' => 'tin_id',
                'name' => 'TIN ID',
                'description' => 'Tax Identification Number card',
                'sort_order' => 7,
            ],

            // Clearance/Certificates
            [
                'slug' => 'birth_certificate',
                'name' => 'Birth Certificate',
                'description' => 'PSA birth certificate',
                'sort_order' => 8,
            ],
            [
                'slug' => 'nbi_clearance',
                'name' => 'NBI Clearance',
                'description' => 'National Bureau of Investigation clearance',
                'sort_order' => 9,
            ],
            [
                'slug' => 'police_clearance',
                'name' => 'Police Clearance',
                'description' => 'Police clearance certificate',
                'sort_order' => 10,
            ],

            // Medical Documents
            [
                'slug' => 'medical_certificate',
                'name' => 'Medical Certificate',
                'description' => 'Certificate of medical fitness',
                'sort_order' => 11,
            ],
            [
                'slug' => 'drug_test',
                'name' => 'Drug Test Result',
                'description' => 'Drug test laboratory result',
                'sort_order' => 12,
            ],

            // Employment Documents
            [
                'slug' => 'contract',
                'name' => 'Contract',
                'description' => 'Employment contract or agreement',
                'sort_order' => 13,
            ],
            [
                'slug' => 'resume',
                'name' => 'Resume/CV',
                'description' => 'Curriculum vitae or resume',
                'sort_order' => 14,
            ],
            [
                'slug' => 'transcript',
                'name' => 'Transcript of Records',
                'description' => 'Official academic transcript',
                'sort_order' => 15,
            ],
            [
                'slug' => 'diploma',
                'name' => 'Diploma',
                'description' => 'Academic diploma or certificate',
                'sort_order' => 16,
            ],
            [
                'slug' => 'employment_certificate',
                'name' => 'Employment Certificate',
                'description' => 'Certificate of employment from previous employer',
                'sort_order' => 17,
            ],

            // Other
            [
                'slug' => 'other',
                'name' => 'Other',
                'description' => 'Other documents not covered by above categories',
                'sort_order' => 18,
            ],
        ];

        foreach ($documentTypes as $type) {
            DocumentType::create($type);
        }
    }
}

