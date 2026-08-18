<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Procurement;
use Illuminate\Database\Seeder;

class ProcurementSeeder extends Seeder
{
    public function run(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Get Departments
        |--------------------------------------------------------------------------
        */

        $departments = Department::pluck('id', 'code');

        if ($departments->isEmpty()) {
            $this->command->warn(
                'No departments found. Please seed departments first.'
            );

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Helper
        |--------------------------------------------------------------------------
        */

        $department = function (string $code) use ($departments) {
            return $departments->get($code);
        };

        /*
        |--------------------------------------------------------------------------
        | Realistic Procurement Records
        |--------------------------------------------------------------------------
        */

        $procurements = [

            // -------------------------------------------------------------
            // 001 - Administrative Unit
            // -------------------------------------------------------------

            [
                'pr_no' => 'PR-2026-001',
                'project_title' => 'Procurement of Office Supplies',
                'purpose' =>
                    'To replenish essential office supplies required for the daily administrative operations of the Schools Division Office.',
                'end_user' => 'Administrative Officer',
                'end_user_department_id' => $department('AU'),
                'abc' => 150000.00,
                'mode_of_procurement' => 'Small Value Procurement',
                'status' => Procurement::STAGE_1,
                'current_department_id' => $department('AU'),
            ],

            // -------------------------------------------------------------
            // 002 - ICT Unit
            // -------------------------------------------------------------

            [
                'pr_no' => 'PR-2026-002',
                'project_title' => 'Purchase of Desktop Computers',
                'purpose' =>
                    'To provide additional computer units for personnel and improve the information technology capability of the Schools Division Office.',
                'end_user' => 'ICT Coordinator',
                'end_user_department_id' => $department('ICTU'),
                'abc' => 850000.00,
                'mode_of_procurement' => 'Public Bidding',
                'status' => Procurement::STAGE_2,
                'current_department_id' => $department('PU'),
            ],

            // -------------------------------------------------------------
            // 003 - Records Unit
            // -------------------------------------------------------------

            [
                'pr_no' => 'PR-2026-003',
                'project_title' => 'Procurement of Printer and Toner Supplies',
                'purpose' =>
                    'To support the continuous printing, reproduction, and processing of official records and documents.',
                'end_user' => 'Records Officer',
                'end_user_department_id' => $department('RU'),
                'abc' => 280000.00,
                'mode_of_procurement' => 'Small Value Procurement',
                'status' => Procurement::STAGE_3,
                'current_department_id' => $department('ACU'),
            ],

            // -------------------------------------------------------------
            // 004 - CID
            // -------------------------------------------------------------

            [
                'pr_no' => 'PR-2026-004',
                'project_title' => 'Procurement of Learning Materials',
                'purpose' =>
                    'To provide instructional and learning materials necessary to support curriculum implementation and instructional programs.',
                'end_user' => 'CID Program Coordinator',
                'end_user_department_id' => $department('CID'),
                'abc' => 975000.00,
                'mode_of_procurement' => 'Public Bidding',
                'status' => Procurement::STAGE_4,
                'current_department_id' => $department('PU'),
            ],

            // -------------------------------------------------------------
            // 005 - SHNU
            // -------------------------------------------------------------

            [
                'pr_no' => 'PR-2026-005',
                'project_title' => 'Procurement of Medical and Nutrition Supplies',
                'purpose' =>
                    'To provide essential medical, health, and nutrition supplies for the implementation of school health and nutrition programs.',
                'end_user' => 'School Health and Nutrition Program Coordinator',
                'end_user_department_id' => $department('SHNU'),
                'abc' => 350000.00,
                'mode_of_procurement' => 'Small Value Procurement',
                'status' => Procurement::STAGE_5,
                'current_department_id' => $department('SHNU'),
            ],

            // -------------------------------------------------------------
            // 006 - SGOD
            // -------------------------------------------------------------

            [
                'pr_no' => 'PR-2026-006',
                'project_title' => 'Procurement of Training Materials',
                'purpose' =>
                    'To support capacity-building activities, technical assistance, and professional development programs for school personnel.',
                'end_user' => 'SGOD Program Coordinator',
                'end_user_department_id' => $department('SGOD'),
                'abc' => 625000.00,
                'mode_of_procurement' => 'Small Value Procurement',
                'status' => Procurement::STAGE_6,
                'current_department_id' => $department('BU'),
            ],

            // -------------------------------------------------------------
            // 007 - ICT
            // -------------------------------------------------------------

            [
                'pr_no' => 'PR-2026-007',
                'project_title' => 'Purchase of Network Equipment',
                'purpose' =>
                    'To improve network connectivity, reliability, and infrastructure within the Schools Division Office.',
                'end_user' => 'ICT Coordinator',
                'end_user_department_id' => $department('ICTU'),
                'abc' => 425000.00,
                'mode_of_procurement' => 'Small Value Procurement',
                'status' => Procurement::STAGE_7,
                'current_department_id' => $department('ICTU'),
            ],

            // -------------------------------------------------------------
            // 008 - Budget
            // -------------------------------------------------------------

            [
                'pr_no' => 'PR-2026-008',
                'project_title' => 'Procurement of Office Equipment',
                'purpose' =>
                    'To provide necessary equipment for budget preparation, monitoring, and financial management activities.',
                'end_user' => 'Budget Officer',
                'end_user_department_id' => $department('BU'),
                'abc' => 225000.00,
                'mode_of_procurement' => 'Small Value Procurement',
                'status' => Procurement::STAGE_2,
                'current_department_id' => $department('PU'),
            ],

            // -------------------------------------------------------------
            // 009 - Accounting
            // -------------------------------------------------------------

            [
                'pr_no' => 'PR-2026-009',
                'project_title' => 'Procurement of Accounting Office Equipment',
                'purpose' =>
                    'To improve the efficiency of accounting operations and financial document processing.',
                'end_user' => 'Accountant',
                'end_user_department_id' => $department('ACU'),
                'abc' => 185000.00,
                'mode_of_procurement' => 'Small Value Procurement',
                'status' => Procurement::STAGE_3,
                'current_department_id' => $department('ACU'),
            ],

            // -------------------------------------------------------------
            // 010 - HRMU
            // -------------------------------------------------------------

            [
                'pr_no' => 'PR-2026-010',
                'project_title' => 'Procurement of Personnel Records Supplies',
                'purpose' =>
                    'To support personnel records management, employee documentation, and human resource administrative activities.',
                'end_user' => 'HR Management Officer',
                'end_user_department_id' => $department('HRMU'),
                'abc' => 120000.00,
                'mode_of_procurement' => 'Shopping',
                'status' => Procurement::STAGE_1,
                'current_department_id' => $department('HRMU'),
            ],

            // -------------------------------------------------------------
            // 011 - Planning
            // -------------------------------------------------------------

            [
                'pr_no' => 'PR-2026-011',
                'project_title' => 'Procurement of Planning and Monitoring Equipment',
                'purpose' =>
                    'To support planning, data analysis, monitoring, and reporting activities of the Schools Division Office.',
                'end_user' => 'Planning Officer',
                'end_user_department_id' => $department('PRU'),
                'abc' => 310000.00,
                'mode_of_procurement' => 'Small Value Procurement',
                'status' => Procurement::STAGE_2,
                'current_department_id' => $department('PRU'),
            ],

            // -------------------------------------------------------------
            // 012 - Legal
            // -------------------------------------------------------------

            [
                'pr_no' => 'PR-2026-012',
                'project_title' => 'Procurement of Legal Reference Materials',
                'purpose' =>
                    'To provide updated legal references and materials necessary for legal review and advisory services.',
                'end_user' => 'Legal Officer',
                'end_user_department_id' => $department('LU'),
                'abc' => 95000.00,
                'mode_of_procurement' => 'Shopping',
                'status' => Procurement::STAGE_1,
                'current_department_id' => $department('PU'),
            ],

            // -------------------------------------------------------------
            // 013 - Supply
            // -------------------------------------------------------------

            [
                'pr_no' => 'PR-2026-013',
                'project_title' => 'Procurement of Janitorial and Maintenance Supplies',
                'purpose' =>
                    'To maintain cleanliness, sanitation, and proper facility maintenance within the Schools Division Office.',
                'end_user' => 'Supply Officer',
                'end_user_department_id' => $department('SU'),
                'abc' => 275000.00,
                'mode_of_procurement' => 'Small Value Procurement',
                'status' => Procurement::STAGE_2,
                'current_department_id' => $department('SU'),
            ],

            // -------------------------------------------------------------
            // 014 - OASDS
            // -------------------------------------------------------------

            [
                'pr_no' => 'PR-2026-014',
                'project_title' => 'Procurement of Meeting and Conference Equipment',
                'purpose' =>
                    'To support meetings, coordination activities, and official conferences of the Schools Division Office.',
                'end_user' => 'Assistant Schools Division Superintendent',
                'end_user_department_id' => $department('OASDS'),
                'abc' => 480000.00,
                'mode_of_procurement' => 'Small Value Procurement',
                'status' => Procurement::STAGE_3,
                'current_department_id' => $department('PU'),
            ],

            // -------------------------------------------------------------
            // 015 - OSDS
            // -------------------------------------------------------------

            [
                'pr_no' => 'PR-2026-015',
                'project_title' => 'Procurement of Office Equipment for OSDS',
                'purpose' =>
                    'To provide reliable office equipment necessary for the administrative and executive functions of the Schools Division Superintendent.',
                'end_user' => 'Schools Division Superintendent',
                'end_user_department_id' => $department('OSDS'),
                'abc' => 550000.00,
                'mode_of_procurement' => 'Public Bidding',
                'status' => Procurement::STAGE_4,
                'current_department_id' => $department('ACU'),
            ],
        ];

        /*
        |--------------------------------------------------------------------------
        | Add Additional Realistic Records
        |--------------------------------------------------------------------------
        */

        $additionalRecords = [
            [
                'title' => 'Procurement of Communication Equipment',
                'purpose' => 'To improve official communication and coordination activities.',
                'user' => 'ICT Coordinator',
                'department' => 'ICTU',
            ],
            [
                'title' => 'Purchase of Office Furniture',
                'purpose' => 'To replace damaged and outdated office furniture.',
                'user' => 'Administrative Officer',
                'department' => 'AU',
            ],
            [
                'title' => 'Procurement of Printing Supplies',
                'purpose' => 'To support continuous printing of official documents and reports.',
                'user' => 'Records Officer',
                'department' => 'RU',
            ],
            [
                'title' => 'Procurement of School Health Supplies',
                'purpose' => 'To support school-based health and wellness activities.',
                'user' => 'School Health and Nutrition Program Coordinator',
                'department' => 'SHNU',
            ],
            [
                'title' => 'Purchase of Monitoring Equipment',
                'purpose' => 'To support monitoring and evaluation activities.',
                'user' => 'Planning Officer',
                'department' => 'PRU',
            ],
            [
                'title' => 'Procurement of Curriculum Resources',
                'purpose' => 'To support curriculum implementation and instructional supervision.',
                'user' => 'CID Program Coordinator',
                'department' => 'CID',
            ],
            [
                'title' => 'Purchase of Training Equipment',
                'purpose' => 'To support personnel development and training activities.',
                'user' => 'SGOD Program Coordinator',
                'department' => 'SGOD',
            ],
            [
                'title' => 'Procurement of Cash Office Equipment',
                'purpose' => 'To improve cash management and transaction processing.',
                'user' => 'Cashier',
                'department' => 'CU',
            ],
            [
                'title' => 'Procurement of Supply Management Equipment',
                'purpose' => 'To improve inventory and property management operations.',
                'user' => 'Supply Officer',
                'department' => 'SU',
            ],
            [
                'title' => 'Procurement of Legal Office Supplies',
                'purpose' => 'To support legal documentation and case management activities.',
                'user' => 'Legal Officer',
                'department' => 'LU',
            ],
            [
                'title' => 'Purchase of Human Resource Supplies',
                'purpose' => 'To support personnel records and human resource management activities.',
                'user' => 'HR Management Officer',
                'department' => 'HRMU',
            ],
            [
                'title' => 'Procurement of Budget Planning Equipment',
                'purpose' => 'To support budget preparation, monitoring, and reporting.',
                'user' => 'Budget Officer',
                'department' => 'BU',
            ],
            [
                'title' => 'Procurement of Accounting Supplies',
                'purpose' => 'To support financial reporting and accounting operations.',
                'user' => 'Accountant',
                'department' => 'ACU',
            ],
            [
                'title' => 'Purchase of Records Storage Equipment',
                'purpose' => 'To improve storage and preservation of official records.',
                'user' => 'Records Officer',
                'department' => 'RU',
            ],
            [
                'title' => 'Procurement of Administrative Equipment',
                'purpose' => 'To improve administrative service delivery and office operations.',
                'user' => 'Administrative Officer',
                'department' => 'AU',
            ],
        ];

        foreach ($additionalRecords as $index => $record) {
            $number = $index + 16;

            $procurements[] = [
                'pr_no' => sprintf(
                    'PR-2026-%03d',
                    $number
                ),

                'project_title' => $record['title'],

                'purpose' => $record['purpose'],

                'end_user' => $record['user'],

                'end_user_department_id' => $department(
                    $record['department']
                ),

                'abc' => fake()->randomFloat(
                    2,
                    75000,
                    1500000
                ),

                'mode_of_procurement' => fake()->randomElement([
                    'Small Value Procurement',
                    'Public Bidding',
                    'Shopping',
                    'Negotiated Procurement',
                ]),

                'status' => fake()->randomElement([
                    Procurement::STAGE_1,
                    Procurement::STAGE_2,
                    Procurement::STAGE_3,
                    Procurement::STAGE_4,
                    Procurement::STAGE_5,
                    Procurement::STAGE_6,
                    Procurement::STAGE_7,
                ]),

                /*
                |--------------------------------------------------------------------------
                | Current Department
                |--------------------------------------------------------------------------
                |
                | Some are still with the End User while others are already
                | being processed by Procurement, Accounting, Budget, etc.
                |
                */

                'current_department_id' => fake()->randomElement([
                    $department($record['department']),
                    $department('PU'),
                    $department('ACU'),
                    $department('BU'),
                    $department('SU'),
                ]),
            ];
        }

        /*
        |--------------------------------------------------------------------------
        | Insert / Update
        |--------------------------------------------------------------------------
        */

        foreach ($procurements as $procurement) {
            Procurement::updateOrCreate(
                [
                    'pr_no' => $procurement['pr_no'],
                ],
                $procurement
            );
        }

        $this->command->info(
            count($procurements) . ' procurement records seeded successfully.'
        );
    }
}
