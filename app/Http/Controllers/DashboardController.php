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
    | Base Query
    | Only procurements currently assigned to the user's department
    |--------------------------------------------------------------------------
    */
    $filteredQuery = Procurement::query()
        ->where('current_department_id', $userDepartmentId)

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

        ->when($status, function ($query, $status) {
            $query->where('status', $status);
        })

        /*
        |--------------------------------------------------------------------------
        | Queue Filters
        |--------------------------------------------------------------------------
        */
        ->when($queue === 'my_queue', function ($query) {
            $query->where('status', '!=', Procurement::STAGE_7);
        })

        ->when($queue === 'in_progress', function ($query) {
            $query->where('status', '!=', Procurement::STAGE_7);
        })

        ->when($queue === 'completed', function ($query) {
            $query->where('status', Procurement::STAGE_7);
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
    public function admin_dashboard()
    {
        $search = request('search');
        $queue = request('queue');
        $department = request('department');
        $status = request('status');

        /*
        |--------------------------------------------------------------------------
        | Base Filtered Query
        |--------------------------------------------------------------------------
        | Admin can see ALL procurements.
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

            /*
            |--------------------------------------------------------------------------
            | Department Filter
            |--------------------------------------------------------------------------
            */
            ->when($department, function ($query, $department) {
                $query->where(
                    'current_department_id',
                    $department
                );
            })

            /*
            |--------------------------------------------------------------------------
            | Status Filter
            |--------------------------------------------------------------------------
            */
            ->when($status, function ($query, $status) {
                $query->where('status', $status);
            })

            /*
            |--------------------------------------------------------------------------
            | Queue Filters
            |--------------------------------------------------------------------------
            */
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
            /*
            | All procurements visible to admin
            */
            'total' => (clone $filteredQuery)->count(),

            /*
            | Admin has no department, so "my queue" is not applicable.
            |
            | If your frontend expects this value, return 0.
            */
            'myQueue' => 0,

            /*
            | All active procurements
            */
            'inProgress' => (clone $filteredQuery)
                ->where(
                    'status',
                    '!=',
                    Procurement::STAGE_7
                )
                ->count(),

            /*
            | All completed procurements
            */
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
        $procurements->through(function ($procurement) {

            $stageNumber = (int) str_replace(
                'stage_',
                '',
                $procurement->status
            );

            $isCompleted =
                $procurement->status === Procurement::STAGE_7;

            /*
            | Admin has no department.
            | Admin does not personally "own" a procurement queue.
            */
            $requiresMyAction = false;

            $route = $procurement->latestRoute;

            return [
                /*
                |--------------------------------------------------------------------------
                | Procurement Information
                |--------------------------------------------------------------------------
                */
                'id' => $procurement->id,

                'pr_no' =>
                    $procurement->pr_no,

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
                    : 'in_route',
            ];
        });

        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */
        return Inertia::render('Admin/Dashboard', [
            'departments' =>
                Department::pluck(
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
