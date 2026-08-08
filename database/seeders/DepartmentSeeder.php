<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    /**
     * Seed the application's departments and units.
     */
    public function run(): void
    {
        $departments = [
            [
                'name' => 'Office of the Schools Division Superintendent',
                'code' => 'OSDS',
            ],
            [
                'name' => 'Office of the Assistant Schools Division Superintendent',
                'code' => 'OASDS',
            ],
            [
                'name' => 'Schools Governance and Operations Division',
                'code' => 'SGOD',
            ],
            [
                'name' => 'Curriculum Implementation Division',
                'code' => 'CID',
            ],
            [
                'name' => 'ICT Unit',
                'code' => 'ICTU',
            ],

            // Finance
            [
                'name' => 'Accounting Unit',
                'code' => 'ACU',
            ],
            [
                'name' => 'Budget Unit',
                'code' => 'BU',
            ],
            [
                'name' => 'Cash Unit',
                'code' => 'CU',
            ],

            // Supply and Procurement
            [
                'name' => 'Supply Unit',
                'code' => 'SU',
            ],
            [
                'name' => 'Procurement Unit',
                'code' => 'PU',
            ],

            // Administrative Services
            [
                'name' => 'Human Resource Management Unit',
                'code' => 'HRMU',
            ],
            [
                'name' => 'Records Unit',
                'code' => 'RU',
            ],
            [
                'name' => 'Administrative Unit',
                'code' => 'AU',
            ],

            // Schools Governance and Operations
            [
                'name' => 'School Health and Nutrition Unit',
                'code' => 'SHNU',
            ],
            [
                'name' => 'Planning and Research Unit',
                'code' => 'PRU',
            ],
                        [
                'name' => 'Legal Unit',
                'code' => 'LU',
            ],
        ];

        Department::upsert(
            $departments,
            ['code'],
            ['name']
        );
    }
}
