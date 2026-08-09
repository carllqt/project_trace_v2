<?php
namespace App\Http\Resources;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProcurementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $stageNumber = $this->getStageNumber();
        /*
        |--------------------------------------------------------------------------
        | Latest Route
        |--------------------------------------------------------------------------
        */
        $latestRoute = $this->routes
            ->sortByDesc('created_at')
            ->first();
        /*
        |--------------------------------------------------------------------------
        | Latest Delivery
        |--------------------------------------------------------------------------
        */
        $latestDelivery = $this->deliveries
            ->sortByDesc('delivery_date')
            ->first();
        /*
        |--------------------------------------------------------------------------
        | Stage 5 Documents
        |--------------------------------------------------------------------------
        */
        $attendanceSheet = $this->documents
            ->where('stage', 'stage_5')
            ->where('document_type', 'attendance_sheet')
            ->first();
        $terminalReport = $this->documents
            ->where('stage', 'stage_5')
            ->where('document_type', 'terminal_report')
            ->first();
        /*
        |--------------------------------------------------------------------------
        | Status
        |--------------------------------------------------------------------------
        */
        $isCompleted = $this->isCompleted();
        /*
        |--------------------------------------------------------------------------
        | Return
        |--------------------------------------------------------------------------
        */
        return [
            /*
            |--------------------------------------------------------------------------
            | Basic Procurement
            |--------------------------------------------------------------------------
            */
            'id' =>
                $this->id,
            'pr_no' =>
                $this->pr_no,
            'project_title' =>
                $this->project_title,
            'purpose' =>
                $this->purpose,
            'end_user' =>
                $this->end_user,
            'abc' =>
                $this->abc,
            'mode_of_procurement' =>
                $this->mode_of_procurement,
            /*
            |--------------------------------------------------------------------------
            | Workflow Status
            |--------------------------------------------------------------------------
            */
            'stage' =>
                $stageNumber,
            'status' =>
                $isCompleted
                    ? 'completed'
                    : 'in_progress',
            'route_status' =>
                $this->getRouteStatus($latestRoute),
            'current_department' =>
                $this->department?->name,
            'current_department_id' =>
                $this->current_department_id,
            'is_in_progress' =>
                ! $isCompleted,
            'is_completed' =>
                $isCompleted,
            'requires_my_action' =>
                false,
            /*
            |--------------------------------------------------------------------------
            | Current Route
            |--------------------------------------------------------------------------
            */
            'route' => $latestRoute ? [
                'id' =>
                    $latestRoute->id,
                'from_department_id' =>
                    $latestRoute->from_department_id,
                'from_dept' =>
                    $latestRoute->fromDepartment?->name,
                'to_department_id' =>
                    $latestRoute->to_department_id,
                'to_dept' =>
                    $latestRoute->toDepartment?->name,
                'stage' =>
                    $latestRoute->stage,
                'action' =>
                    $latestRoute->action,
                'remarks' =>
                    $latestRoute->remarks,
                'forwarded_at' =>
                    $latestRoute->forwarded_at,
                'received_at' =>
                    $latestRoute->received_at,
                'forwarded_by' =>
                    $latestRoute->forwardedBy?->name,
                'received_by' =>
                    $latestRoute->receivedBy?->name,
            ] : null,
            /*
            |--------------------------------------------------------------------------
            | Stage Data
            |--------------------------------------------------------------------------
            */
            'stage_data' => [
                /*
                |--------------------------------------------------------------------------
                | PR
                |--------------------------------------------------------------------------
                */
                'pr' => [
                    'pr_no' =>
                        $this->pr_no,
                    'project_title' =>
                        $this->project_title,
                    'purpose' =>
                        $this->purpose,
                    'end_user' =>
                        $this->end_user,
                    'abc' =>
                        $this->abc,
                    'mode_of_procurement' =>
                        $this->mode_of_procurement,
                ],
                /*
                |--------------------------------------------------------------------------
                | RFQ
                |--------------------------------------------------------------------------
                */
                'rfq' => [
                    'tin' =>
                        $this->rfq?->tin,
                    'winner_bidder' =>
                        $this->rfq?->winner_bidder,
                    'address_contract' =>
                        $this->rfq?->address,
                    'contact_no' =>
                        $this->rfq?->contact_no,
                    'contract_amount' =>
                        $this->rfq?->contract_amount,
                ],
                /*
                |--------------------------------------------------------------------------
                | Purchase Order
                |--------------------------------------------------------------------------
                */
                'po' => [
                    'po_no' =>
                        $this->purchaseOrder?->po_no,
                    'po_date' =>
                        $this->purchaseOrder?->po_date,
                    'contract_date' =>
                        $this->purchaseOrder?->contract_date,
                    'amount' =>
                        $this->purchaseOrder?->amount,
                    'allotment_class' =>
                        $this->purchaseOrder?->allotment_class,
                ],
                /*
                |--------------------------------------------------------------------------
                | Delivery
                |--------------------------------------------------------------------------
                */
                'delivery' => [
                    'iar_no' =>
                        $latestDelivery?->iar_no,
                    'delivery_date' =>
                        $latestDelivery?->delivery_date,
                    'inspection_date' =>
                        $latestDelivery?->inspection_date,
                    'delivery_status' =>
                        $latestDelivery?->delivery_status,
                ],
                /*
                |--------------------------------------------------------------------------
                | Implementation
                |--------------------------------------------------------------------------
                */
                'implementation' => [
                    'implementation_date' =>
                        $this->implementation?->implementation_date,
                    'attendance_sheet_name' =>
                        $attendanceSheet?->original_name,
                    'terminal_report_name' =>
                        $terminalReport?->original_name,
                ],
                /*
                |--------------------------------------------------------------------------
                | Payment
                |--------------------------------------------------------------------------
                |
                | These fields don't currently exist in your database.
                |
                */
                'payment' => [
                    'ors_no' =>
                        null,
                    'ors_date' =>
                        null,
                    'date_prepared' =>
                        null,
                    'date_crediting' =>
                        null,
                ],
                /*
                |--------------------------------------------------------------------------
                | CAPA
                |--------------------------------------------------------------------------
                */
                'capa' => [
                    'calendar_of_activities' =>
                        $this->capa?->calendar_of_activities,
                ],
            ],
            /*
            |--------------------------------------------------------------------------
            | Routing History
            |--------------------------------------------------------------------------
            */
            'routes' => $this->routes
                ->sortByDesc('created_at')
                ->values()
                ->map(function ($route) {
                    return [
                        'id' =>
                            $route->id,
                        'action' =>
                            $route->action,
                        'from_dept' =>
                            $route->fromDepartment?->name,
                        'to_dept' =>
                            $route->toDepartment?->name,
                        'forwarded_at' =>
                            $route->forwarded_at,
                        'forwarded_by' =>
                            $route->forwardedBy?->name,
                        'received_by' =>
                            $route->receivedBy?->name,
                        'remarks' =>
                            $route->remarks,
                    ];
                })
                ->toArray(),
            /*
            |--------------------------------------------------------------------------
            | Activity Logs
            |--------------------------------------------------------------------------
            */
            'activity_logs' => $this->activityLogs
                ->sortByDesc('created_at')
                ->values()
                ->map(function ($log) {
                    return [
                        'id' =>
                            $log->id,
                        'user' =>
                            $log->user?->name,
                        'action' =>
                            $log->activity,
                        'details' =>
                            $log->description,
                        'timestamp' =>
                            $log->created_at,
                    ];
                })
                ->toArray(),
            /*
            |--------------------------------------------------------------------------
            | Documents
            |--------------------------------------------------------------------------
            */
            'documents' => $this->documents
                ->sortByDesc('created_at')
                ->values()
                ->map(function ($document) {
                    return [
                        'id' =>
                            $document->id,
                        'name' =>
                            $document->original_name,
                        'stage' =>
                            (int) str_replace(
                                'stage_',
                                '',
                                $document->stage
                            ),
                        'type' =>
                            $document->document_type,
                        'size' =>
                            $this->formatFileSize(
                                $document->file_size
                            ),
                        'file_path' =>
                            $document->file_path,
                    ];
                })
                ->toArray(),
        ];
    }
    /*
    |--------------------------------------------------------------------------
    | Stage Number
    |--------------------------------------------------------------------------
    */
    private function getStageNumber(): int
    {
        return (int) str_replace(
            'stage_',
            '',
            $this->status
        );
    }
    /*
    |--------------------------------------------------------------------------
    | Completed
    |--------------------------------------------------------------------------
    */
    private function isCompleted(): bool
    {
        return $this->status === 'stage_7';
    }
    /*
    |--------------------------------------------------------------------------
    | Route Status
    |--------------------------------------------------------------------------
    */
    private function getRouteStatus($route): ?string
    {
        if (! $route) {
            return null;
        }
        return match ($route->action) {
            'Forwarded' =>
                'in_route',
            'Received' =>
                'received',
            'Approved' =>
                'approved',
            'Returned' =>
                'returned',
            'Rejected' =>
                'rejected',
            'Completed' =>
                'completed',
            default =>
                null,
        };
    }
    /*
    |--------------------------------------------------------------------------
    | File Size
    |--------------------------------------------------------------------------
    */
    private function formatFileSize(?int $bytes): ?string
    {
        if ($bytes === null) {
            return null;
        }
        if ($bytes < 1024) {
            return $bytes . ' B';
        }
        if ($bytes < 1024 * 1024) {
            return round($bytes / 1024, 1) . ' KB';
        }
        if ($bytes < 1024 * 1024 * 1024) {
            return round(
                $bytes / (1024 * 1024),
                1
            ) . ' MB';
        }
        return round(
            $bytes / (1024 * 1024 * 1024),
            1
        ) . ' GB';
    }
}
