<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Implementation extends Model
{
    /** @use HasFactory<\Database\Factories\ImplementationFactory> */
    use HasFactory;
        protected $fillable = [
        'procurement_id',
        'implementation_date',
    ];

    public function procurement(): BelongsTo
    {
        return $this->belongsTo(Procurement::class);
    }
}
