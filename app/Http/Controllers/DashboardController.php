<?php
namespace App\Http\Controllers;
use App\Models\Department;
use App\Models\Procurement;
use App\Models\ProcurementRoute;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
class DashboardController extends Controller
{
    public function user_dashboard()
    {
        $user = auth()->user();
        $departmentId = $user->department_id;

        /*
        |--------------------------------------------------------------------------
        | User's Procurement Records
        |--------------------------------------------------------------------------
        */
        $procurements = Procurement::query()
            ->where('current_department_id', $departmentId)
            ->with([
                'currentDepartment',
                'latestRoute.fromDepartment',
                'latestRoute.toDepartment',
                'latestRoute.forwardedBy',
                'latestRoute.receivedBy',
            ])
            ->latest()
            ->paginate(10);

        $procurements->through(function ($procurement) use ($departmentId) {

            $isCompleted = $procurement->status === Procurement::STAGE_7;

            $stageNumber = (int) str_replace(
                'stage_',
                '',
                $procurement->status
            );

            return [
                'id' => $procurement->id,
                'pr_no' => $procurement->pr_no,
                'project_title' => $procurement->project_title,
                'purpose' => $procurement->purpose,
                'end_user' => $procurement->end_user,
                'abc' => $procurement->abc,
                'mode_of_procurement' => $procurement->mode_of_procurement,

                'status' => $procurement->status,
                'stage_number' => $stageNumber,
                'is_completed' => $isCompleted,

                'requires_my_action' =>
                    $procurement->current_department_id === $departmentId
                    && !$isCompleted,

                'current_department' =>
                    $procurement->currentDepartment?->name,

                'current_department_id' =>
                    $procurement->current_department_id,

                'latest_route' => $procurement->latestRoute ? [
                    'id' => $procurement->latestRoute->id,

                    'from_department' =>
                        $procurement->latestRoute->fromDepartment?->name,

                    'to_department' =>
                        $procurement->latestRoute->toDepartment?->name,

                    'forwarded_by' =>
                        $procurement->latestRoute->forwardedBy?->name,

                    'received_by' =>
                        $procurement->latestRoute->receivedBy?->name,

                    'action' =>
                        $procurement->latestRoute->action,

                    'stage' =>
                        $procurement->latestRoute->stage,

                    'remarks' =>
                        $procurement->latestRoute->remarks,

                    'forwarded_at' =>
                        $procurement->latestRoute->forwarded_at,

                    'received_at' =>
                        $procurement->latestRoute->received_at,
                ] : null,
            ];
        });

        /*
        |--------------------------------------------------------------------------
        | Dashboard Statistics
        |--------------------------------------------------------------------------
        */
        $stats = [
            'total' => Procurement::where(
                'current_department_id',
                $departmentId
            )->count(),

            'myQueue' => Procurement::where(
                'current_department_id',
                $departmentId
            )
                ->where('status', '!=', Procurement::STAGE_7)
                ->count(),

            'inProgress' => Procurement::where(
                'current_department_id',
                $departmentId
            )
                ->where('status', '!=', Procurement::STAGE_7)
                ->count(),

            'completed' => Procurement::where(
                'current_department_id',
                $departmentId
            )
                ->where('status', Procurement::STAGE_7)
                ->count(),
        ];

        /*
        |--------------------------------------------------------------------------
        | Latest 5 Routing Activities
        |--------------------------------------------------------------------------
        */
        $latestRoutes = ProcurementRoute::query()
            ->where(function ($query) use ($departmentId) {
                $query
                    ->where('from_department_id', $departmentId)
                    ->orWhere('to_department_id', $departmentId);
            })
            ->with([
                'procurement:id,pr_no,project_title,status',
                'fromDepartment:id,name',
                'toDepartment:id,name',
                'forwardedBy:id,name',
                'receivedBy:id,name',
            ])
            ->latest('updated_at')
            ->take(5)
            ->get()
            ->map(function ($route) {
                return [
                    'id' => $route->id,

                    'procurement_id' =>
                        $route->procurement_id,

                    'pr_no' =>
                        $route->procurement?->pr_no,

                    'project_title' =>
                        $route->procurement?->project_title,

                    'action' =>
                        $route->action,

                    'stage' =>
                        $route->stage,

                    'from_department' =>
                        $route->fromDepartment?->name,

                    'to_department' =>
                        $route->toDepartment?->name,

                    'forwarded_by' =>
                        $route->forwardedBy?->name,

                    'received_by' =>
                        $route->receivedBy?->name,

                    'remarks' =>
                        $route->remarks,

                    'forwarded_at' =>
                        $route->forwarded_at,

                    'received_at' =>
                        $route->received_at,

                    'updated_at' =>
                        $route->updated_at,
                ];
            });

        /*
        |--------------------------------------------------------------------------
        | Dashboard
        |--------------------------------------------------------------------------
        */
        return Inertia::render('Procurement/Index', [
            'procurements' => $procurements,
            'departments' => Department::pluck('name', 'id')->toArray(),

            'latestRoutes' => $latestRoutes,

            'stats' => $stats,

            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'department_id' => $departmentId,
                'department' => $user->department?->name,
            ],
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
