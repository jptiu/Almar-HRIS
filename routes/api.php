<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\EmployeeStatusController;
use App\Http\Controllers\PositionLevelController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\DocumentTypeController;

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::middleware('auth')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Employee Self-Service (/me)
    |--------------------------------------------------------------------------
    */
    Route::prefix('me')->group(function () {
        // Current user info
        Route::get('/', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);

        // Documents (full CRUD)
        Route::get('documents', [DocumentController::class, 'myDocuments']); // list
        Route::post('documents', [DocumentController::class, 'storeMyDocument']); // upload
        Route::get('documents/{document}', [DocumentController::class, 'showMyDocument']); // view
        Route::put('documents/{document}', [DocumentController::class, 'updateMyDocument']); // update
        Route::delete('documents/{document}', [DocumentController::class, 'deleteMyDocument']); // delete
        Route::get('documents/{document}/download', [DocumentController::class, 'downloadMyDocument']); // download
    });

    /*
    |--------------------------------------------------------------------------
    | System Reference Data (accessible by all authenticated users)
    |--------------------------------------------------------------------------
    */
    Route::get('/document-types', [DocumentTypeController::class, 'index']);
    Route::get('/employee-statuses', [EmployeeStatusController::class, 'index']);
    Route::get('/position-levels', [PositionLevelController::class, 'index']);

    /*
    |--------------------------------------------------------------------------
    | Admin & Manager Access
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:admin,manager')->group(function () {

        // Companies (read for manager)
        Route::apiResource('companies', CompanyController::class)
            ->except(['store', 'update', 'destroy']);
        // Admin-only for create/update/delete
        Route::middleware('role:admin')->group(function () {
            Route::apiResource('companies', CompanyController::class)
                ->only(['store', 'update', 'destroy']);
        });

        // Branches (read for manager)
        Route::apiResource('branches', BranchController::class)
            ->except(['store', 'update', 'destroy']);
        // Admin-only for create/update/delete
        Route::middleware('role:admin')->group(function () {
            Route::apiResource('branches', BranchController::class)
                ->only(['store', 'update', 'destroy']);
        });

        // Departments (admin & manager full CRUD)
        Route::apiResource('departments', DepartmentController::class);

        // Positions (admin & manager full CRUD)
        Route::apiResource('positions', PositionController::class);

        // Employees (admin & manager full CRUD)
        Route::apiResource('employees', EmployeeController::class);

        /*
        |--------------------------------------------------------------------------
        | Admin/HR Employee Documents (read-only)
        |--------------------------------------------------------------------------
        */
        Route::prefix('employees/{employee}')->group(function () {
            Route::get('documents', [DocumentController::class, 'index']); // list
            Route::get('documents/{document}', [DocumentController::class, 'show']); // view
            Route::get('documents/{document}/download', [DocumentController::class, 'download']); // download
        });
    });
});