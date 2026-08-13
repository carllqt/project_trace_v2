<?php
namespace App\Http\Controllers;
use App\Models\Department;
use App\Models\Procurement;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
        $department = request('department');
        $status = request('status');

        /*
        |--------------------------------------------------------------------------
        | Base Query
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
            ->when($department, function ($query, $department) {
                $query->where(
                    'current_department_id',
                    $department
                );
            })
            ->when($status, function ($query, $status) {
                $query->where('status', $status);
            });

        /*
        |--------------------------------------------------------------------------
        | BASIC COUNTS
        |--------------------------------------------------------------------------
        */

        $total = (clone $filteredQuery)->count();

        $completed = (clone $filteredQuery)
            ->where('status', Procurement::STAGE_7)
            ->count();

        $inProgress = (clone $filteredQuery)
            ->where('status', '!=', Procurement::STAGE_7)
            ->count();

        /*
        |--------------------------------------------------------------------------
        | BUDGET SUMMARY
        |--------------------------------------------------------------------------
        */

        $totalBudget = (clone $filteredQuery)->sum('abc');

        $completedBudget = (clone $filteredQuery)
            ->where('status', Procurement::STAGE_7)
            ->sum('abc');

        $inProgressBudget = (clone $filteredQuery)
            ->where('status', '!=', Procurement::STAGE_7)
            ->sum('abc');

        /*
        |--------------------------------------------------------------------------
        | COMPLETION RATE
        |--------------------------------------------------------------------------
        */

        $completionRate = $total > 0
            ? round(($completed / $total) * 100, 1)
            : 0;

        /*
        |--------------------------------------------------------------------------
        | STAGE DISTRIBUTION
        |--------------------------------------------------------------------------
        */

        $stageDistribution = (clone $filteredQuery)
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->orderBy('status')
            ->get()
            ->map(function ($item) {

                $stageNumber = (int) str_replace(
                    'stage_',
                    '',
                    $item->status
                );

                return [
                    'stage' => $stageNumber,
                    'status' => $item->status,
                    'total' => (int) $item->total,
                ];
            })
            ->values();

        /*
        |--------------------------------------------------------------------------
        | STATUS SUMMARY
        |--------------------------------------------------------------------------
        */

        $statusSummary = [
            [
                'label' => 'In Progress',
                'value' => $inProgress,
            ],
            [
                'label' => 'Completed',
                'value' => $completed,
            ],
        ];

        /*
        |--------------------------------------------------------------------------
        | CURRENT DEPARTMENT WORKLOAD
        |--------------------------------------------------------------------------
        */

        $departmentWorkload = (clone $filteredQuery)
            ->with('currentDepartment')
            ->selectRaw(
                'current_department_id, COUNT(*) as total, SUM(abc) as budget'
            )
            ->whereNotNull('current_department_id')
            ->groupBy('current_department_id')
            ->get()
            ->map(function ($item) {
                return [
                    'department_id' => $item->current_department_id,
                    'department' =>
                        $item->currentDepartment?->name ?? 'Unknown',
                    'total' => (int) $item->total,
                    'budget' => (float) $item->budget,
                ];
            })
            ->sortByDesc('total')
            ->values();

        /*
        |--------------------------------------------------------------------------
        | END USER DISTRIBUTION
        |--------------------------------------------------------------------------
        */

        $endUserDistribution = (clone $filteredQuery)
            ->selectRaw('end_user, COUNT(*) as total, SUM(abc) as budget')
            ->whereNotNull('end_user')
            ->where('end_user', '!=', '')
            ->groupBy('end_user')
            ->orderByDesc('total')
            ->get()
            ->map(function ($item) {
                return [
                    'department' => $item->end_user,
                    'total' => (int) $item->total,
                    'budget' => (float) $item->budget,
                ];
            })
            ->values();

        /*
        |--------------------------------------------------------------------------
        | PROCUREMENT MODE DISTRIBUTION
        |--------------------------------------------------------------------------
        */

        $procurementModes = (clone $filteredQuery)
            ->selectRaw(
                'mode_of_procurement, COUNT(*) as total, SUM(abc) as budget'
            )
            ->whereNotNull('mode_of_procurement')
            ->where('mode_of_procurement', '!=', '')
            ->groupBy('mode_of_procurement')
            ->orderByDesc('total')
            ->get()
            ->map(function ($item) {
                return [
                    'mode' => $item->mode_of_procurement,
                    'total' => (int) $item->total,
                    'budget' => (float) $item->budget,
                ];
            })
            ->values();

        /*
        |--------------------------------------------------------------------------
        | MONTHLY PROCUREMENT TREND
        |--------------------------------------------------------------------------
        */

        $monthlyTrend = (clone $filteredQuery)
            ->selectRaw("
                YEAR(created_at) as year,
                MONTH(created_at) as month,
                COUNT(*) as total,
                SUM(abc) as budget
            ")
            ->groupBy(
                DB::raw('YEAR(created_at)'),
                DB::raw('MONTH(created_at)')
            )
            ->orderBy('year')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {

                $date = Carbon::create(
                    $item->year,
                    $item->month,
                    1
                );

                return [
                    'year' => (int) $item->year,
                    'month' => (int) $item->month,
                    'label' => $date->format('M Y'),
                    'total' => (int) $item->total,
                    'budget' => (float) $item->budget,
                ];
            })
            ->values();

        /*
        |--------------------------------------------------------------------------
        | MONTHLY COMPLETED TREND
        |--------------------------------------------------------------------------
        */

        $monthlyCompleted = (clone $filteredQuery)
            ->where('status', Procurement::STAGE_7)
            ->selectRaw("
                YEAR(updated_at) as year,
                MONTH(updated_at) as month,
                COUNT(*) as total,
                SUM(abc) as budget
            ")
            ->groupBy(
                DB::raw('YEAR(updated_at)'),
                DB::raw('MONTH(updated_at)')
            )
            ->orderBy('year')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {

                $date = Carbon::create(
                    $item->year,
                    $item->month,
                    1
                );

                return [
                    'year' => (int) $item->year,
                    'month' => (int) $item->month,
                    'label' => $date->format('M Y'),
                    'total' => (int) $item->total,
                    'budget' => (float) $item->budget,
                ];
            })
            ->values();

        /*
        |--------------------------------------------------------------------------
        | ROUTING SUMMARY
        |--------------------------------------------------------------------------
        */

        $routeSummary = DB::table('procurement_routes')
            ->join(
                'procurements',
                'procurements.id',
                '=',
                'procurement_routes.procurement_id'
            )
            ->when($search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query
                        ->where(
                            'procurements.pr_no',
                            'like',
                            "%{$search}%"
                        )
                        ->orWhere(
                            'procurements.project_title',
                            'like',
                            "%{$search}%"
                        );
                });
            })
            ->selectRaw("
                procurement_routes.action,
                COUNT(*) as total
            ")
            ->groupBy('procurement_routes.action')
            ->get()
            ->map(function ($item) {
                return [
                    'action' => $item->action,
                    'total' => (int) $item->total,
                ];
            })
            ->values();

        /*
        |--------------------------------------------------------------------------
        | TOTAL ROUTES
        |--------------------------------------------------------------------------
        */

        $totalRoutes = DB::table('procurement_routes')
            ->join(
                'procurements',
                'procurements.id',
                '=',
                'procurement_routes.procurement_id'
            )
            ->count();

        /*
        |--------------------------------------------------------------------------
        | RECENT PROCUREMENT ACTIVITY
        |--------------------------------------------------------------------------
        */

        $recentProcurements = (clone $filteredQuery)
            ->with('currentDepartment')
            ->latest()
            ->limit(8)
            ->get()
            ->map(function ($procurement) {

                return [
                    'id' => $procurement->id,
                    'pr_no' => $procurement->pr_no,
                    'project_title' => $procurement->project_title,
                    'end_user' => $procurement->end_user,
                    'abc' => (float) $procurement->abc,
                    'status' => $procurement->status,
                    'current_department' =>
                        $procurement->currentDepartment?->name,
                    'created_at' => $procurement->created_at,
                ];
            })
            ->values();

        /*
        |--------------------------------------------------------------------------
        | LARGEST PROCUREMENTS
        |--------------------------------------------------------------------------
        */

        $largestProcurements = (clone $filteredQuery)
            ->with('currentDepartment')
            ->orderByDesc('abc')
            ->limit(10)
            ->get()
            ->map(function ($procurement) {

                return [
                    'id' => $procurement->id,
                    'pr_no' => $procurement->pr_no,
                    'project_title' => $procurement->project_title,
                    'end_user' => $procurement->end_user,
                    'abc' => (float) $procurement->abc,
                    'status' => $procurement->status,
                    'current_department' =>
                        $procurement->currentDepartment?->name,
                ];
            })
            ->values();

        /*
        |--------------------------------------------------------------------------
        | DASHBOARD STATISTICS
        |--------------------------------------------------------------------------
        */

        $stats = [
            'total' => $total,

            'inProgress' => $inProgress,

            'completed' => $completed,

            'myQueue' => 0,

            'completionRate' => $completionRate,

            'totalBudget' => (float) $totalBudget,

            'completedBudget' => (float) $completedBudget,

            'inProgressBudget' => (float) $inProgressBudget,

            'totalRoutes' => $totalRoutes,
        ];

        /*
        |--------------------------------------------------------------------------
        | DASHBOARD DATA
        |--------------------------------------------------------------------------
        */

        $dashboardData = [

            /*
            | KPI / Summary
            */
            'stats' => $stats,

            /*
            | Pie / Doughnut Chart
            */
            'statusSummary' => $statusSummary,

            /*
            | Bar Chart
            */
            'stageDistribution' => $stageDistribution,

            /*
            | Department workload
            */
            'departmentWorkload' => $departmentWorkload,

            /*
            | End-user department distribution
            */
            'endUserDistribution' => $endUserDistribution,

            /*
            | Procurement method chart
            */
            'procurementModes' => $procurementModes,

            /*
            | Line / Area chart
            */
            'monthlyTrend' => $monthlyTrend,

            /*
            | Completed trend
            */
            'monthlyCompleted' => $monthlyCompleted,

            /*
            | Routing statistics
            */
            'routeSummary' => $routeSummary,

            /*
            | Recent activity
            */
            'recentProcurements' => $recentProcurements,

            /*
            | Highest-value procurements
            */
            'largestProcurements' => $largestProcurements,
        ];

        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        return Inertia::render('Admin/Dashboard', [
            'departments' => Department::pluck(
                'name',
                'id'
            )->toArray(),

            'dashboardData' => $dashboardData,

            'queryParams' => request()->query(),
        ]);
    }
}
