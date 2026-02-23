<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\HasSearchFilter;

class EmployeeDocument extends Model
{
    use HasSearchFilter;

    // Fillable fields for mass assignment
    protected $fillable = [
        'employee_id',
        'document_type_id',
        'file_name',
        'file_path',
        'file_size',
        'mime_type',
        'description',
        'uploaded_by',
    ];

    // Casts for proper data types
    protected $casts = [
        'file_size' => 'integer',
        'uploaded_by' => 'integer',
    ];

    // 🔥 Searchable fields for global search
    public array $searchable = [
        'file_name',
        'description',
        'employee.first_name',
        'employee.last_name',
        'documentType.name',
        'uploader.email',
    ];

    // 🔥 Filterable fields
    public array $allowedFilters = [
        'employee_id',
        'document_type_id',
        'uploaded_by',
        'created_at_from',
        'created_at_to',
    ];

    // 🔥 Sortable fields
    public array $allowedSorts = [
        'created_at',
        'file_name',
        'file_size',
    ];

    /**
     * Get the employee that owns the document.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Get the user who uploaded the document.
     */
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    /**
     * Get the document type for this document.
     */
    public function documentType(): BelongsTo
    {
        return $this->belongsTo(DocumentType::class);
    }

    /**
     * Get the full file path for storage.
     */
    public function getFullPathAttribute(): string
    {
        return storage_path('app/private/' . $this->file_path);
    }

    /**
     * Get the file size in human readable format.
     */
    public function getFormattedSizeAttribute(): string
    {
        $bytes = $this->file_size;
        if ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            return number_format($bytes / 1024, 2) . ' KB';
        }
        return $bytes . ' B';
    }

    /**
     * Get allowed mime types for documents.
     */
    public static function allowedMimeTypes(): array
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

    /**
     * Scope for filtering documents by employee
     */
    public function scopeForEmployee($query, int $employeeId)
    {
        return $query->where('employee_id', $employeeId);
    }
}