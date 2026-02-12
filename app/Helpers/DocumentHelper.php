<?php

namespace App\Helpers;

use App\Models\EmployeeDocument;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class DocumentHelper
{
    /**
     * Generate a unique file name for uploaded file
     */
    public static function generateUniqueFileName(UploadedFile $file): string
    {
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $extension = $file->getClientOriginalExtension();

        return "{$originalName}_" . Str::uuid() . ".{$extension}";
    }

    /**
     * Append formatted size to EmployeeDocument
     */
    public static function appendFormattedSize(EmployeeDocument $doc): EmployeeDocument
    {
        $doc->formatted_size = $doc->formatted_size;
        return $doc;
    }
}