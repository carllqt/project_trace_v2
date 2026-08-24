<?php
namespace App\Http\Controllers;
use App\Models\Procurement;
use App\Models\ProcurementDocument;
use Illuminate\Http\Request;
class ProcurementDocumentController extends Controller
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
    public function store(Request $request, Procurement $procurement)
    {
        try {
            $request->validate([
                'stage' => ['required', 'string'],

                'documents' => ['required', 'array', 'min:1'],

                'documents.*' => [
                    'required',
                    'file',
                    'mimes:pdf,doc,docx,xls,xlsx',
                    'max:15360',
                ],
            ]);

            foreach ($request->file('documents', []) as $file) {
                $storedName = $file->hashName();

                $path = $file->storeAs(
                    "procurements/{$procurement->id}/documents",
                    $storedName,
                    'public'
                );

                $procurement->documents()->create([
                    'stage' => $request->stage,
                    'document_type' => $file->getClientOriginalExtension(),
                    'original_name' => $file->getClientOriginalName(),
                    'stored_name' => $storedName,
                    'file_path' => $path,
                    'mime_type' => $file->getClientMimeType(),
                    'file_size' => $file->getSize(),
                    'uploaded_by' => auth()->id(),
                ]);
            }

            return back()->with(
                'success',
                'Document(s) uploaded successfully.'
            );
        } catch (\Throwable $e) {
            \Log::error('Document upload failed', [
                'procurement_id' => $procurement->id,
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
            ]);

            return back()->with(
                'error',
                'Failed to upload document(s). Please try again.'
            );
        }
    }
    /**
     * Display the specified resource.
     */
    public function show(ProcurementDocument $procurementDocument)
    {
        //
    }
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProcurementDocument $procurementDocument)
    {
        //
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProcurementDocument $procurementDocument)
    {
        //
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProcurementDocument $procurementDocument)
    {
        //
    }
}
