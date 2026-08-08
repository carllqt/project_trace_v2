<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function user_dashboard()
    {
        $departments = Department::pluck('name', 'id')->toArray();
        return Inertia::render('Dashboard', [
            'departments' => $departments
        ]);
    }
}
