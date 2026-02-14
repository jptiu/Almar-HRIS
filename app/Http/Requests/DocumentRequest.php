<?php

namespace App\Http\Requests;

use App\Models\DocumentType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class DocumentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only authenticated users can upload documents
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'document_type_id' => [
                'required',
                'integer',
                Rule::exists('document_types', 'id'),
            ],
            'file' => [
                'required',
                'file',
                'max:10240', // 10MB max
                'mimes:pdf,jpg,jpeg,png,doc,docx',
            ],
            'description' => 'nullable|string|max:500',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'document_type_id.required' => 'The document type is required.',
            'document_type_id.integer' => 'The document type must be a valid ID.',
            'document_type_id.exists' => 'The selected document type is invalid.',
            'file.required' => 'Please upload a file.',
            'file.file' => 'The uploaded file is invalid.',
            'file.max' => 'The file size cannot exceed 10MB.',
            'file.mimes' => 'The file must be a PDF, JPG, PNG, or Word document.',
            'description.max' => 'The description cannot exceed 500 characters.',
        ];
    }

    /**
     * Get allowed mime types.
     */
    public function allowedMimeTypes(): array
    {
        return [
            'application/pdf',
            'image/jpeg',
            'image/png',
            'image/jpg',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
    }
}

