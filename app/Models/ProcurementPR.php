<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProcurementPR extends Model
{
    /** @use HasFactory<\Database\Factories\ProcurementPRFactory> */
    use HasFactory;
    protected $table = 'procurement_prs';
    protected $fillable = [
        'procurement_id',
        'prepared_date',
    ];
    public function procurement(): BelongsTo
    {
        return $this->belongsTo(
            Procurement::class,
            'procurement_id'
        );
    }

}
