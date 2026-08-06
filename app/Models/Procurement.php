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

    public function routes(): HasMany
    {
        return $this->hasMany(ProcurementRoute::class);
    }

    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }
}
