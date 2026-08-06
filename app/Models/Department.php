<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
     /** @use HasFactory<\Database\Factories\ImplementationFactory> */
    use HasFactory;
    protected $fillable = [
        'code',
        'name',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function procurements(): HasMany
    {
        return $this->hasMany(Procurement::class, 'current_department_id');
    }

    public function incomingRoutes(): HasMany
    {
        return $this->hasMany(ProcurementRoute::class, 'to_department_id');
    }

    public function outgoingRoutes(): HasMany
    {
        return $this->hasMany(ProcurementRoute::class, 'from_department_id');
    }
}
