<?php

namespace App\Http\Controllers;

use App\Models\DocumentType;
use Illuminate\Http\JsonResponse;

class DocumentTypeController extends Controller
{
    /**
     * Display a listing of document types.
     */
    public function index(): JsonResponse
    {
        $documentTypes = DocumentType::where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(function ($type) {
                return [
                    'slug' => $type->slug,
                    'name' => $type->name,
                    'description' => $type->description,
                ];
            });

        return $this->success(['document_types' => $documentTypes], 'Document types retrieved successfully.');
    }

    /**
     * Display the specified document type.
     */
    public function show(DocumentType $documentType): JsonResponse
    {
        // The $documentType is automatically injected by Laravel's route model binding
        return $this->success(['document_type' => $documentType], 'Document type retrieved successfully.');
    }
}