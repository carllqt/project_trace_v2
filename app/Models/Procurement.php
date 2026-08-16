<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
class Procurement extends Model
{
    /** @use HasFactory<\Database\Factories\ProcurementFactory> */
    use HasFactory;
    public const STAGE_1 = 'stage_1';
    public const STAGE_2 = 'stage_2';
    public const STAGE_3 = 'stage_3';
    public const STAGE_4 = 'stage_4';
    public const STAGE_5 = 'stage_5';
    public const STAGE_6 = 'stage_6';
    public const STAGE_7 = 'stage_7';
    public const STAGES = [
        self::STAGE_1 => 'Preparation of Purchase Request',
        self::STAGE_2 => 'Preparation of Request for Quotation',
        self::STAGE_3 => 'Preparation of Purchase Order',
        self::STAGE_4 => 'Delivery of Goods and Services',
        self::STAGE_5 => 'Project Implementation',
        self::STAGE_6 => 'Payment Processing',
        self::STAGE_7 => 'Completed',
    ];
    public static function stageFromNumber(int $stage): string
    {
        return match ($stage) {
            1 => self::STAGE_1,
            2 => self::STAGE_2,
            3 => self::STAGE_3,
            4 => self::STAGE_4,
            5 => self::STAGE_5,
            6 => self::STAGE_6,
            7 => self::STAGE_7,
            default => self::STAGE_1,
        };
    }
    protected $fillable = [
        'pr_no',
        'project_title',
        'purpose',
        'end_user',
        'abc',
        'mode_of_procurement',
        'date_of_implementation',
        'status',
        'current_department_id',
    ];
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'current_department_id');
    }
    public function currentDepartment()
    {
        return $this->belongsTo(Department::class, 'current_department_id');
    }
    public function pr(): HasOne
    {
        return $this->hasOne(ProcurementPR::class);
    }
    public function rfq(): HasOne
    {
        return $this->hasOne(ProcurementRFQ::class);
    }
    public function purchaseOrder(): HasOne
    {
        return $this->hasOne(PurchaseOrder::class);
    }
    public function delivery(): HasOne
    {
        return $this->hasOne(Delivery::class);
    }
    public function deliveries(): HasMany
    {
        return $this->hasMany(Delivery::class, 'procurement_id');
    }
    public function implementation(): HasOne
    {
        return $this->hasOne(Implementation::class);
    }
    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }
    public function capa(): HasOne
    {
        return $this->hasOne(CAPA::class);
    }
    public function capas()
    {
        return $this->hasMany(Capa::class);
    }
    public function documents(): HasMany
    {
        return $this->hasMany(ProcurementDocument::class);
    }
    public function routes()
    {
        return $this->hasMany(ProcurementRoute::class);
    }
    public function latestRoute()
    {
        return $this->hasOne(ProcurementRoute::class)
            ->latestOfMany();
    }
    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }
    public function getStageNumberAttribute(): int
    {
        return match ($this->status) {
            self::STAGE_1 => 1,
            self::STAGE_2 => 2,
            self::STAGE_3 => 3,
            self::STAGE_4 => 4,
            self::STAGE_5 => 5,
            self::STAGE_6 => 6,
            self::STAGE_7 => 7,
            default => 0,
        };
    }
    public function getStageLabelAttribute(): string
    {
        return self::STAGES[$this->status] ?? 'Unknown Stage';
    }
    public function getIsCompletedAttribute(): bool
    {
        return $this->status === self::STAGE_7;
    }
    public function getIsInProgressAttribute(): bool
    {
        return $this->status !== self::STAGE_7;
    }
    public function getWorkflowData(?User $user = null): array
    {
        /*
        |--------------------------------------------------------------------------
        | Stage
        |--------------------------------------------------------------------------
        */
        $stageNumber = (int) str_replace(
            'stage_',
            '',
            $this->status
        );
        /*
        |--------------------------------------------------------------------------
        | Routes
        |--------------------------------------------------------------------------
        */
        $routes = $this->routes()
            ->with([
                'fromDepartment',
                'toDepartment',
                'forwardedBy',
                'receivedBy',
            ])
            ->latest()
            ->get();
        $latestRoute = $routes->first();
        /*
        |--------------------------------------------------------------------------
        | Related Data
        |--------------------------------------------------------------------------
        */
        $pr = $this->pr;
        $rfq = $this->rfq;
        $purchaseOrder = $this->purchaseOrder;
        $deliveries = $this->deliveries()
            ->latest('delivery_date')
            ->get();
        $latestDelivery = $deliveries->first();
        $implementation = $this->implementation;
        $capa = $this->capa;
        /*
        |--------------------------------------------------------------------------
        | Activity Logs
        |--------------------------------------------------------------------------
        */
        $activityLogs = $this->activityLogs()
            ->with('user')
            ->latest()
            ->get();
        /*
        |--------------------------------------------------------------------------
        | Documents
        |--------------------------------------------------------------------------
        */
        $documents = $this->documents()
            ->latest()
            ->get();
        /*
        |--------------------------------------------------------------------------
        | Status
        |--------------------------------------------------------------------------
        */
        $isCompleted = $stageNumber >= 7;
        $status = $isCompleted
            ? 'completed'
            : 'in_progress';
        /*
        |--------------------------------------------------------------------------
        | Requires My Action
        |--------------------------------------------------------------------------
        */
        $requiresMyAction = false;
        if ($user && $latestRoute) {
            $requiresMyAction =
                $latestRoute->to_department_id === $user->department_id
                && $latestRoute->action === 'Forwarded';
        }
        /*
        |--------------------------------------------------------------------------
        | Route Status
        |--------------------------------------------------------------------------
        */
        $routeStatus = $this->getRouteStatus($latestRoute);
        /*
        |--------------------------------------------------------------------------
        | Return Data
        |--------------------------------------------------------------------------
        */
        return [
            /*
            |--------------------------------------------------------------------------
            | Basic Information
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
            'stage' =>
                $stageNumber,
            'status' =>
                $status,
            'route_status' =>
                $routeStatus,
            'current_department' =>
                $this->department?->name,
            'current_department_id' =>
                $this->current_department_id,
            'is_in_progress' =>
                ! $isCompleted,
            'is_completed' =>
                $isCompleted,
            'requires_my_action' =>
                $requiresMyAction,
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
                    'date_of_implementation' =>
                    $this?->date_of_implementation,
                ],
                /*
                |--------------------------------------------------------------------------
                | RFQ
                |--------------------------------------------------------------------------
                */
                'rfq' => [
                    'tin' =>
                        $rfq?->tin,
                    'winner_bidder' =>
                        $rfq?->winner_bidder,
                    'address_contract' =>
                        $rfq?->address,
                    'contact_no' =>
                        $rfq?->contact_no,
                    'contract_amount' =>
                        $rfq?->contract_amount,
                ],
                /*
                |--------------------------------------------------------------------------
                | Purchase Order
                |--------------------------------------------------------------------------
                */
                'po' => [
                    'po_no' =>
                        $purchaseOrder?->po_no,
                    'po_date' =>
                        $purchaseOrder?->po_date,
                    'contract_date' =>
                        $purchaseOrder?->contract_date,
                    'amount' =>
                        $purchaseOrder?->amount,
                    'allotment_class' =>
                        $purchaseOrder?->allotment_class,
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
                        $implementation?->implementation_date,
                    'attendance_sheet_name' =>
                        $documents
                            ->where('stage', 'stage_5')
                            ->where(
                                'document_type',
                                'attendance_sheet'
                            )
                            ->first()?->original_name,
                    'terminal_report_name' =>
                        $documents
                            ->where('stage', 'stage_5')
                            ->where(
                                'document_type',
                                'terminal_report'
                            )
                            ->first()?->original_name,
                ],
                /*
                |--------------------------------------------------------------------------
                | Payment
                |--------------------------------------------------------------------------
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
                        $capa?->calendar_of_activities,
                ],
            ],
            /*
            |--------------------------------------------------------------------------
            | Routing History
            |--------------------------------------------------------------------------
            */
            'routes' => $routes
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
                ->values()
                ->toArray(),
            /*
            |--------------------------------------------------------------------------
            | Activity Logs
            |--------------------------------------------------------------------------
            */
            'activity_logs' => $activityLogs
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
                ->values()
                ->toArray(),
            /*
            |--------------------------------------------------------------------------
            | Documents
            |--------------------------------------------------------------------------
            */
            'documents' => $documents
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
                ->values()
                ->toArray(),
        ];
    }
    private function getRouteStatus($route): ?string
    {
        if (! $route) {
            return null;
        }
        return match ($route->action) {
            'Forwarded' => 'in_route',
            'Received' => 'received',
            'Approved' => 'approved',
            'Returned' => 'returned',
            'Rejected' => 'rejected',
            'Completed' => 'completed',
            default => null,
        };
    }
    private function getDocument(
        string $stage,
        string $documentType
    ): ?array {
        $document = $this->documents()
            ->where('stage', $stage)
            ->where('document_type', $documentType)
            ->latest()
            ->first();
        if (! $document) {
            return null;
        }
        return [
            'id' => $document->id,
            'original_name' => $document->original_name,
            'stored_name' => $document->stored_name,
            'file_path' => $document->file_path,
            'mime_type' => $document->mime_type,
            'file_size' => $document->file_size,
        ];
    }
    private function formatFileSize(?int $bytes): ?string
    {
        if (!$bytes) {
            return null;
        }
        if ($bytes >= 1024 * 1024) {
            return round(
                $bytes / (1024 * 1024),
                1
            ) . ' MB';
        }
        if ($bytes >= 1024) {
            return round(
                $bytes / 1024,
                1
            ) . ' KB';
        }
        return $bytes . ' B';
    }
}
