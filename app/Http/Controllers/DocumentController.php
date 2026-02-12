<?php

namespace App\Http\Controllers;

use App\Http\Requests\DocumentRequest;
use App\Models\Employee;
use App\Models\EmployeeDocument;
use App\Models\DocumentType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Helpers\SearchFilter;
use App\Helpers\DocumentHelper;

class DocumentController extends Controller
{
    // ==========================
    // Employee Self-Service (/me)
    // ==========================
    public function myDocuments(Request $request)
    {
        $employee = $request->user()->employee;

        $documentsQuery = EmployeeDocument::where('employee_id', $employee->id)
            ->with(['uploader:id,name,email', 'documentType']);

        $documents = SearchFilter::for($documentsQuery)
            ->search($request->search) // global search
            ->filters([                // optional filters
                'status' => $request->status,
                'document_type_id' => $request->document_type_id,
            ])
            ->sort($request->sort_by ?? 'created_at', $request->sort_order ?? 'desc')
            ->paginate($request->per_page ?? 15);

        $documents->getCollection()->transform(fn($doc) => DocumentHelper::appendFormattedSize($doc));

        return $this->success([
            'documents' => $documents,
            'filters' => $request->only(['search', 'status', 'document_type_id', 'sort_by', 'sort_order', 'per_page']),
        ], 'Your documents retrieved successfully.');
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
                'employee_id' => $employee->id,
                'document_type_id' => $documentType->id,
                'file_name' => $file->getClientOriginalName(),
                'file_path' => $filePath,
                'file_size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
                'description' => $request->description,
                'uploaded_by' => $request->user()->id,
            ]);

            $document->load('documentType');
            $document->formatted_size = $document->formatted_size;

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
            ->with(['uploader:id,name,email', 'documentType'])
            ->firstOrFail();

        $document->formatted_size = $document->formatted_size;

        return $this->success(['document' => $document], 'Document retrieved successfully.');
    }

    public function updateMyDocument(Request $request, $documentId)
    {
        $employee = $request->user()->employee;

        $document = EmployeeDocument::where('employee_id', $employee->id)
            ->where('id', $documentId)
            ->firstOrFail();

        $updateData = [];
        if ($request->has('description')) $updateData['description'] = $request->description;
        if ($request->has('document_type_id')) $updateData['document_type_id'] = $request->document_type_id;

        if (!empty($updateData)) {
            $document->update($updateData);
            $document->load('documentType');
        }

        $document->formatted_size = $document->formatted_size;

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
    // Admin / Manager
    // ==========================
    public function index(Request $request)
    {
        $documentsQuery = EmployeeDocument::with(['employee', 'documentType', 'uploader']);

        $documents = SearchFilter::for($documentsQuery)
            ->search($request->search)
            ->filters([
                'status' => $request->status,
                'employee_id' => $request->employee_id,
                'document_type_id' => $request->document_type_id,
                'employee.company_id' => $request->company_id,
                'employee.branch_id' => $request->branch_id,
            ])
            ->sort($request->sort_by ?? 'created_at', $request->sort_order ?? 'desc')
            ->paginate($request->per_page ?? 15);

        $documents->getCollection()->transform(fn($doc) => DocumentHelper::appendFormattedSize($doc));

        return $this->success([
            'documents' => $documents,
            'filters' => $request->only([
                'search',
                'status',
                'employee_id',
                'document_type_id',
                'sort_by',
                'sort_order',
                'per_page'
            ]),
        ], 'Documents retrieved successfully.');
    }

    public function show(EmployeeDocument $document)
    {
        $document->load(['employee', 'documentType', 'uploader']);
        $document->formatted_size = DocumentHelper::appendFormattedSize($document);

        return $this->success([
            'document' => $document
        ], 'Document retrieved successfully.');
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
