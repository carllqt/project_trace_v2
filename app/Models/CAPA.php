<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CAPA extends Model
{
    use HasFactory;

    protected $table = 'capas';

    protected $fillable = [
        'date_from',
        'date_to',
        'activity',
        'participants',
        'lead_division',
        'venue',
        'remarks',
    ];

    protected function casts(): array
    {
        return [
            'date_from' => 'date:Y-m-d',
            'date_to' => 'date:Y-m-d',
        ];
    }
}
