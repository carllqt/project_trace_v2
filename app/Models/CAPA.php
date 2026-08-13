<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CAPA extends Model
{
    use HasFactory;

    protected $table = 'capas';

    protected $fillable = [
        'date',
        'activity',
        'participants',
        'lead_division',
        'venue',
        'remarks',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date:Y-m-d',
        ];
    }
}
