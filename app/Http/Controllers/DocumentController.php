<?php

namespace App\Http\Controllers;

use App\Http\Requests\DocumentRequest;
use App\Models\Employee;
use App\Models\EmployeeDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DocumentController extends Controller
{
    // ==========================
    // Employee Self-Service (/me)
    // ==========================
    public function myDocuments(Request $request)
    {
        $employee = $request->user()->employee;

        $documents = EmployeeDocument::where('employee_id', $employee->id)
            ->with('uploader:id,name,email')
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($doc) {
                $doc->formatted_size = $doc->formatted_size;
                $doc->document_type_label = EmployeeDocument::documentTypes()[$doc->document_type] ?? $doc->document_type;
                return $doc;
            });

        return $this->success(['documents' => $documents], 'Your documents retrieved successfully.');
    }

    public function storeMyDocument(DocumentRequest $request)
    {
        $employee = $request->user()->employee;

        DB::beginTransaction();
        try {
            $file = $request->file('file');
            $documentType = $request->document_type;

            $fileName = $this->generateUniqueFileName($file);
            $directory = "employee_documents/{$employee->id}/{$documentType}";
            $filePath = $file->storeAs($directory, $fileName, 'private');

            $document = EmployeeDocument::create([
                'employee_id' => $employee->id,
                'document_type' => $documentType,
                'file_name' => $file->getClientOriginalName(),
                'file_path' => $filePath,
                'file_size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
                'description' => $request->description,
                'uploaded_by' => $request->user()->id,
            ]);

            $document->formatted_size = $document->formatted_size;
            $document->document_type_label = EmployeeDocument::documentTypes()[$documentType] ?? $documentType;

            DB::commit();

            return $this->created(['document' => $document], 'Document uploaded successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            \Illuminate\Support\Facades\Log::error('Document Upload Error: ' . $e->getMessage(), ['exception' => $e]);
            return $this->serverError('An error occurred while uploading the document.');
        }
    }

    public function showMyDocument(Request $request, $documentId)
    {
        $employee = $request->user()->employee;

        $document = EmployeeDocument::where('employee_id', $employee->id)
            ->where('id', $documentId)
            ->with('uploader:id,name,email')
            ->firstOrFail();

        $document->formatted_size = $document->formatted_size;
        $document->document_type_label = EmployeeDocument::documentTypes()[$document->document_type] ?? $document->document_type;

        return $this->success(['document' => $document], 'Document retrieved successfully.');
    }

    public function updateMyDocument(Request $request, $documentId)
    {
        $employee = $request->user()->employee;

        $document = EmployeeDocument::where('employee_id', $employee->id)
            ->where('id', $documentId)
            ->firstOrFail();

        $document->update([
            'description' => $request->description,
            'document_type' => $request->document_type ?? $document->document_type,
        ]);

        $document->formatted_size = $document->formatted_size;
        $document->document_type_label = EmployeeDocument::documentTypes()[$document->document_type] ?? $document->document_type;

        return $this->success(['document' => $document], 'Document updated successfully.');
    }

    public function deleteMyDocument(Request $request, $documentId)
    {
        $employee = $request->user()->employee;

        $document = EmployeeDocument::where('employee_id', $employee->id)
            ->where('id', $documentId)
            ->firstOrFail();

        DB::beginTransaction();
        try {
            if (Storage::disk('private')->exists($document->file_path)) {
                Storage::disk('private')->delete($document->file_path);
            }
            $document->delete();
            DB::commit();

            return $this->success(null, 'Document deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            \Illuminate\Support\Facades\Log::error('Document Deletion Error: ' . $e->getMessage(), ['exception' => $e]);
            return $this->serverError('An error occurred while deleting the document.');
        }
    }

    public function downloadMyDocument(Request $request, $documentId)
    {
        $employee = $request->user()->employee;

        $document = EmployeeDocument::where('employee_id', $employee->id)
            ->where('id', $documentId)
            ->firstOrFail();

        if (!Storage::disk('private')->exists($document->file_path)) {
            abort(404, 'The document file was not found.');
        }

        return response()->download(
            storage_path("app/private/{$document->file_path}"),
            $document->file_name,
            ['Content-Type' => $document->mime_type]
        );
    }

    // ==========================
    // Admin/HR Read-Only Methods
    // ==========================
    public function index($employeeId)
    {
        $employee = Employee::findOrFail($employeeId);

        $documents = EmployeeDocument::where('employee_id', $employeeId)
            ->with('uploader:id,name,email')
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($doc) {
                $doc->formatted_size = $doc->formatted_size;
                $doc->document_type_label = EmployeeDocument::documentTypes()[$doc->document_type] ?? $doc->document_type;
                return $doc;
            });

        return $this->success(['documents' => $documents], 'Employee documents retrieved successfully.');
    }

    public function show($employeeId, $documentId)
    {
        $employee = Employee::findOrFail($employeeId);

        $document = EmployeeDocument::where('employee_id', $employeeId)
            ->where('id', $documentId)
            ->with('uploader:id,name,email')
            ->firstOrFail();

        $document->formatted_size = $document->formatted_size;
        $document->document_type_label = EmployeeDocument::documentTypes()[$document->document_type] ?? $document->document_type;

        return $this->success(['document' => $document], 'Document retrieved successfully.');
    }

    public function download($employeeId, $documentId)
    {
        $employee = Employee::findOrFail($employeeId);

        $document = EmployeeDocument::where('employee_id', $employeeId)
            ->where('id', $documentId)
            ->firstOrFail();

        if (!Storage::disk('private')->exists($document->file_path)) {
            abort(404, 'The document file was not found.');
        }

        return response()->download(
            storage_path("app/private/{$document->file_path}"),
            $document->file_name,
            ['Content-Type' => $document->mime_type]
        );
    }

    private function generateUniqueFileName($file): string
    {
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $extension = $file->getClientOriginalExtension();
        return "{$originalName}_" . Str::uuid() . ".{$extension}";
    }
}