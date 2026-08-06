<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CAPA extends Model
{
    /** @use HasFactory<\Database\Factories\CAPAFactory> */
    use HasFactory;
    protected $fillable = [
        'procurement_id',
        'calendar_of_activities',
    ];

    public function procurement(): BelongsTo
    {
        return $this->belongsTo(Procurement::class);
    }
}
