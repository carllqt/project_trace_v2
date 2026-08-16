<?php

namespace Database\Seeders;

use App\Models\Procurement;
use App\Models\ProcurementRoute;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class ProcurementRouteSeeder extends Seeder
{
    /**
     * Seed procurement routing history.
     */
    public function run(): void
    {
        $procurements = Procurement::orderBy('id')->get();

        if ($procurements->isEmpty()) {
            $this->command->warn(
                'No procurements found. Please run ProcurementSeeder first.'
            );

            return;
        }

        $admin = User::whereHas('roles', function ($query) {
            $query->where('name', 'admin');
        })->first();

        $user = User::where('role', 'user')->first();

        $forwardedBy = $admin?->id ?? $user?->id;

        if (!$forwardedBy) {
            $this->command->warn(
                'No suitable user found for forwarded_by.'
            );

            return;
        }

        foreach ($procurements as $index => $procurement) {
            $this->seedRoutesForProcurement(
                $procurement,
                $forwardedBy
            );
        }

        $this->command->info(
            'Procurement route history seeded successfully.'
        );
    }

    /**
     * Create routing history for a procurement.
     */
    private function seedRoutesForProcurement(
        Procurement $procurement,
        int $forwardedBy
    ): void {
        /*
        |--------------------------------------------------------------------------
        | Department Flow
        |--------------------------------------------------------------------------
        |
        | 5  = ICT Unit
        | 10 = Procurement Unit
        | 6  = Accounting Unit
        | 7  = Budget Unit
        | 8  = Cash Unit
        |
        */

        $routes = [
            [
                'from_department_id' => 5,
                'to_department_id' => 10,
                'stage' => 'stage_1',
                'action' => 'Forwarded',
                'remarks' => 'Purchase request forwarded to Procurement Unit.',
            ],

            [
                'from_department_id' => 10,
                'to_department_id' => 6,
                'stage' => 'stage_2',
                'action' => 'Forwarded',
                'remarks' => 'Request for quotation processed and forwarded for accounting review.',
            ],

            [
                'from_department_id' => 6,
                'to_department_id' => 7,
                'stage' => 'stage_3',
                'action' => 'Forwarded',
                'remarks' => 'Purchase order forwarded for budget review.',
            ],

            [
                'from_department_id' => 7,
                'to_department_id' => 8,
                'stage' => 'stage_4',
                'action' => 'Forwarded',
                'remarks' => 'Budget reviewed and documents forwarded for payment processing.',
            ],

            [
                'from_department_id' => 8,
                'to_department_id' => 10,
                'stage' => 'stage_5',
                'action' => 'Forwarded',
                'remarks' => 'Payment documents processed and procurement returned to Procurement Unit.',
            ],
        ];

        /*
        |--------------------------------------------------------------------------
        | Create route records
        |--------------------------------------------------------------------------
        */

        $baseDate = Carbon::now()
            ->subDays(7)
            ->addDays($procurement->id % 5);

        foreach ($routes as $index => $route) {
            $forwardedAt = $baseDate->copy()
                ->addDays($index)
                ->setTime(9 + ($index % 3), 30);

            $receivedAt = $forwardedAt->copy()
                ->addHours(3);

            ProcurementRoute::updateOrCreate(
                [
                    'procurement_id' => $procurement->id,
                    'stage' => $route['stage'],
                    'action' => $route['action'],
                ],
                [
                    'from_department_id' => $route['from_department_id'],
                    'to_department_id' => $route['to_department_id'],
                    'forwarded_by' => $forwardedBy,
                    'received_by' => $forwardedBy,
                    'remarks' => $route['remarks'],
                    'forwarded_at' => $forwardedAt,
                    'received_at' => $receivedAt,
                ]
            );
        }
    }
}
