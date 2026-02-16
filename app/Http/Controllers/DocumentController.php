<?php

namespace App\Http\Controllers;

use App\Http\Requests\DocumentRequest;
use App\Models\EmployeeDocument;
use App\Models\DocumentType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Helpers\DocumentHelper;
use Illuminate\Support\Facades\Log;

class DocumentController extends Controller
{
    // ==========================
    // Employee Self-Service (/me)
    // ==========================

    public function myDocuments(Request $request)
    {
        $employee = $request->user()->employee;

        $query = EmployeeDocument::where('employee_id', $employee->id)
            ->with(['uploader:id,name,email', 'documentType']);

        $documents = EmployeeDocument::applyFilters($request, $query);

        $documents->getCollection()
            ->transform(fn($doc) => DocumentHelper::appendFormattedSize($doc));

        return $this->success(['documents' => $documents], 'Your documents retrieved successfully.');
    }

    public function storeMyDocument(DocumentRequest $request)
    {
        $employee = $request->user()->employee;

        DB::beginTransaction();
        try {
            $file = $request->file('file');
            $documentType = DocumentType::findOrFail($request->document_type_id);

            $fileName = DocumentHelper::generateUniqueFileName($file);
            $directory = "employee/{$employee->id}/documents/{$documentType->slug}";
            $filePath = $file->storeAs($directory, $fileName, 'private');

            $document = EmployeeDocument::create([
                'employee_id'      => $employee->id,
                'document_type_id' => $documentType->id,
                'file_name'        => $file->getClientOriginalName(),
                'file_path'        => $filePath,
                'file_size'        => $file->getSize(),
                'mime_type'        => $file->getMimeType(),
                'description'      => $request->description,
                'uploaded_by'      => $request->user()->id,
            ]);

            $document->load('documentType');
            DocumentHelper::appendFormattedSize($document);

            DB::commit();

            return $this->created(['document' => $document], 'Document uploaded successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Document Upload Error: ' . $e->getMessage(), ['exception' => $e]);

            return $this->serverError('An error occurred while uploading the document.');
        }
    }

    public function showMyDocument(Request $request, EmployeeDocument $document)
    {
        $employee = $request->user()->employee;

        abort_if($document->employee_id !== $employee->id, 403);

        $document->load(['uploader:id,name,email', 'documentType']);
        DocumentHelper::appendFormattedSize($document);

        return $this->success(['document' => $document], 'Document retrieved successfully.');
    }

    public function updateMyDocument(Request $request, EmployeeDocument $document)
    {
        $employee = $request->user()->employee;

        abort_if($document->employee_id !== $employee->id, 403);

        $updateData = $request->only(['description', 'document_type_id']);

        if (!empty($updateData)) {
            $document->update($updateData);
            $document->load('documentType');
        }

        DocumentHelper::appendFormattedSize($document);

        return $this->success(['document' => $document], 'Document updated successfully.');
    }

    public function deleteMyDocument(Request $request, EmployeeDocument $document)
    {
        $employee = $request->user()->employee;

        abort_if($document->employee_id !== $employee->id, 403);

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
            Log::error('Document Deletion Error: ' . $e->getMessage(), ['exception' => $e]);

            return $this->serverError('An error occurred while deleting the document.');
        }
    }

    public function downloadMyDocument(Request $request, EmployeeDocument $document)
    {
        $employee = $request->user()->employee;

        abort_if($document->employee_id !== $employee->id, 403);

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
    // Admin / Manager
    // ==========================

    public function index(Request $request)
    {
        $query = EmployeeDocument::with(['employee', 'documentType', 'uploader']);

        $documents = EmployeeDocument::applyFilters($request, $query);

        $documents->getCollection()
            ->transform(fn($doc) => DocumentHelper::appendFormattedSize($doc));

        return $this->success(['documents' => $documents], 'Documents retrieved successfully.');
    }

    public function show(EmployeeDocument $document)
    {
        $document->load(['employee', 'documentType', 'uploader']);
        DocumentHelper::appendFormattedSize($document);

        return $this->success(['document' => $document], 'Document retrieved successfully.');
    }

    public function download(EmployeeDocument $document)
    {
        if (!Storage::disk('private')->exists($document->file_path)) {
            abort(404, 'The document file was not found.');
        }

        return response()->download(
            storage_path("app/private/{$document->file_path}"),
            $document->file_name,
            ['Content-Type' => $document->mime_type]
        );
    }
}