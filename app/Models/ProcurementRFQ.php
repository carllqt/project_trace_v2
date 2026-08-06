<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProcurementRFQ extends Model
{
    /** @use HasFactory<\Database\Factories\ProcurementRFQFactory> */
    use HasFactory;
        protected $fillable = [
        'procurement_id',
        'tin',
        'winner_bidder',
        'address',
        'contact_no',
        'contract_amount',
    ];

    public function procurement(): BelongsTo
    {
        return $this->belongsTo(Procurement::class);
    }
}
