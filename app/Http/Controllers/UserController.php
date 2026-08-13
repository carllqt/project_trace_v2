<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\Department;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Throwable;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::query()
            ->with([
                'department:id,name,code',
                'roles:id,name',
            ])
            ->latest()
            ->paginate(10)
            ->withQueryString();

        // Map through the page items and hide pivot from roles
        $users->through(function ($user) {
            $user->roles->makeHidden('pivot');
            return $user;
        });

        return Inertia::render('Admin/User/Index', [
            'users' => $users,
            'departments' => Department::pluck('name', 'id')->toArray(),
            'queryParams' => request()->query(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $validated = $request->validated();
        try {
            DB::transaction(function () use ($validated) {
                $user = User::create([
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                    'department_id' => $validated['department_id'],
                    'position' => $validated['position'] ?? null,
                    'is_head' => $validated['is_head'] ?? false,
                    'password' => Hash::make($validated['password']),
                ]);
                // Assign Spatie role
                $user->assignRole($validated['role']);
            });
            return redirect()
                ->back()
                ->with('success', 'User account created successfully.');
        } catch (Throwable $e) {
            report($e);
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Failed to create the user account. Please try again.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
         $validated = $request->validated();
        try {
            DB::transaction(function () use ($validated, $user) {
                $userData = [
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                    'department_id' => $validated['department_id'],
                    'position' => $validated['position'] ?? null,
                    'is_head' => $validated['is_head'] ?? false,
                ];
                // Only update the password when one was provided.
                if (!empty($validated['password'])) {
                    $userData['password'] = Hash::make(
                        $validated['password']
                    );
                }
                $user->update($userData);
                // Update Spatie role.
                $user->syncRoles([
                    $validated['role'],
                ]);
            });
            return redirect()
                ->back()
                ->with('success', 'User account updated successfully.');
        } catch (Throwable $e) {
            report($e);
            return redirect()
                ->back()
                ->withInput()
                ->with(
                    'error',
                    'Failed to update the user account. Please try again.'
                );
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        try {
            DB::transaction(function () use ($user) {
                $user->delete();
            });

            return redirect()
                ->back()
                ->with('success', 'User account deleted successfully.');
        } catch (Throwable $e) {
            report($e);

            return redirect()
                ->back()
                ->with(
                    'error',
                    'Failed to delete the user account. Please try again.'
                );
        }
    }
    public function resetPassword(Request $request, User $user)
    {
        $validated = $request->validate([
            'password' => [
                'required',
                'string',
                'min:8',
                'max:255',
                'confirmed',
            ],
        ], [
            'password.required' => 'Please enter a new password.',
            'password.min' => 'The password must be at least 8 characters.',
            'password.confirmed' => 'The password confirmation does not match.',
        ]);

        try {
            DB::transaction(function () use ($validated, $user) {
                $user->update([
                    'password' => Hash::make($validated['password']),
                ]);
            });

            return redirect()
                ->back()
                ->with('success', 'User password has been reset successfully.');
        } catch (Throwable $e) {
            report($e);

            return redirect()
                ->back()
                ->withInput()
                ->with(
                    'error',
                    'Failed to reset the user password. Please try again.'
                );
        }
    }
}
