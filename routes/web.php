<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProcurementController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canResetPassword' => Route::has('password.request'),
        'status' => session('status'),
    ]);
});

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'role:user|admin'])->group(function () {
    Route::get('user/dashboard', [DashboardController::class, 'user_dashboard'])->name('dashboard');
    Route::get('admin/dashboard', [DashboardController::class, 'admin_dashboard'])->name('admin.dashboard');

    Route::post('/procurement/{procurement}/route', [ProcurementController::class, 'route'])
    ->name('procurement.route');
    Route::post(
    '/procurement/{procurement}/retrieve',
        [ProcurementController::class, 'retrieve']
    )->name('procurement.retrieve');

    Route::put('/users/{user}/reset-password',[UserController::class, 'resetPassword'])->name('admin.users.reset-password');

    Route::resource('procurement', ProcurementController::class);
    Route::resource('user', UserController::class);
    // Add more user routes here
});

require __DIR__.'/auth.php';
