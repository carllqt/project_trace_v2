<?php

namespace App\Http\Controllers;

use App\Models\ProcurementRoute;
use Illuminate\Http\Request;
use App\Models\Procurement;
use App\Models\Department;
use Inertia\Inertia;

class OutgoingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    private function getStageNumber(?string $status): int
    {
        if (!$status) {
            return 1;
        }

        if (preg_match('/^stage_(\d+)$/', $status, $matches)) {
            return (int) $matches[1];
        }

        return 1;
    }
    public function index(Request $request)
    {
        $user = auth()->user();

        /*
        |--------------------------------------------------------------------------
        | OUTGOING PROCUREMENTS
        |--------------------------------------------------------------------------
        |
        | Get every procurement that was forwarded by my department at least once.
        | The latest route is used for the information displayed in the table.
        |
        */
        $query = Procurement::query()
            ->with([
                'endUserDepartment:id,name,code',
                'currentDepartment:id,name,code',

                'routes' => function ($query) {
                    $query
                        ->with([
                            'fromDepartment:id,name,code',
                            'toDepartment:id,name,code',
                            'forwardedBy:id,name,position',
                            'receivedBy:id,name,position',
                        ])
                        ->orderByDesc('forwarded_at');
                },
            ])
            ->whereHas('routes', function ($query) use ($user) {
                $query
                    ->where('from_department_id', $user->department_id)
                    ->where('action', 'Forwarded');
            });

        /*
        |--------------------------------------------------------------------------
        | Search
        |--------------------------------------------------------------------------
        */
        if ($request->filled('search')) {
            $search = trim($request->search);

            $query->where(function ($q) use ($search) {
                $q->where('pr_no', 'like', "%{$search}%")
                    ->orWhere('project_title', 'like', "%{$search}%")
                    ->orWhere('end_user', 'like', "%{$search}%")
                    ->orWhere('purpose', 'like', "%{$search}%");
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Status / Stage
        |--------------------------------------------------------------------------
        */
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        /*
        |--------------------------------------------------------------------------
        | Latest Route Destination
        |--------------------------------------------------------------------------
        |
        | Only filter based on the CURRENT/LATEST route.
        |
        */
        if ($request->filled('department')) {
            $departmentId = $request->department;

            $query->whereHas('routes', function ($q) use ($departmentId) {
                $q->where('to_department_id', $departmentId)
                    ->whereColumn(
                        'forwarded_at',
                        '=',
                        function ($sub) {
                            $sub->selectRaw('MAX(r2.forwarded_at)')
                                ->from('procurement_routes as r2')
                                ->whereColumn(
                                    'r2.procurement_id',
                                    'procurement_routes.procurement_id'
                                );
                        }
                    );
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Date From
        |--------------------------------------------------------------------------
        |
        | Filter based on the latest route date.
        |
        */
        if ($request->filled('date_from')) {
            $dateFrom = $request->date_from;

            $query->whereHas('routes', function ($q) use ($dateFrom) {
                $q->whereDate('forwarded_at', '>=', $dateFrom)
                    ->whereColumn(
                        'forwarded_at',
                        '=',
                        function ($sub) {
                            $sub->selectRaw('MAX(r2.forwarded_at)')
                                ->from('procurement_routes as r2')
                                ->whereColumn(
                                    'r2.procurement_id',
                                    'procurement_routes.procurement_id'
                                );
                        }
                    );
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Date To
        |--------------------------------------------------------------------------
        */
        if ($request->filled('date_to')) {
            $dateTo = $request->date_to;

            $query->whereHas('routes', function ($q) use ($dateTo) {
                $q->whereDate('forwarded_at', '<=', $dateTo)
                    ->whereColumn(
                        'forwarded_at',
                        '=',
                        function ($sub) {
                            $sub->selectRaw('MAX(r2.forwarded_at)')
                                ->from('procurement_routes as r2')
                                ->whereColumn(
                                    'r2.procurement_id',
                                    'procurement_routes.procurement_id'
                                );
                        }
                    );
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Pagination
        |--------------------------------------------------------------------------
        */
        $procurements = $query
            ->orderByDesc('updated_at')
            ->paginate(10)
            ->withQueryString();

        /*
        |--------------------------------------------------------------------------
        | Transform
        |--------------------------------------------------------------------------
        */
        $procurements->getCollection()->transform(
            function ($procurement) use ($user) {

                /*
                | Get ONLY the latest route.
                */
                $latestRoute = $procurement->routes
                    ->sortByDesc('forwarded_at')
                    ->first();

                return [
                    /*
                    |--------------------------------------------------------------------------
                    | Procurement Information
                    |--------------------------------------------------------------------------
                    */
                    'id' => $procurement->id,

                    'pr_no' => $procurement->pr_no,

                    'project_title' => $procurement->project_title,

                    'purpose' => $procurement->purpose,

                    'end_user' => $procurement->end_user,

                    'end_user_department_id' =>
                        $procurement->end_user_department_id,

                    'end_user_department' =>
                        $procurement->endUserDepartment?->name,

                    'abc' => $procurement->abc,

                    'mode_of_procurement' =>
                        $procurement->mode_of_procurement,

                    /*
                    |--------------------------------------------------------------------------
                    | CURRENT PROCUREMENT STATE
                    |--------------------------------------------------------------------------
                    */
                    'status' => $procurement->status,

                    'stage' =>
                        $this->getStageNumber($procurement->status),

                    'current_department_id' =>
                        $procurement->current_department_id,

                    'current_department' =>
                        $procurement->currentDepartment?->name,

                    /*
                    |--------------------------------------------------------------------------
                    | LATEST ROUTE
                    |--------------------------------------------------------------------------
                    */
                    'latest_route' => $latestRoute
                        ? [
                            'id' => $latestRoute->id,

                            'from_department_id' =>
                                $latestRoute->from_department_id,

                            'from_department' =>
                                $latestRoute->fromDepartment?->name,

                            'to_department_id' =>
                                $latestRoute->to_department_id,

                            'to_department' =>
                                $latestRoute->toDepartment?->name,

                            'stage' =>
                                $latestRoute->stage,

                            'action' =>
                                $latestRoute->action,

                            'remarks' =>
                                $latestRoute->remarks,

                            'forwarded_by' =>
                                $latestRoute->forwardedBy?->name,

                            'received_by' =>
                                $latestRoute->receivedBy?->name,

                            'forwarded_at' =>
                                $latestRoute->forwarded_at,

                            'received_at' =>
                                $latestRoute->received_at,
                        ]
                        : null,

                    /*
                    |--------------------------------------------------------------------------
                    | FLAGS
                    |--------------------------------------------------------------------------
                    */
                    'was_sent_by_my_department' =>
                        $procurement->routes->contains(
                            fn ($route) =>
                                (int) $route->from_department_id ===
                                (int) $user->department_id
                        ),

                    'is_currently_in_my_department' =>
                        (int) $procurement->current_department_id ===
                        (int) $user->department_id,

                    'updated_at' =>
                        $procurement->updated_at,
                ];
            }
        );

        /*
        |--------------------------------------------------------------------------
        | Departments
        |--------------------------------------------------------------------------
        */
        $departments = Department::query()
            ->orderBy('name')
            ->pluck('name', 'id');
        return Inertia::render('Outgoing/Index', [
            'outgoingPRs' => $procurements,

            'filters' => [
                'search' =>
                    $request->search ?? '',

                'status' =>
                    $request->status ?? '',

                'department' =>
                    $request->department ?? '',

                'date_from' =>
                    $request->date_from ?? '',

                'date_to' =>
                    $request->date_to ?? '',
            ],

            'departments' => $departments,

            'department' =>
                $user->department?->name,

            'departmentId' =>
                $user->department_id,
        ]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
