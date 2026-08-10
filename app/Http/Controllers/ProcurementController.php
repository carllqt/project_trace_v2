<?php
namespace App\Http\Controllers;
use App\Http\Requests\StoreProcurementRequest;
use App\Models\Department;
use App\Models\Procurement;
use App\Models\ProcurementDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Models\Capa;
use App\Models\Delivery;
use App\Models\Payment;
use App\Models\ProcurementPr;
use App\Models\ProcurementRfq;
use App\Models\PurchaseOrder;
use Throwable;
class ProcurementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function store(StoreProcurementRequest $request)
    {
        $storedFiles = [];
        try {
            DB::transaction(function () use ($request, &$storedFiles) {
                $enduser = Department::findOrFail($request->end_user)->name;
                $procurement = Procurement::create([
                    'pr_no' => $request->pr_no,
                    'project_title' => $request->project_title,
                    'purpose' => $request->purpose,
                    'end_user' => $enduser,
                    'abc' => $request->abc,
                    'mode_of_procurement' => $request->mode_of_procurement,
                    'status' => Procurement::STAGE_1,
                    'current_department_id' => auth()->user()->department_id,
                    'date_of_implementation' => $request->date_of_implementation,
                ]);
                if ($request->hasFile('documents')) {
                    foreach ($request->file('documents') as $file) {
                        $filePath = $file->store(
                            "procurements/{$procurement->id}/documents",
                            'public'
                        );
                        // Track successfully stored files
                        $storedFiles[] = $filePath;
                        $procurement->documents()->create([
                            'stage' => 'Preparation of PR',
                            'document_type' => 'Supporting Document',
                            'original_name' => $file->getClientOriginalName(),
                            'stored_name' => basename($filePath),
                            'file_path' => $filePath,
                            'mime_type' => $file->getClientMimeType(),
                            'file_size' => $file->getSize(),
                            'uploaded_by' => auth()->id(),
                        ]);
                    }
                }
            });
            return redirect()
                ->route('procurement.index')
                ->with('success', 'Procurement created successfully.');
        } catch (\Throwable $e) {
            // Delete files if database operation failed
            foreach ($storedFiles as $filePath) {
                Storage::disk('public')->delete($filePath);
            }
            Log::error('Failed to create procurement.', [
                'message' => $e->getMessage(),
            ]);
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Failed to create procurement. Please try again.');
        }
    }
    /**
     * Display the specified resource.
     */
    public function show(Procurement $procurement)
    {
        $procurement->load([
            'department',
            'purchaseOrder',
            'implementation',
            'capa',
        ]);
        return response()->json(
            $procurement->getWorkflowData(
                auth()->user()
            )
        );
    }
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Procurement $procurement)
    {
        //
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Procurement $procurement)
    {
        //
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Procurement $procurement)
    {
        //
    }
    public function route(Request $request, Procurement $procurement)
    {
        $validated = $request->validate([
            'target_department' => ['required', 'string'],
            'remarks' => ['nullable', 'string'],
            'action' => ['required', 'in:forward,return'],
            'current_stage' => ['required', 'integer', 'min:1', 'max:6'],
            'stage_data' => ['nullable', 'array'],
            // PR
            'stage_data.pr' => ['nullable', 'array'],
            'stage_data.pr.pr_no' => ['nullable', 'string'],
            'stage_data.pr.project_title' => ['nullable', 'string'],
            'stage_data.pr.purpose' => ['nullable', 'string'],
            'stage_data.pr.end_user' => ['nullable', 'string'],
            'stage_data.pr.abc' => ['nullable'],
            'stage_data.pr.mode_of_procurement' => ['nullable', 'string'],
            // RFQ
            'stage_data.rfq' => ['nullable', 'array'],
            'stage_data.rfq.tin' => ['nullable', 'string'],
            'stage_data.rfq.winner_bidder' => ['nullable', 'string'],
            'stage_data.rfq.address_contract' => ['nullable', 'string'],
            'stage_data.rfq.contact_no' => ['nullable', 'string'],
            'stage_data.rfq.contract_amount' => ['nullable'],
            // PO
            'stage_data.po' => ['nullable', 'array'],
            'stage_data.po.po_no' => ['nullable', 'string'],
            'stage_data.po.po_date' => ['nullable', 'date'],
            'stage_data.po.contract_date' => ['nullable', 'date'],
            'stage_data.po.amount' => ['nullable'],
            'stage_data.po.allotment_class' => ['nullable', 'string'],
            // Delivery
            'stage_data.delivery' => ['nullable', 'array'],
            'stage_data.delivery.iar_no' => ['nullable', 'string'],
            'stage_data.delivery.delivery_date' => ['nullable', 'date'],
            'stage_data.delivery.inspection_date' => ['nullable', 'date'],
            'stage_data.delivery.delivery_status' => [
                'nullable',
                'in:Partial,Complete',
            ],
            // Payment
            'stage_data.payment' => ['nullable', 'array'],
            'stage_data.payment.ors_no' => ['nullable', 'string'],
            'stage_data.payment.ors_date' => ['nullable', 'date'],
            'stage_data.payment.date_prepared' => ['nullable', 'date'],
            'stage_data.payment.date_crediting' => ['nullable', 'date'],
            // CAPA
            'stage_data.capa' => ['nullable', 'array'],
            'stage_data.capa.calendar_of_activities' => [
                'nullable',
                'date',
            ],
            'stage_data.capa.date_of_implementation' => [
                'nullable',
                'date',
            ],
            'stage_files' => ['nullable', 'array'],
            'stage_files.*' => [
                'file',
                'mimes:pdf,docx,xlsx',
                'max:15360',
            ],
        ]);
        DB::transaction(function () use (
            $request,
            $validated,
            $procurement
        ) {
            $stageData = $validated['stage_data'] ?? [];
            /*
            |--------------------------------------------------------------------------
            | SAVE STAGE DOCUMENTS
            |--------------------------------------------------------------------------
            */
            $currentStage = (int) $validated['current_stage'];
            if ($request->hasFile('stage_files')) {
                foreach ($request->file('stage_files') as $file) {
                    $storedName = uniqid() . '_' . $file->getClientOriginalName();
                    $path = $file->storeAs(
                        "procurements/{$procurement->id}/stage_{$currentStage}",
                        $storedName,
                        'public'
                    );
                    ProcurementDocument::create([
                        'procurement_id' => $procurement->id,
                        'stage' => Procurement::stageFromNumber($currentStage),
                        'document_type' => 'Stage ' . $currentStage . ' Document',
                        'original_name' => $file->getClientOriginalName(),
                        'stored_name' => $storedName,
                        'file_path' => $path,
                        'mime_type' => $file->getMimeType(),
                        'file_size' => $file->getSize(),
                        'uploaded_by' => auth()->id(),
                    ]);
                }
            }
            /*
            |--------------------------------------------------------------------------
            | 1. UPDATE MAIN PROCUREMENT / PR DATA
            |--------------------------------------------------------------------------
            */
            $pr = $stageData['pr'] ?? [];
            $procurement->update([
                'pr_no' => $pr['pr_no']
                    ?? $procurement->pr_no,
                'project_title' => $pr['project_title']
                    ?? $procurement->project_title,
                'purpose' => $pr['purpose']
                    ?? $procurement->purpose,
                'end_user' => $pr['end_user']
                    ?? $procurement->end_user,
                'abc' => $pr['abc']
                    ?? $procurement->abc,
                'mode_of_procurement' =>
                    $pr['mode_of_procurement']
                    ?? $procurement->mode_of_procurement,
            ]);
            /*
            |--------------------------------------------------------------------------
            | 2. SAVE PR STAGE
            |--------------------------------------------------------------------------
            */
            if (isset($stageData['pr'])) {
                ProcurementPr::updateOrCreate(
                    [
                        'procurement_id' =>
                            $procurement->id,
                    ],
                    [
                        // Add this if your frontend sends prepared_date
                        // 'prepared_date' =>
                        //     $stageData['pr']['prepared_date'] ?? null,
                    ]
                );
            }
            /*
            |--------------------------------------------------------------------------
            | 3. SAVE RFQ STAGE
            |--------------------------------------------------------------------------
            */
            if (isset($stageData['rfq'])) {
                $rfq = $stageData['rfq'];
                ProcurementRfq::updateOrCreate(
                    [
                        'procurement_id' =>
                            $procurement->id,
                    ],
                    [
                        'tin' =>
                            $rfq['tin'] ?? null,
                        'winner_bidder' =>
                            $rfq['winner_bidder'] ?? null,
                        'address' =>
                            $rfq['address_contract'] ?? null,
                        'contact_no' =>
                            $rfq['contact_no'] ?? null,
                        'contract_amount' =>
                            $rfq['contract_amount'] ?? null,
                    ]
                );
            }
            /*
            |--------------------------------------------------------------------------
            | 4. SAVE PURCHASE ORDER STAGE
            |--------------------------------------------------------------------------
            */
            if (isset($stageData['po'])) {
                $po = $stageData['po'];
                PurchaseOrder::updateOrCreate(
                    [
                        'procurement_id' =>
                            $procurement->id,
                    ],
                    [
                        'po_no' =>
                            $po['po_no'] ?? null,
                        'po_date' =>
                            $po['po_date'] ?? null,
                        'contract_date' =>
                            $po['contract_date'] ?? null,
                        'amount' =>
                            $po['amount'] ?? null,
                        'allotment_class' =>
                            $po['allotment_class'] ?? null,
                    ]
                );
            }
            /*
            |--------------------------------------------------------------------------
            | 5. SAVE DELIVERY STAGE
            |--------------------------------------------------------------------------
            */
            if (isset($stageData['delivery'])) {
                $delivery = $stageData['delivery'];
                Delivery::updateOrCreate(
                    [
                        'procurement_id' =>
                            $procurement->id,
                    ],
                    [
                        'iar_no' =>
                            $delivery['iar_no'] ?? null,
                        'delivery_date' =>
                            $delivery['delivery_date'] ?? null,
                        'inspection_date' =>
                            $delivery['inspection_date'] ?? null,
                        'delivery_status' =>
                            $delivery['delivery_status']
                            ?? 'Partial',
                    ]
                );
            }
            /*
            |--------------------------------------------------------------------------
            | 6. SAVE PAYMENT STAGE
            |--------------------------------------------------------------------------
            */
            if (isset($stageData['payment'])) {
                $payment = $stageData['payment'];
                Payment::updateOrCreate(
                    [
                        'procurement_id' =>
                            $procurement->id,
                    ],
                    [
                        'ors_no' =>
                            $payment['ors_no'] ?? null,
                        'ors_date' =>
                            $payment['ors_date'] ?? null,
                        'date_prepared' =>
                            $payment['date_prepared'] ?? null,
                        'date_crediting' =>
                            $payment['date_crediting'] ?? null,
                    ]
                );
            }
            /*
            |--------------------------------------------------------------------------
            | 7. SAVE CAPA STAGE
            |--------------------------------------------------------------------------
            */
            if (isset($stageData['capa'])) {
                $capa = $stageData['capa'];
                Capa::updateOrCreate(
                    [
                        'procurement_id' =>
                            $procurement->id,
                    ],
                    [
                        'calendar_of_activities' =>
                            $capa['calendar_of_activities']
                            ?? null,
                        'date_of_implementation' =>
                            $capa['date_of_implementation']
                            ?? null,
                    ]
                );
            }
            /*
            |--------------------------------------------------------------------------
            | 8. FIND TARGET DEPARTMENT
            |--------------------------------------------------------------------------
            */
            $targetDepartment = Department::where(
                'name',
                $validated['target_department']
            )->firstOrFail();
            /*
            |--------------------------------------------------------------------------
            | 9. DETERMINE NEXT/PREVIOUS STAGE
            |--------------------------------------------------------------------------
            */
            $currentStage = (int) $validated['current_stage'];
            if ($validated['action'] === 'forward') {
                $newStage = min(7, $currentStage + 1);
                $routeAction = $newStage === 7
                    ? 'Completed'
                    : 'Forwarded';
            } else {
                $newStage = max(1, $currentStage - 1);
                $routeAction = 'Returned';
            }
            /*
            |--------------------------------------------------------------------------
            | 10. GET CURRENT DEPARTMENT
            |--------------------------------------------------------------------------
            */
            $fromDepartmentId =
                $procurement->current_department_id;
            /*
            |--------------------------------------------------------------------------
            | 11. UPDATE PROCUREMENT STATUS
            |--------------------------------------------------------------------------
            */
            $procurement->update([
                'status' => Procurement::stageFromNumber($newStage),
                'current_department_id' => $targetDepartment->id,
            ]);
            /*
            |--------------------------------------------------------------------------
            | 12. CREATE ROUTING HISTORY
            |--------------------------------------------------------------------------
            */
            $procurement->routes()->create([
                'from_department_id' =>
                    $fromDepartmentId,
                'to_department_id' =>
                    $targetDepartment->id,
                'forwarded_by' =>
                    auth()->id(),
                'stage' =>
                    'stage_' . $newStage,
                'action' =>
                    $routeAction,
                'remarks' =>
                    $validated['remarks'] ?? null,
                'forwarded_at' =>
                    now(),
            ]);
        });
        return back()->with(
            'success',
            'Procurement routed successfully.'
        );
    }
}
