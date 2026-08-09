<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Procurement;
use Illuminate\Database\Seeder;

class ProcurementSeeder extends Seeder
{
    public function run(): void
    {
        $departments = Department::pluck('id')->toArray();

        if (empty($departments)) {
            $this->command->warn(
                'No departments found. Please seed departments first.'
            );

            return;
        }

        $procurements = [
            [
                'pr_no' => 'PR-2026-001',
                'project_title' => 'Procurement of Office Supplies',
                'purpose' => 'To replenish essential office supplies for daily operations.',
                'end_user' => 'Administrative Unit',
                'abc' => 150000.00,
                'mode_of_procurement' => 'Small Value Procurement',
                'status' => Procurement::STAGE_1,
            ],
            [
                'pr_no' => 'PR-2026-002',
                'project_title' => 'Purchase of Desktop Computers',
                'purpose' => 'To provide computer units for office personnel.',
                'end_user' => 'ICT Unit',
                'abc' => 850000.00,
                'mode_of_procurement' => 'Public Bidding',
                'status' => Procurement::STAGE_2,
            ],
            [
                'pr_no' => 'PR-2026-003',
                'project_title' => 'Procurement of Printer and Toner Supplies',
                'purpose' => 'To support printing and document processing requirements.',
                'end_user' => 'Records Section',
                'abc' => 280000.00,
                'mode_of_procurement' => 'Small Value Procurement',
                'status' => Procurement::STAGE_3,
            ],
            [
                'pr_no' => 'PR-2026-004',
                'project_title' => 'School Furniture Procurement',
                'purpose' => 'To provide tables and chairs for identified classrooms.',
                'end_user' => 'Schools Management Unit',
                'abc' => 1250000.00,
                'mode_of_procurement' => 'Public Bidding',
                'status' => Procurement::STAGE_4,
            ],
            [
                'pr_no' => 'PR-2026-005',
                'project_title' => 'Vehicle Maintenance Services',
                'purpose' => 'To maintain serviceable condition of government vehicles.',
                'end_user' => 'General Services Unit',
                'abc' => 350000.00,
                'mode_of_procurement' => 'Small Value Procurement',
                'status' => Procurement::STAGE_5,
            ],
            [
                'pr_no' => 'PR-2026-006',
                'project_title' => 'Procurement of Learning Materials',
                'purpose' => 'To support instructional and learning activities.',
                'end_user' => 'Curriculum Implementation Division',
                'abc' => 975000.00,
                'mode_of_procurement' => 'Public Bidding',
                'status' => Procurement::STAGE_6,
            ],
            [
                'pr_no' => 'PR-2026-007',
                'project_title' => 'Purchase of Network Equipment',
                'purpose' => 'To improve office network connectivity.',
                'end_user' => 'ICT Unit',
                'abc' => 425000.00,
                'mode_of_procurement' => 'Small Value Procurement',
                'status' => Procurement::STAGE_7,
            ],
        ];

        // Generate the remaining 23 records.
        for ($i = 8; $i <= 30; $i++) {
            $procurements[] = [
                'pr_no' => sprintf('PR-2026-%03d', $i),
                'project_title' => fake()->randomElement([
                    'Procurement of ICT Equipment',
                    'Purchase of Office Furniture',
                    'Procurement of Cleaning Supplies',
                    'Printing of Official Forms and Materials',
                    'Purchase of Audio-Visual Equipment',
                    'Procurement of Medical and First Aid Supplies',
                    'Purchase of Training Materials',
                    'Procurement of Office Equipment',
                    'Purchase of Communication Equipment',
                    'Procurement of Maintenance Supplies',
                ]),
                'purpose' => fake()->sentence(12),
                'end_user' => fake()->randomElement([
                    'Administrative Unit',
                    'ICT Unit',
                    'Finance Unit',
                    'Records Section',
                    'General Services Unit',
                    'Planning Unit',
                    'Schools Management Unit',
                    'Curriculum Implementation Division',
                ]),
                'abc' => fake()->randomFloat(2, 50000, 2500000),
                'mode_of_procurement' => fake()->randomElement([
                    'Small Value Procurement',
                    'Public Bidding',
                    'Direct Contracting',
                    'Negotiated Procurement',
                    'Shopping',
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
            ];
        }

        foreach ($procurements as $procurement) {
            Procurement::create([
                ...$procurement,
                'current_department_id' => fake()->randomElement($departments),
            ]);
        }
    }
}

