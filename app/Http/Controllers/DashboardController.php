<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Procurement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function user_dashboard()
    {
        $userDepartmentId = auth()->user()->department_id;

        $search = request('search');
        $queue = request('queue');
        $department = request('department');
        $status = request('status');

        /*
        |--------------------------------------------------------------------------
        | Base Filtered Query
        |--------------------------------------------------------------------------
        */
        $filteredQuery = Procurement::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query
                        ->where('pr_no', 'like', "%{$search}%")
                        ->orWhere('project_title', 'like', "%{$search}%")
                        ->orWhere('purpose', 'like', "%{$search}%")
                        ->orWhere('end_user', 'like', "%{$search}%")
                        ->orWhere(
                            'mode_of_procurement',
                            'like',
                            "%{$search}%"
                        );
                });
            })

            ->when($department, function ($query, $department) {
                $query->where(
                    'current_department_id',
                    $department
                );
            })

            ->when($status, function ($query, $status) {
                $query->where('status', $status);
            })

            ->when($queue === 'my_queue', function ($query) use ($userDepartmentId) {
                $query
                    ->where(
                        'current_department_id',
                        $userDepartmentId
                    )
                    ->where(
                        'status',
                        '!=',
                        Procurement::STAGE_7
                    );
            })

            ->when($queue === 'in_progress', function ($query) {
                $query->where(
                    'status',
                    '!=',
                    Procurement::STAGE_7
                );
            })

            ->when($queue === 'completed', function ($query) {
                $query->where(
                    'status',
                    Procurement::STAGE_7
                );
            });


        /*
        |--------------------------------------------------------------------------
        | KPI Statistics
        |--------------------------------------------------------------------------
        */
        $stats = [
            'total' => (clone $filteredQuery)->count(),

            'myQueue' => (clone $filteredQuery)
                ->where(
                    'current_department_id',
                    $userDepartmentId
                )
                ->where(
                    'status',
                    '!=',
                    Procurement::STAGE_7
                )
                ->count(),

            'inProgress' => (clone $filteredQuery)
                ->where(
                    'status',
                    '!=',
                    Procurement::STAGE_7
                )
                ->count(),

            'completed' => (clone $filteredQuery)
                ->where(
                    'status',
                    Procurement::STAGE_7
                )
                ->count(),
        ];


        /*
        |--------------------------------------------------------------------------
        | Paginated Procurements
        |--------------------------------------------------------------------------
        */
        $procurements = (clone $filteredQuery)
            ->with([
                'currentDepartment',

                'latestRoute.fromDepartment',
                'latestRoute.toDepartment',
                'latestRoute.forwardedBy',
                'latestRoute.receivedBy',
            ])
            ->latest()
            ->paginate(10)
            ->withQueryString();


        /*
        |--------------------------------------------------------------------------
        | Transform Paginated Data
        |--------------------------------------------------------------------------
        */
        $procurements->through(function ($procurement) use ($userDepartmentId) {

            $stageNumber = (int) str_replace(
                'stage_',
                '',
                $procurement->status
            );

            $isCompleted =
                $procurement->status === Procurement::STAGE_7;

            $requiresMyAction =
                $procurement->current_department_id === $userDepartmentId
                && !$isCompleted;

            $route = $procurement->latestRoute;

            return [
                /*
                |--------------------------------------------------------------------------
                | Procurement Information
                |--------------------------------------------------------------------------
                */
                'id' => $procurement->id,

                'pr_no' => $procurement->pr_no,

                'project_title' =>
                    $procurement->project_title,

                'purpose' =>
                    $procurement->purpose,

                'end_user' =>
                    $procurement->end_user,

                'abc' =>
                    $procurement->abc,

                'mode_of_procurement' =>
                    $procurement->mode_of_procurement,


                /*
                |--------------------------------------------------------------------------
                | Procurement Status
                |--------------------------------------------------------------------------
                */
                'status' =>
                    $procurement->status,

                'stage_number' =>
                    $stageNumber,

                'is_in_progress' =>
                    !$isCompleted,

                'is_completed' =>
                    $isCompleted,

                'requires_my_action' =>
                    $requiresMyAction,


                /*
                |--------------------------------------------------------------------------
                | Current Location
                |--------------------------------------------------------------------------
                */
                'current_department' =>
                    $procurement->currentDepartment?->name,

                'current_department_id' =>
                    $procurement->current_department_id,


                /*
                |--------------------------------------------------------------------------
                | Latest Route
                |--------------------------------------------------------------------------
                */
                'route' => $route ? [
                    'id' =>
                        $route->id,

                    'from_department' =>
                        $route->fromDepartment?->name,

                    'to_department' =>
                        $route->toDepartment?->name,

                    'forwarded_by' =>
                        $route->forwardedBy?->name,

                    'received_by' =>
                        $route->receivedBy?->name,

                    'stage' =>
                        $route->stage,

                    'action' =>
                        $route->action,

                    'remarks' =>
                        $route->remarks,

                    'forwarded_at' =>
                        $route->forwarded_at,

                    'received_at' =>
                        $route->received_at,
                ] : null,


                /*
                |--------------------------------------------------------------------------
                | Route Status
                |--------------------------------------------------------------------------
                */
                'route_status' => $isCompleted
                    ? 'completed'
                    : (
                        $requiresMyAction
                            ? 'action_required'
                            : 'in_route'
                    ),
            ];
        });


        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */
        return Inertia::render('Procurement/Index', [
            'departments' => Department::pluck(
                'name',
                'id'
            )->toArray(),

            'procurements' =>
                $procurements,

            'stats' =>
                $stats,

            'queryParams' =>
                request()->query(),
        ]);

    }
}
