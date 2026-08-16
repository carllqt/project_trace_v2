<?php
namespace App\Http\Controllers;
use App\Models\CAPA;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
class CAPAController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $canManage = $request->user()?->hasRole('admin') ?? false;
        $calendarMonth = $request->string('month')->toString();

        if (! preg_match('/^\d{4}-(0[1-9]|1[0-2])$/', $calendarMonth)) {
            $calendarMonth = now()->format('Y-m');
        }

        $monthStart = CarbonImmutable::createFromFormat('Y-m-d', $calendarMonth.'-01')->startOfMonth();

        return Inertia::render('CAPA/Calendar', [
            'activities' => $canManage
                ? CAPA::query()->orderBy('date')->paginate(5)->withQueryString()
                : null,
            'calendarActivities' => CAPA::query()
                ->select(['id', 'date', 'activity'])
                ->whereBetween('date', [$monthStart, $monthStart->endOfMonth()])
                ->orderBy('date')
                ->get(),
            'calendarMonth' => $calendarMonth,
            'canManage' => $canManage,
        ]);
    }

    public function management()
    {
        abort_unless(auth()->user()?->hasRole('admin'), 403);

        return redirect()->route('capa.index');
    }

    public function downloadTemplate(Request $request)
    {
        abort_unless($request->user()?->hasRole('admin'), 403);

        $path = public_path('templates/capa_template.xlsx');

        abort_unless(is_file($path), 404);

        return response()->download($path, 'capa_template.xlsx');
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
        abort_unless($request->user()?->hasRole('admin'), 403);

        $data = $request->validate([
            'date' => ['required', 'date'],
            'activity' => ['required', 'string', 'max:2000'],
            'participants' => ['nullable', 'string', 'max:2000'],
            'lead_division' => ['nullable', 'string', 'max:255'],
            'venue' => ['nullable', 'string', 'max:255'],
            'remarks' => ['nullable', 'string', 'max:2000'],
        ]);

        CAPA::create($data);

        return back()->with('success', 'CAPA activity added successfully.');
    }

    public function import(Request $request)
    {
        abort_unless($request->user()?->hasRole('admin'), 403);

        $data = $request->validate([
            'rows' => ['required', 'array', 'min:1', 'max:1000'],
            'rows.*.date' => ['required', 'date'],
            'rows.*.activity' => ['required', 'string', 'max:2000'],
            'rows.*.participants' => ['nullable', 'string', 'max:2000'],
            'rows.*.lead_division' => ['nullable', 'string', 'max:255'],
            'rows.*.venue' => ['nullable', 'string', 'max:255'],
            'rows.*.remarks' => ['nullable', 'string', 'max:2000'],
        ]);

        DB::transaction(fn () => collect($data['rows'])->each(
            fn (array $row) => CAPA::create($row)
        ));

        return back()->with('success', count($data['rows']).' CAPA activities imported.');
    }
    /**
     * Display the specified resource.
     */
    public function show(CAPA $cAPA)
    {
        //
    }
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CAPA $cAPA)
    {
        //
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CAPA $cAPA)
    {
        abort_unless($request->user()?->hasRole('admin'), 403);

        $data = $request->validate([
            'date' => ['required', 'date'],
            'activity' => ['required', 'string', 'max:2000'],
            'participants' => ['nullable', 'string', 'max:2000'],
            'lead_division' => ['nullable', 'string', 'max:255'],
            'venue' => ['nullable', 'string', 'max:255'],
            'remarks' => ['nullable', 'string', 'max:2000'],
        ]);

        $cAPA->update($data);

        return back()->with('success', 'CAPA activity updated successfully.');
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CAPA $cAPA)
    {
        abort_unless(request()->user()?->hasRole('admin'), 403);
        $cAPA->delete();

        return back()->with('success', 'CAPA activity deleted.');
    }
}
