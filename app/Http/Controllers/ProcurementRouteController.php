<?php
namespace App\Http\Controllers;
use App\Models\Department;
use App\Models\ProcurementRoute;
use Illuminate\Http\Request;
use Inertia\Inertia;
class ProcurementRouteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $queryParams = $request->query();

        $routes = ProcurementRoute::query()
            ->with([
                'procurement:id,pr_no,project_title,end_user',
                'fromDepartment:id,name,code',
                'toDepartment:id,name,code',
                'forwardedBy:id,name,position',
                'receivedBy:id,name,position',
            ])

            /*
            |--------------------------------------------------------------------------
            | User Access Restriction
            |--------------------------------------------------------------------------
            |
            | Admins can see all routes.
            |
            | Regular users can only see routes where their department is either:
            | - The originating department (from_department_id)
            | - The receiving department (to_department_id)
            |
            |--------------------------------------------------------------------------
            */
            ->when(
                !auth()->user()->hasRole('admin'),
                function ($query) {
                    $departmentId = auth()->user()->department_id;

                    $query->where(function ($query) use ($departmentId) {
                        $query
                            ->where('from_department_id', $departmentId)
                            ->orWhere('to_department_id', $departmentId);
                    });
                }
            )

            /*
            |--------------------------------------------------------------------------
            | Search
            |--------------------------------------------------------------------------
            */
            ->when(
                $request->filled('search'),
                function ($query) use ($request) {
                    $search = trim($request->input('search'));

                    $query->whereHas('procurement', function ($query) use ($search) {
                        $query
                            ->where('pr_no', 'like', "%{$search}%")
                            ->orWhere('project_title', 'like', "%{$search}%")
                            ->orWhere('end_user', 'like', "%{$search}%");
                    });
                }
            )

            /*
            |--------------------------------------------------------------------------
            | Current Department
            |--------------------------------------------------------------------------
            | Filters the department the route was sent TO
            |--------------------------------------------------------------------------
            */
            ->when(
                $request->filled('department'),
                function ($query) use ($request) {
                    $query->where(
                        'to_department_id',
                        $request->input('department')
                    );
                }
            )

            /*
            |--------------------------------------------------------------------------
            | Origin Department
            |--------------------------------------------------------------------------
            | Filters the department the route came FROM
            |--------------------------------------------------------------------------
            */
            ->when(
                $request->filled('origin_department'),
                function ($query) use ($request) {
                    $query->where(
                        'from_department_id',
                        $request->input('origin_department')
                    );
                }
            )

            /*
            |--------------------------------------------------------------------------
            | Stage
            |--------------------------------------------------------------------------
            */
            ->when(
                $request->filled('stage'),
                function ($query) use ($request) {
                    $query->where(
                        'stage',
                        $request->input('stage')
                    );
                }
            )

            /*
            |--------------------------------------------------------------------------
            | Action
            |--------------------------------------------------------------------------
            */
            ->when(
                $request->filled('action'),
                function ($query) use ($request) {
                    $query->where(
                        'action',
                        $request->input('action')
                    );
                }
            )

            ->latest('created_at')
            ->paginate(10)
            ->withQueryString();

        $departments = Department::query()
            ->orderBy('name')
            ->pluck('name', 'id');

        $actions = [
            'Forwarded' => 'Forwarded',
            'Retrieved' => 'Retrieved',
        ];

        $stages = [
            'stage_1' => 'Purchase Request',
            'stage_2' => 'Request for Quotation',
            'stage_3' => 'Purchase Order',
            'stage_4' => 'Delivery',
            'stage_5' => 'Project Implementation',
            'stage_6' => 'Payment Processing',
            'stage_7' => 'Completed',
        ];

        return Inertia::render('Admin/History/Index', [
            'routes' => $routes,
            'departments' => $departments,
            'actions' => $actions,
            'stages' => $stages,
            'queryParams' => $queryParams,
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
    public function show(ProcurementRoute $procurementRoute)
    {
        //
    }
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProcurementRoute $procurementRoute)
    {
        //
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProcurementRoute $procurementRoute)
    {
        //
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProcurementRoute $procurementRoute)
    {
        //
    }
}
