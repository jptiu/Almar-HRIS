<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\PositionController;

Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::middleware('auth')->group(function () {
    // Routes accessible to all authenticated users (including employee)
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Routes accessible to admin and hr_manager only
    Route::middleware('role:admin,hr_manager')->group(function () {
        // Company routes (admin only)
        Route::middleware('role:admin')->group(function () {
            Route::post('/companies', [CompanyController::class, 'store']);
            Route::put('/companies/{id}', [CompanyController::class, 'update']);
            Route::delete('/companies/{id}', [CompanyController::class, 'destroy']);
        });

        // Company read routes
        Route::get('/companies', [CompanyController::class, 'index']);
        Route::get('/companies/{id}', [CompanyController::class, 'show']);

        // Branch routes (admin only)
        Route::middleware('role:admin')->group(function () {
            Route::post('/branches', [BranchController::class, 'store']);
            Route::put('/branches/{id}', [BranchController::class, 'update']);
            Route::delete('/branches/{id}', [BranchController::class, 'destroy']);
        });

        // Branch read routes
        Route::get('/branches', [BranchController::class, 'index']);
        Route::get('/branches/{id}', [BranchController::class, 'show']);

        // Department routes
        Route::post('/departments', [DepartmentController::class, 'store']);
        Route::put('/departments/{id}', [DepartmentController::class, 'update']);
        Route::delete('/departments/{id}', [DepartmentController::class, 'destroy']);
        Route::get('/departments', [DepartmentController::class, 'index']);
        Route::get('/departments/{id}', [DepartmentController::class, 'show']);

        // Position routes
        Route::post('/positions', [PositionController::class, 'store']);
        Route::put('/positions/{id}', [PositionController::class, 'update']);
        Route::delete('/positions/{id}', [PositionController::class, 'destroy']);
        Route::get('/positions', [PositionController::class, 'index']);
        Route::get('/positions/{id}', [PositionController::class, 'show']);
    });
});

