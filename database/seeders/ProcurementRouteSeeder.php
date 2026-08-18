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

        /*
        |--------------------------------------------------------------------------
        | Clear Existing Routes
        |--------------------------------------------------------------------------
        |
        | Recommended while developing/seeding test data.
        |
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
     * Create routing history for a procurement.
     */
    private function seedRoutesForProcurement(
        Procurement $procurement,
        int $forwardedBy,
        $departments
    ): void {
        /*
        |--------------------------------------------------------------------------
        | Department IDs
        |--------------------------------------------------------------------------
        */

        $procurementUnit = $departments->get('PU');
        $accountingUnit = $departments->get('ACU');
        $budgetUnit = $departments->get('BU');
        $cashUnit = $departments->get('CU');
        $supplyUnit = $departments->get('SU');

        $endUserDepartment = $procurement->end_user_department_id;

        /*
        |--------------------------------------------------------------------------
        | Base Date
        |--------------------------------------------------------------------------
        */

        $baseDate = Carbon::now()
            ->subDays(15)
            ->addDays($procurement->id % 7)
            ->setTime(9, 0);

        /*
        |--------------------------------------------------------------------------
        | Determine Procurement Progress
        |--------------------------------------------------------------------------
        |
        | Different PRs are placed at different points in the process.
        |
        */

        $progress = (($procurement->id - 1) % 7) + 1;

        /*
        |--------------------------------------------------------------------------
        | Route Definitions
        |--------------------------------------------------------------------------
        */

        $routes = [];

        /*
        |--------------------------------------------------------------------------
        | 1. End User → Procurement
        |--------------------------------------------------------------------------
        */

        $routes[] = [
            'from_department_id' => $endUserDepartment,
            'to_department_id' => $procurementUnit,
            'stage' => Procurement::STAGE_1,
            'action' => 'Forwarded',
            'remarks' =>
                'Purchase request forwarded to Procurement Unit for processing.',
        ];

        /*
        |--------------------------------------------------------------------------
        | 2. Procurement → Accounting
        |--------------------------------------------------------------------------
        */

        if ($progress >= 2) {
            $routes[] = [
                'from_department_id' => $procurementUnit,
                'to_department_id' => $accountingUnit,
                'stage' => Procurement::STAGE_2,
                'action' => 'Forwarded',
                'remarks' =>
                    'Procurement documents processed and forwarded to Accounting Unit for review.',
            ];
        }

        /*
        |--------------------------------------------------------------------------
        | 3. Accounting → Budget
        |--------------------------------------------------------------------------
        */

        if ($progress >= 3) {
            $routes[] = [
                'from_department_id' => $accountingUnit,
                'to_department_id' => $budgetUnit,
                'stage' => Procurement::STAGE_3,
                'action' => 'Forwarded',
                'remarks' =>
                    'Financial documents reviewed and forwarded to Budget Unit for certification.',
            ];
        }

        /*
        |--------------------------------------------------------------------------
        | 4. Budget → Cash
        |--------------------------------------------------------------------------
        */

        if ($progress >= 4) {
            $routes[] = [
                'from_department_id' => $budgetUnit,
                'to_department_id' => $cashUnit,
                'stage' => Procurement::STAGE_4,
                'action' => 'Forwarded',
                'remarks' =>
                    'Budget certification completed and documents forwarded to Cash Unit.',
            ];
        }

        /*
        |--------------------------------------------------------------------------
        | 5. Cash → Supply
        |--------------------------------------------------------------------------
        */

        if ($progress >= 5) {
            $routes[] = [
                'from_department_id' => $cashUnit,
                'to_department_id' => $supplyUnit,
                'stage' => Procurement::STAGE_5,
                'action' => 'Forwarded',
                'remarks' =>
                    'Payment processing completed and documents forwarded to Supply Unit.',
            ];
        }

        /*
        |--------------------------------------------------------------------------
        | 6. Supply → Procurement
        |--------------------------------------------------------------------------
        */

        if ($progress >= 6) {
            $routes[] = [
                'from_department_id' => $supplyUnit,
                'to_department_id' => $procurementUnit,
                'stage' => Procurement::STAGE_6,
                'action' => 'Forwarded',
                'remarks' =>
                    'Supply processing completed and procurement documents returned to Procurement Unit.',
            ];
        }

        /*
        |--------------------------------------------------------------------------
        | Create Routes
        |--------------------------------------------------------------------------
        */

        foreach ($routes as $index => $route) {

            $forwardedAt = $baseDate
                ->copy()
                ->addDays($index)
                ->setTime(
                    9 + ($index % 3),
                    30
                );

            /*
            |--------------------------------------------------------------------------
            | Last Route
            |--------------------------------------------------------------------------
            |
            | Every 3rd procurement is intentionally left unreceived.
            | This creates realistic Incoming PRs.
            |
            */

            $isLastRoute = $index === array_key_last($routes);

            $shouldRemainIncoming =
                $isLastRoute &&
                in_array(
                    $procurement->id % 3,
                    [1, 2]
                );

            if ($shouldRemainIncoming) {

                ProcurementRoute::create([
                    'procurement_id' => $procurement->id,

                    'from_department_id' =>
                        $route['from_department_id'],

                    'to_department_id' =>
                        $route['to_department_id'],

                    'forwarded_by' =>
                        $forwardedBy,

                    'received_by' => null,

                    'stage' =>
                        $route['stage'],

                    'action' =>
                        $route['action'],

                    'remarks' =>
                        $route['remarks'],

                    'forwarded_at' =>
                        $forwardedAt,

                    'received_at' => null,
                ]);

                /*
                |--------------------------------------------------------------------------
                | Current Department
                |--------------------------------------------------------------------------
                */

                $procurement->update([
                    'current_department_id' =>
                        $route['to_department_id'],
                ]);

                continue;
            }

            /*
            |--------------------------------------------------------------------------
            | Normal Received Route
            |--------------------------------------------------------------------------
            */

            $receivedAt = $forwardedAt
                ->copy()
                ->addHours(3);

            ProcurementRoute::create([
                'procurement_id' =>
                    $procurement->id,

                'from_department_id' =>
                    $route['from_department_id'],

                'to_department_id' =>
                    $route['to_department_id'],

                'forwarded_by' =>
                    $forwardedBy,

                'received_by' =>
                    $forwardedBy,

                'stage' =>
                    $route['stage'],

                'action' =>
                    $route['action'],

                'remarks' =>
                    $route['remarks'],

                'forwarded_at' =>
                    $forwardedAt,

                'received_at' =>
                    $receivedAt,
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Current Department
        |--------------------------------------------------------------------------
        */

        $lastRoute = end($routes);

        if ($lastRoute) {
            $procurement->update([
                'current_department_id' =>
                    $lastRoute['to_department_id'],
            ]);
        }
    }
}
