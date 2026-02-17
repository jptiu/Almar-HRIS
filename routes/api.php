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
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LeaveController;
use App\Http\Controllers\LeaveTypeController;
use App\Http\Controllers\RequestController;

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

        // Profile
        Route::get('/', [AuthController::class, 'me']);
        Route::put('/', [AuthController::class, 'updateProfile']);
        Route::post('/logout', [AuthController::class, 'logout']);

        Route::post('/switch-role', [AuthController::class, 'switchRole']);

        // My Documents
        Route::prefix('documents')->group(function () {
            Route::get('/', [DocumentController::class, 'myDocuments']);
            Route::post('/', [DocumentController::class, 'storeMyDocument']);
            Route::get('{document}', [DocumentController::class, 'showMyDocument']);
            Route::put('{document}', [DocumentController::class, 'updateMyDocument']);
            Route::delete('{document}', [DocumentController::class, 'deleteMyDocument']);
            Route::get('{document}/download', [DocumentController::class, 'downloadMyDocument']);
        });

        // My Leave (Employee Self-Service)
        Route::prefix('leave')->group(function () {
            Route::get('/credits', [LeaveController::class, 'myLeaveCredits']);
            Route::get('/requests', [LeaveController::class, 'myLeaveRequests']);
            Route::post('/requests', [LeaveController::class, 'submitLeaveRequest']);
            Route::put('/requests/{leaveRequest}', [LeaveController::class, 'cancelMyLeaveRequest']);
        });
    });

    /*
    |--------------------------------------------------------------------------
    | System Reference Data (All Authenticated Users)
    |--------------------------------------------------------------------------
    */
    Route::get('/document-types', [DocumentTypeController::class, 'index']);
    Route::get('/employee-statuses', [EmployeeStatusController::class, 'index']);
    Route::get('/position-levels', [PositionLevelController::class, 'index']);
    Route::get('/leave-types', [LeaveTypeController::class, 'index']);
    Route::get('/dashboard/birthdays', [DashboardController::class, 'birthdays']);
    /*
    |--------------------------------------------------------------------------
    | Admin & Manager Area
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:admin,manager')->group(function () {

        /*
        |--------------------------------------------------------------------------
        | Companies
        |--------------------------------------------------------------------------
        */

        // Read access (admin & manager)
        Route::apiResource('companies', CompanyController::class)
            ->except(['store', 'update', 'destroy']);

        // Write access (admin only)
        Route::middleware('role:admin')->group(function () {
            Route::apiResource('companies', CompanyController::class)
                ->only(['store', 'update', 'destroy']);
        });

        /*
        |--------------------------------------------------------------------------
        | Branches
        |--------------------------------------------------------------------------
        */

        Route::apiResource('branches', BranchController::class)
            ->except(['store', 'update', 'destroy']);

        Route::middleware('role:admin')->group(function () {
            Route::apiResource('branches', BranchController::class)
                ->only(['store', 'update', 'destroy']);
        });

        /*
        |--------------------------------------------------------------------------
        | Departments
        |--------------------------------------------------------------------------
        */
        Route::apiResource('departments', DepartmentController::class);

        /*
        |--------------------------------------------------------------------------
        | Positions
        |--------------------------------------------------------------------------
        */
        Route::apiResource('positions', PositionController::class);


        Route::prefix('employees')->group(function () {
            Route::get('leave-credits', [LeaveController::class, 'index']); // index all employees leave credits

            // Specific employee leave credits
            Route::prefix('{employee}')->group(function () {
                Route::get('/leave-credits', [LeaveController::class, 'show']);    // show employee leave credits
                Route::patch('/leave-credits', [LeaveController::class, 'adjustadLeaveCredits']); // adjust employee leave credits
            });
        });
        /*
        |--------------------------------------------------------------------------
        | Employees
        |--------------------------------------------------------------------------
        */
        Route::apiResource('employees', EmployeeController::class);

        /*
        |--------------------------------------------------------------------------
        | Employee Documents (Unified REST Resource)
        |--------------------------------------------------------------------------
        */
        Route::prefix('documents')->group(function () {

            // List all documents (filterable)
            Route::get('/', [DocumentController::class, 'index']);

            // View specific document
            Route::get('{document}', [DocumentController::class, 'show']);

            // Download
            Route::get('{document}/download', [DocumentController::class, 'download']);
        });

        /*
        |--------------------------------------------------------------------------
        | Dashboard
        |--------------------------------------------------------------------------
        */
        Route::prefix('dashboard')->group(function () {

            Route::get('/overview', [DashboardController::class, 'overview']);
            Route::get('/stats', [DashboardController::class, 'stats']);

            Route::get('/employees-by-status', [DashboardController::class, 'employeesByStatus']);
            Route::get('/employees-by-department', [DashboardController::class, 'employeesByDepartment']);
            Route::get('/employees-by-branch', [DashboardController::class, 'employeesByBranch']);
            Route::get('/employees-by-position', [DashboardController::class, 'employeesByPosition']);

            Route::get('/recent-hires', [DashboardController::class, 'recentHires']);
            Route::get('/hiring-trends', [DashboardController::class, 'hiringTrends']);

            // Salary analytics (admin only)
            Route::middleware('role:admin')->group(function () {
                Route::get('/salary-stats', [DashboardController::class, 'salaryStatsByDepartment']);
            });
        });

        /*
        |--------------------------------------------------------------------------
        | Leave Management (Admin/Manager)
        |--------------------------------------------------------------------------
        */

        // Leave Requests (Admin/Manager)
        Route::prefix('leave-requests')->group(function () {
            Route::get('/', [RequestController::class, 'index']);
            Route::get('{leaveRequest}', [RequestController::class, 'show']);
            Route::put('{leaveRequest}/review', [RequestController::class, 'review']);
        });
    });
});
