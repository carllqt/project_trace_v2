<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProcurementRequest;
use App\Models\Procurement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Throwable;

class ProcurementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function store(StoreProcurementRequest $request)
    {
        $storedFiles = [];

        try {
            DB::transaction(function () use ($request, &$storedFiles) {

                $procurement = Procurement::create([
                    'pr_no' => $request->pr_no,
                    'project_title' => $request->project_title,
                    'purpose' => $request->purpose,
                    'end_user' => $request->end_user,
                    'abc' => $request->abc,
                    'mode_of_procurement' => $request->mode_of_procurement,
                    'status' => Procurement::STAGE_1,
                    'current_department_id' => auth()->user()->department_id,
                ]);

                if ($request->hasFile('documents')) {
                    foreach ($request->file('documents') as $file) {

                        $filePath = $file->store(
                            "procurements/{$procurement->id}/documents",
                            'public'
                        );

                        // Track successfully stored files
                        $storedFiles[] = $filePath;

                        $procurement->documents()->create([
                            'stage' => 'Preparation of PR',
                            'document_type' => 'Supporting Document',
                            'original_name' => $file->getClientOriginalName(),
                            'stored_name' => basename($filePath),
                            'file_path' => $filePath,
                            'mime_type' => $file->getClientMimeType(),
                            'file_size' => $file->getSize(),
                            'uploaded_by' => auth()->id(),
                        ]);
                    }
                }
            });
            return redirect()
                ->route('procurement.index')
                ->with('success', 'Procurement created successfully.');

        } catch (\Throwable $e) {

            // Delete files if database operation failed
            foreach ($storedFiles as $filePath) {
                Storage::disk('public')->delete($filePath);
            }

            Log::error('Failed to create procurement.', [
                'message' => $e->getMessage(),
            ]);

            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Failed to create procurement. Please try again.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Procurement $procurement)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Procurement $procurement)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Procurement $procurement)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Procurement $procurement)
    {
        //
    }
}
