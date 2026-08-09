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

    protected $fillable = [
        'pr_no',
        'project_title',
        'purpose',
        'end_user',
        'abc',
        'mode_of_procurement',
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
}
