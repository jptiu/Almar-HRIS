<?php

namespace App\Http\Controllers;

use App\Models\EmployeeStatus;
use Illuminate\Http\JsonResponse;

class EmployeeStatusController extends Controller
{
    /**
     * Display a listing of employee statuses.
     */
    public function index(): JsonResponse
    {
        $statuses = EmployeeStatus::orderBy('name')->get();

        return $this->success(['employee_statuses' => $statuses], 'Employee statuses retrieved successfully.');
    }

    /**
     * Display the specified employee status.
     */
    public function show(EmployeeStatus $employeeStatus): JsonResponse
    {
        // $employeeStatus is automatically injected by Laravel's route model binding
        return $this->success(['employee_status' => $employeeStatus], 'Employee status retrieved successfully.');
    }
}