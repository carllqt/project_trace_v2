<?php

namespace Database\Seeders;

use App\Models\Department;
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

        /*
        |--------------------------------------------------------------------------
        | Departments
        |--------------------------------------------------------------------------
        */

        $departments = Department::pluck('id', 'code');

        $requiredDepartments = [
            'PU',
            'ACU',
            'BU',
            'CU',
            'SU',
        ];

        foreach ($requiredDepartments as $code) {
            if (!$departments->has($code)) {
                $this->command->warn(
                    "Department with code {$code} was not found."
                );

                return;
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Forwarded By
        |--------------------------------------------------------------------------
        */

        $forwardedBy = User::whereHas('roles', function ($query) {
            $query->where('name', 'admin');
        })->value('id');

        if (!$forwardedBy) {
            $forwardedBy = User::where('role', 'user')->value('id');
        }

        if (!$forwardedBy) {
            $this->command->warn(
                'No suitable user found for forwarded_by.'
            );

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Clear Existing Routes
        |--------------------------------------------------------------------------
        */

        ProcurementRoute::query()->delete();

        /*
        |--------------------------------------------------------------------------
        | Seed Routes
        |--------------------------------------------------------------------------
        */

        foreach ($procurements as $procurement) {
            $this->seedRoutesForProcurement(
                $procurement,
                $forwardedBy,
                $departments
            );
        }

        $this->command->info(
            'Realistic procurement route history seeded successfully.'
        );
    }

    /**
     * Create routing history for one procurement.
     */
    private function seedRoutesForProcurement(
        Procurement $procurement,
        int $forwardedBy,
        $departments
    ): void {
        $pu = $departments->get('PU');
        $acu = $departments->get('ACU');
        $bu = $departments->get('BU');
        $cu = $departments->get('CU');
        $su = $departments->get('SU');

        $endUser = $procurement->end_user_department_id;

        /*
        |--------------------------------------------------------------------------
        | Determine Current Stage
        |--------------------------------------------------------------------------
        */

        $stageNumber = (int) str_replace(
            'stage_',
            '',
            $procurement->status
        );

        /*
        |--------------------------------------------------------------------------
        | Realistic Workflow
        |--------------------------------------------------------------------------
        |
        | Stage 1:
        | End User → Procurement Unit
        |
        | Stage 2:
        | Procurement Unit → Accounting
        |
        | Stage 3:
        | Accounting → Budget
        |
        | Stage 4:
        | Budget → Cash
        |
        | Stage 5:
        | Cash → Supply
        |
        | Stage 6:
        | Supply → Procurement
        |
        | Stage 7:
        | Procurement → End User
        |
        */

        $workflow = [
            1 => [
                'from' => $endUser,
                'to' => $pu,
                'remarks' =>
                    'Purchase request forwarded to Procurement Unit for processing.',
            ],

            2 => [
                'from' => $pu,
                'to' => $acu,
                'remarks' =>
                    'Procurement documents processed and forwarded to Accounting Unit for review.',
            ],

            3 => [
                'from' => $acu,
                'to' => $bu,
                'remarks' =>
                    'Financial documents reviewed and forwarded to Budget Unit for certification.',
            ],

            4 => [
                'from' => $bu,
                'to' => $cu,
                'remarks' =>
                    'Budget certification completed and documents forwarded to Cash Unit.',
            ],

            5 => [
                'from' => $cu,
                'to' => $su,
                'remarks' =>
                    'Payment processing completed and documents forwarded to Supply Unit.',
            ],

            6 => [
                'from' => $su,
                'to' => $pu,
                'remarks' =>
                    'Supply processing completed and procurement documents returned to Procurement Unit.',
            ],

            7 => [
                'from' => $pu,
                'to' => $endUser,
                'remarks' =>
                    'Procurement processing completed and documents forwarded to the End User.',
            ],
        ];

        /*
        |--------------------------------------------------------------------------
        | Base Date
        |--------------------------------------------------------------------------
        */

        $baseDate = Carbon::now()
            ->subDays(30)
            ->addDays(($procurement->id - 1) % 15)
            ->setTime(8, 30);

        /*
        |--------------------------------------------------------------------------
        | Create Previous Routes
        |--------------------------------------------------------------------------
        |
        | If the procurement is currently at Stage N,
        | create the route history leading up to Stage N.
        |
        */

        for ($stage = 1; $stage <= $stageNumber; $stage++) {
            if (!isset($workflow[$stage])) {
                continue;
            }

            $route = $workflow[$stage];

            $forwardedAt = $baseDate
                ->copy()
                ->addDays(($stage - 1) * 2)
                ->setTime(
                    8 + (($procurement->id + $stage) % 3),
                    30
                );

            /*
            |--------------------------------------------------------------------------
            | Current Route
            |--------------------------------------------------------------------------
            |
            | Some current routes remain unreceived so they appear
            | on the Incoming page.
            |
            */

            $isCurrentRoute = $stage === $stageNumber;

            /*
            | Rough distribution:
            |
            | PR 1 → received
            | PR 2 → incoming
            | PR 3 → received
            | PR 4 → incoming
            | ...
            |
            */

            $isIncoming =
                $isCurrentRoute &&
                ($procurement->id % 2 === 0);

            /*
            |--------------------------------------------------------------------------
            | Incoming Route
            |--------------------------------------------------------------------------
            */

            if ($isIncoming) {
                ProcurementRoute::create([
                    'procurement_id' => $procurement->id,

                    'from_department_id' => $route['from'],

                    'to_department_id' => $route['to'],

                    'forwarded_by' => $forwardedBy,

                    'received_by' => null,

                    'stage' => Procurement::stageFromNumber($stage),

                    'action' => 'Forwarded',

                    'remarks' => $route['remarks'],

                    'forwarded_at' => $forwardedAt,

                    'received_at' => null,
                ]);

                /*
                |--------------------------------------------------------------------------
                | Current Department
                |--------------------------------------------------------------------------
                */

                $procurement->update([
                    'current_department_id' => $route['to'],
                ]);

                continue;
            }

            /*
            |--------------------------------------------------------------------------
            | Received Route
            |--------------------------------------------------------------------------
            */

            $receivedAt = $forwardedAt
                ->copy()
                ->addHours(2)
                ->addMinutes(
                    ($procurement->id + $stage) % 45
                );

            ProcurementRoute::create([
                'procurement_id' => $procurement->id,

                'from_department_id' => $route['from'],

                'to_department_id' => $route['to'],

                'forwarded_by' => $forwardedBy,

                'received_by' => $forwardedBy,

                'stage' => Procurement::stageFromNumber($stage),

                'action' => 'Forwarded',

                'remarks' => $route['remarks'],

                'forwarded_at' => $forwardedAt,

                'received_at' => $receivedAt,
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Ensure Current Department Matches Current Stage
        |--------------------------------------------------------------------------
        */

        if (isset($workflow[$stageNumber])) {
            $procurement->update([
                'current_department_id' =>
                    $workflow[$stageNumber]['to'],
            ]);
        }
    }
}
