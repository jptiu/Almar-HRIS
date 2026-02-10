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

Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::middleware('auth')->group(function () {
    // Routes accessible to all authenticated users (including employee)
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Routes accessible to admin and manager only
    Route::middleware('role:admin,manager')->group(function () {
        // Company routes (admin only)
        Route::prefix('/companies')->group(function () {
            // Read routes (admin and manager)
            Route::get('/', [CompanyController::class, 'index']);
            Route::get('/{id}', [CompanyController::class, 'show']);
            
            // Admin only routes
            Route::middleware('role:admin')->group(function () {
                Route::post('/', [CompanyController::class, 'store']);
                Route::put('/{id}', [CompanyController::class, 'update']);
                Route::delete('/{id}', [CompanyController::class, 'destroy']);
            });
        });

        // Branch routes (admin only)
        Route::prefix('/branches')->group(function () {
            // Read routes (admin and manager)
            Route::get('/', [BranchController::class, 'index']);
            Route::get('/{id}', [BranchController::class, 'show']);
            
            // Admin only routes
            Route::middleware('role:admin')->group(function () {
                Route::post('/', [BranchController::class, 'store']);
                Route::put('/{id}', [BranchController::class, 'update']);
                Route::delete('/{id}', [BranchController::class, 'destroy']);
            });
        });

        // Department routes
        Route::prefix('/departments')->group(function () {
            Route::get('/', [DepartmentController::class, 'index']);
            Route::get('/{id}', [DepartmentController::class, 'show']);
            Route::post('/', [DepartmentController::class, 'store']);
            Route::put('/{id}', [DepartmentController::class, 'update']);
            Route::delete('/{id}', [DepartmentController::class, 'destroy']);
        });

        // Position routes
        Route::prefix('/positions')->group(function () {
            Route::get('/', [PositionController::class, 'index']);
            Route::post('/', [PositionController::class, 'store']);
            
            // Position Levels (nested under positions) - MUST come before /{id} parameter route
            Route::get('/levels', [PositionLevelController::class, 'index']);
            Route::get('/levels/{id}', [PositionLevelController::class, 'show']);
            
            // Position CRUD routes with {id} parameter - MUST come after specific nested routes
            Route::get('/{id}', [PositionController::class, 'show']);
            Route::put('/{id}', [PositionController::class, 'update']);
            Route::delete('/{id}', [PositionController::class, 'destroy']);
        });

        // Employee routes
        Route::prefix('/employees')->group(function () {
            // Employee nested routes
            Route::get('/', [EmployeeController::class, 'index']);
            Route::post('/', [EmployeeController::class, 'store']);
            
            // Employee Statuses (nested under employees) - MUST come before /{id} parameter route
            Route::get('/statuses', [EmployeeStatusController::class, 'index']);
            Route::get('/statuses/{id}', [EmployeeStatusController::class, 'show']);
            
            // Employee CRUD routes with {id} parameter - MUST come after specific nested routes
            Route::get('/{id}', [EmployeeController::class, 'show']);
            Route::put('/{id}', [EmployeeController::class, 'update']);
            Route::delete('/{id}', [EmployeeController::class, 'destroy']);
        });
    });
});

