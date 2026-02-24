<?php

namespace App\Http\Controllers;

use App\Http\Requests\DocumentRequest;
use App\Models\EmployeeDocument;
use App\Models\DocumentType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Helpers\DocumentHelper;
use App\Models\Employee;
use Illuminate\Support\Facades\Log;

class DocumentController extends Controller
{
    // ==========================
    // Employee Self-Service (/me)
    // ==========================

    public function myDocuments(Request $request)
    {
        $employee = $request->user()->employee;

        // Optimized query - only fetch what's needed (removed unused uploader eager loading)
        $query = EmployeeDocument::where('employee_id', $employee->id)
            ->select('id', 'employee_id', 'document_type_id', 'file_name', 'description', 'created_at')
            ->with('documentType:id,name');

        $documents = EmployeeDocument::applyFilters($request, $query);

        // Transform to return only required fields
        $documents->getCollection()
            ->transform(fn($doc) => [
                'id' => $doc->id,
                'description' => $doc->description,
                'file_name' => $doc->file_name,
                'document_type' => [
                    'id' => $doc->documentType->id ?? null,
                    'name' => $doc->documentType->name ?? null,
                ],
                'created_at' => $doc->created_at,
            ]);

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

        $document->load(['uploader:id,email', 'documentType']);
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

    /**
     * Get all employees with their documents count (admin/manager view).
     * Returns only employees who have at least one document.
     *
     * Filter options:
     * - company_id
     * - branch_id
     */
    public function index(Request $request)
    {
        $query = Employee::query()
            ->select([
                'employees.id',
                'employees.first_name',
                'employees.middle_name',
                'employees.last_name',
                'employees.company_id',
                'employees.branch_id',
                'positions.title as position',
                'departments.name as department',
            ])
            ->leftJoin('positions', 'employees.position_id', '=', 'positions.id')
            ->leftJoin('departments', 'employees.department_id', '=', 'departments.id')
            ->withCount('documents')
            ->whereHas('documents');

        $searchable = [
            'first_name',
            'last_name',
            'department.name',
            'position.title',
        ];

        $filters = $request->only(['company_id', 'branch_id']);

        $employees = Employee::applyFilters($request, $query, $filters, $searchable);

        return $this->success(
            ['employees' => $employees],
            'Documents retrieved successfully.'
        );
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

    // ==========================
    // Documents Categorized by Type
    // ==========================

    /**
     * Get current user's documents categorized by document type.
     * Endpoint: GET /api/me/documents/by-type
     * Returns all document types, including those with count = 0
     * Only returns document type name and files count
     */
    public function myDocumentsByTypes(Request $request)
    {
        $employee = $request->user()->employee;

        // Get all active document types
        $documentTypes = DocumentType::where('is_active', true)
            ->orderBy('sort_order')
            ->select('id', 'name')
            ->get();

        // Get document counts grouped by document_type_id for this employee
        $counts = EmployeeDocument::where('employee_id', $employee->id)
            ->groupBy('document_type_id')
            ->pluck(DB::raw('COUNT(*) as count'), 'document_type_id');

        // Build response and filter to only include document types with count > 0
        $categories = $documentTypes->map(function ($documentType) use ($counts) {
            return [
                'document_type' => [
                    'id' => $documentType->id,
                    'name' => $documentType->name,
                ],
                'count' => $counts[$documentType->id] ?? 0,
            ];
        })->filter(fn($category) => $category['count'] > 0)->values();

        return $this->success(['categories' => $categories], 'Documents retrieved successfully.');
    }

    /**
     * Get current user's documents by specific document type.
     * Endpoint: GET /api/me/documents/type/{documentType}
     * @param Request $request
     * @param DocumentType $documentType - Document type ID
     */
    public function myDocumentsByTypeId(Request $request, DocumentType $documentType)
    {
        $employee = $request->user()->employee;

        // Build query for this employee's documents of specific type
        $documents = EmployeeDocument::where('employee_id', $employee->id)
            ->where('document_type_id', $documentType->id)
            ->select('id', 'employee_id', 'document_type_id', 'file_name', 'file_size', 'description', 'created_at')
            ->with('documentType:id,name')
            ->get();

        // Transform to return only required fields
        $documents->map(fn($doc) => DocumentHelper::appendFormattedSize($doc));

        $documents = $documents->map(fn($doc) => [
            'id' => $doc->id,
            'description' => $doc->description,
            'file_name' => $doc->file_name,
            'file_size' => $doc->file_size,
            'formatted_size' => $doc->formatted_size ?? null,
            'document_type' => [
                'id' => $doc->documentType->id ?? null,
                'name' => $doc->documentType->name ?? null,
            ],
            'created_at' => $doc->created_at,
        ]);

        return $this->success(['documents' => $documents], 'Documents retrieved successfully.');
    }

    /**
     * Get documents categorized by document type for an employee.
     * Endpoint: GET /api/documents/{employee}/types
     * Returns all document types with their document counts for the specified employee.
     */
    public function documentsByTypes(Employee $employee)
    {
        // Get all active document types
        $documentTypes = DocumentType::where('is_active', true)
            ->orderBy('sort_order')
            ->select('id', 'name')
            ->get();

        // Get document counts grouped by document_type_id for this employee
        $counts = EmployeeDocument::where('employee_id', $employee->id)
            ->groupBy('document_type_id')
            ->pluck(DB::raw('COUNT(*) as count'), 'document_type_id');

        // Build response with document types and counts
        $categories = $documentTypes->map(function ($documentType) use ($counts) {
            return [
                'document_type' => [
                    'id' => $documentType->id,
                    'name' => $documentType->name,
                ],
                'count' => $counts[$documentType->id] ?? 0,
            ];
        })->filter(fn($category) => $category['count'] > 0)->values();

        return $this->success(['categories' => $categories], 'Documents by type retrieved successfully.');
    }

    /**
     * Get documents by specific document type for an employee.
     * Endpoint: GET /api/documents/{employee}/types/{documentType}
     * Returns all documents of the specified type for the employee.
     */
    public function documentsByTypeId(Employee $employee, DocumentType $documentType)
    {
        $documents = EmployeeDocument::where('employee_id', $employee->id)
            ->where('document_type_id', $documentType->id)
            ->select('id', 'employee_id', 'document_type_id', 'file_name', 'file_size', 'description', 'created_at')
            ->with('documentType:id,name')
            ->get();

        $documents->map(fn($doc) => DocumentHelper::appendFormattedSize($doc));

        $documents = $documents->map(fn($doc) => [
            'id' => $doc->id,
            'description' => $doc->description,
            'file_name' => $doc->file_name,
            'file_size' => $doc->file_size,
            'formatted_size' => $doc->formatted_size ?? null,
            'document_type' => [
                'id' => $doc->documentType->id ?? null,
                'name' => $doc->documentType->name ?? null,
            ],
            'created_at' => $doc->created_at,
        ]);

        return $this->success(['documents' => $documents], 'Documents retrieved successfully.');
    }
}
